
from flask import Flask, jsonify, request
from flask_cors import CORS

from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from database import get_connection, initialize_database, create_default_slots
from algorithms import (
    get_parking_statistics,
    vehicle_entry,
    vehicle_exit
)


# ==========================================
# CREATE FLASK APPLICATION
# ==========================================

app = Flask(__name__)

CORS(app)


# ==========================================
# JWT CONFIGURATION
# ==========================================

# IMPORTANT:
# This secret key is used to sign JWT tokens.
# For the university project this is sufficient.
# In a real production system, store this in
# an environment variable instead.

app.config["JWT_SECRET_KEY"] = "smart-parking-system-secret-key-2026"

jwt = JWTManager(app)


# ==========================================
# INITIALIZE DATABASE
# ==========================================

initialize_database()
create_default_slots()


# ==========================================
# ADMIN USER AUTHENTICATION
# ==========================================

# Administrator credentials are stored in the
# SQLite database (admin_users table).

# ==========================================
# HEALTH CHECK
# ==========================================

@app.route("/api/health", methods=["GET"])
def health_check():

    return jsonify({
        "success": True,
        "message": "Smart Parking API is running."
    })


# ==========================================
# AUTHENTICATION / LOGIN
# ==========================================

@app.route("/api/auth/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No login data was provided."
        }), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Username and password are required."
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT id, username, password
        FROM admin_users
        WHERE username = ?
        LIMIT 1
    """, (username,))

    admin = cursor.fetchone()

    connection.close()

    if not admin or admin["password"] != password:
        return jsonify({
            "success": False,
            "message": "Invalid username or password."
        }), 401

    # Create JWT access token
    access_token = create_access_token(
        identity=admin["username"]
    )

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "access_token": access_token,
        "user": {
            "username": admin["username"],
            "role": "admin"
        }
    }), 200

# ==========================================
# ADMIN PROFILE / SETTINGS
# ==========================================

@app.route("/api/auth/profile", methods=["PUT"])
@jwt_required()
def update_admin_profile():

    current_username = get_jwt_identity()

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No profile data was provided."
        }), 400

    current_password = data.get("current_password")
    new_username = data.get("new_username")
    new_password = data.get("new_password")

    # --------------------------------------
    # Validate required fields
    # --------------------------------------

    if not current_password:
        return jsonify({
            "success": False,
            "message": "Current password is required."
        }), 400

    if not new_username:
        return jsonify({
            "success": False,
            "message": "New username is required."
        }), 400

    if not new_password:
        return jsonify({
            "success": False,
            "message": "New password is required."
        }), 400

    # --------------------------------------
    # Connect to database
    # --------------------------------------

    connection = get_connection()
    cursor = connection.cursor()

    # Find currently authenticated administrator
    cursor.execute("""
        SELECT id, username, password
        FROM admin_users
        WHERE username = ?
        LIMIT 1
    """, (current_username,))

    admin = cursor.fetchone()

    if not admin:
        connection.close()

        return jsonify({
            "success": False,
            "message": "Administrator account was not found."
        }), 404

    # --------------------------------------
    # Verify current password
    # --------------------------------------

    if admin["password"] != current_password:
        connection.close()

        return jsonify({
            "success": False,
            "message": "Current password is incorrect."
        }), 401

    # --------------------------------------
    # Check whether username is already used
    # --------------------------------------

    cursor.execute("""
        SELECT id
        FROM admin_users
        WHERE username = ?
        AND id != ?
        LIMIT 1
    """, (new_username, admin["id"]))

    existing_username = cursor.fetchone()

    if existing_username:
        connection.close()

        return jsonify({
            "success": False,
            "message": "That username is already in use."
        }), 409

    # --------------------------------------
    # Validate new password
    # --------------------------------------

    if len(new_password) < 6:
        connection.close()

        return jsonify({
            "success": False,
            "message": "New password must contain at least 6 characters."
        }), 400

    # --------------------------------------
    # Update administrator credentials
    # --------------------------------------

    cursor.execute("""
        UPDATE admin_users
        SET username = ?, password = ?
        WHERE id = ?
    """, (
        new_username,
        new_password,
        admin["id"]
    ))

    connection.commit()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Administrator credentials updated successfully.",
        "user": {
            "username": new_username,
            "role": "admin"
        }
    }), 200

# ==========================================
# DASHBOARD
# ==========================================

@app.route("/api/dashboard", methods=["GET"])
def dashboard():

    stats = get_parking_statistics()

    return jsonify({
        "success": True,
        "data": stats
    })


# ==========================================
# PARKING SLOTS
# ==========================================

@app.route("/api/slots", methods=["GET"])
def get_slots():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            id,
            slot_number,
            status,
            vehicle_id
        FROM parking_slots
        ORDER BY slot_number
    """)

    slots = [dict(row) for row in cursor.fetchall()]

    connection.close()

    return jsonify({
        "success": True,
        "data": slots
    })


# ==========================================
# VEHICLE ENTRY
# ==========================================

@app.route("/api/vehicles/entry", methods=["POST"])
@jwt_required()
def vehicle_entry_api():

    # Get the currently authenticated user
    current_user = get_jwt_identity()

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data was provided."
        }), 400

    registration_no = data.get("registration_no")
    vehicle_type = data.get("vehicle_type")
    owner_name = data.get("owner_name", "")
    phone = data.get("phone", "")

    if not registration_no or not vehicle_type:
        return jsonify({
            "success": False,
            "message": "Registration number and vehicle type are required."
        }), 400

    result = vehicle_entry(
        registration_no,
        vehicle_type,
        owner_name,
        phone
    )

    return jsonify(result)


# ==========================================
# VEHICLE EXIT
# ==========================================

@app.route("/api/vehicles/exit", methods=["POST"])
@jwt_required()
def vehicle_exit_api():

    # Get the currently authenticated user
    current_user = get_jwt_identity()

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data was provided."
        }), 400

    registration_no = data.get("registration_no")
    payment_method = data.get("payment_method")

    if not registration_no or not payment_method:
        return jsonify({
            "success": False,
            "message": "Registration number and payment method are required."
        }), 400

    result = vehicle_exit(
        registration_no,
        payment_method
    )

    return jsonify(result)


# ==========================================
# VEHICLE RECORDS
# ==========================================

@app.route("/api/vehicles", methods=["GET"])
@jwt_required()
def get_vehicles():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            v.id,
            v.registration_no,
            v.vehicle_type,
            v.owner_name,
            v.phone,
            pr.id AS parking_record_id,
            pr.entry_time,
            pr.exit_time,
            pr.duration,
            pr.amount,
            pr.status,
            ps.slot_number
        FROM vehicles v
        LEFT JOIN parking_records pr
            ON v.id = pr.vehicle_id
        LEFT JOIN parking_slots ps
            ON pr.slot_id = ps.id
        ORDER BY v.id DESC
    """)

    vehicles = [dict(row) for row in cursor.fetchall()]

    connection.close()

    return jsonify({
        "success": True,
        "data": vehicles
    })


# ==========================================
# PARKING REPORTS
# ==========================================

@app.route("/api/reports", methods=["GET"])
@jwt_required()
def reports():

    connection = get_connection()
    cursor = connection.cursor()

    # --------------------------------------
    # Total vehicles
    # --------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM vehicles
    """)

    total_vehicles = cursor.fetchone()["total"]


    # --------------------------------------
    # Currently parked
    # --------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS currently_parked
        FROM parking_records
        WHERE status = 'Parked'
    """)

    currently_parked = cursor.fetchone()["currently_parked"]


    # --------------------------------------
    # Completed parking sessions
    # --------------------------------------

    cursor.execute("""
        SELECT COUNT(*) AS completed_sessions
        FROM parking_records
        WHERE status = 'Completed'
    """)

    completed_sessions = cursor.fetchone()["completed_sessions"]


    # --------------------------------------
    # Total revenue
    # --------------------------------------

    cursor.execute("""
        SELECT COALESCE(SUM(amount), 0) AS total_revenue
        FROM payments
    """)

    total_revenue = cursor.fetchone()["total_revenue"]


    connection.close()

    return jsonify({
        "success": True,
        "data": {
            "total_vehicles": total_vehicles,
            "currently_parked": currently_parked,
            "completed_sessions": completed_sessions,
            "total_revenue": total_revenue
        }
    })


# ==========================================
# JWT ERROR HANDLERS
# ==========================================

@jwt.unauthorized_loader
def handle_missing_token(error):

    return jsonify({
        "success": False,
        "message": "Authentication is required.",
        "error": error
    }), 401


@jwt.invalid_token_loader
def handle_invalid_token(error):

    return jsonify({
        "success": False,
        "message": "Invalid authentication token.",
        "error": error
    }), 401


@jwt.expired_token_loader
def handle_expired_token(jwt_header, jwt_payload):

    return jsonify({
        "success": False,
        "message": "Authentication token has expired. Please log in again."
    }), 401


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )

