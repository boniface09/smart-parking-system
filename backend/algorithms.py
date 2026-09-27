from datetime import datetime
from database import get_connection


# ==========================================
# PARKING AVAILABILITY
# ==========================================

def get_parking_statistics():
    """Return total, occupied and available parking slots."""

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM parking_slots
    """)
    total = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) AS occupied
        FROM parking_slots
        WHERE status = 'Occupied'
    """)
    occupied = cursor.fetchone()["occupied"]

    available = total - occupied

    connection.close()

    return {
        "total": total,
        "occupied": occupied,
        "available": available
    }


# ==========================================
# FIND AVAILABLE SLOT
# ==========================================

def find_available_slot():
    """Find the first available parking slot."""

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM parking_slots
        WHERE status = 'Available'
        ORDER BY slot_number
        LIMIT 1
    """)

    slot = cursor.fetchone()

    connection.close()

    return slot


# ==========================================
# VEHICLE ENTRY
# ==========================================

def vehicle_entry(
    registration_no,
    vehicle_type,
    owner_name="",
    phone=""
):
    """
    Register a vehicle and assign an available parking slot.
    """

    # Step 1: Check whether parking is available
    slot = find_available_slot()

    if slot is None:
        return {
            "success": False,
            "message": "Parking is currently full."
        }

    connection = get_connection()
    cursor = connection.cursor()

    try:
        # Step 2: Check whether vehicle is already parked
        cursor.execute("""
            SELECT v.id
            FROM vehicles v
            JOIN parking_records pr
                ON v.id = pr.vehicle_id
            WHERE v.registration_no = ?
            AND pr.status = 'Parked'
        """, (registration_no,))

        existing_vehicle = cursor.fetchone()

        if existing_vehicle:
            return {
                "success": False,
                "message": "This vehicle is already parked."
            }

        # Step 3: Check if vehicle already exists
        cursor.execute("""
            SELECT id
            FROM vehicles
            WHERE registration_no = ?
        """, (registration_no,))

        vehicle = cursor.fetchone()

        if vehicle:
            vehicle_id = vehicle["id"]

        else:
            cursor.execute("""
                INSERT INTO vehicles
                (registration_no, vehicle_type, owner_name, phone)
                VALUES (?, ?, ?, ?)
            """, (
                registration_no,
                vehicle_type,
                owner_name,
                phone
            ))

            vehicle_id = cursor.lastrowid

        # Step 4: Record parking session
        entry_time = datetime.now()

        cursor.execute("""
            INSERT INTO parking_records
            (vehicle_id, slot_id, entry_time, status)
            VALUES (?, ?, ?, 'Parked')
        """, (
            vehicle_id,
            slot["id"],
            entry_time
        ))

        # Step 5: Mark parking slot as occupied
        cursor.execute("""
            UPDATE parking_slots
            SET status = 'Occupied',
                vehicle_id = ?
            WHERE id = ?
        """, (
            vehicle_id,
            slot["id"]
        ))

        connection.commit()

        return {
            "success": True,
            "message": "Vehicle successfully parked.",
            "slot": slot["slot_number"],
            "entry_time": entry_time.strftime("%Y-%m-%d %H:%M:%S")
        }

    except Exception as error:
        connection.rollback()

        return {
            "success": False,
            "message": f"An error occurred: {error}"
        }

    finally:
        connection.close()


# ==========================================
# PARKING FEE CALCULATION
# ==========================================

def calculate_parking_fee(duration_minutes):
    """
    Calculate parking fee based on duration.

    Tariff used for this project:
    First hour: KSh 100
    Every additional hour: KSh 50
    Maximum daily charge: KSh 500
    """

    if duration_minutes <= 0:
        return 0

    # Convert minutes into billable hours.
    # Any fraction of an hour counts as a full hour.
    hours = (duration_minutes + 59) // 60

    if hours <= 1:
        amount = 100
    else:
        amount = 100 + ((hours - 1) * 50)

    # Maximum daily charge
    amount = min(amount, 500)

    return amount


# ==========================================
# VEHICLE EXIT
# ==========================================

def vehicle_exit(registration_no, payment_method):
    """
    Process vehicle exit, calculate duration and parking fee,
    record payment information and release the parking slot.
    """

    connection = get_connection()
    cursor = connection.cursor()

    try:
        # Step 1: Find the currently parked vehicle
        cursor.execute("""
            SELECT
                pr.id AS record_id,
                pr.entry_time,
                pr.slot_id,
                v.id AS vehicle_id,
                v.registration_no,
                ps.slot_number
            FROM parking_records pr
            JOIN vehicles v
                ON pr.vehicle_id = v.id
            JOIN parking_slots ps
                ON pr.slot_id = ps.id
            WHERE v.registration_no = ?
            AND pr.status = 'Parked'
            LIMIT 1
        """, (registration_no,))

        record = cursor.fetchone()

        if record is None:
            return {
                "success": False,
                "message": "Vehicle not found in the parking lot."
            }

        # Step 2: Get exit time
        exit_time = datetime.now()

        # SQLite stores the datetime as text, so convert it back
        entry_time = datetime.fromisoformat(record["entry_time"])

        # Step 3: Calculate duration
        duration_seconds = (
            exit_time - entry_time
        ).total_seconds()

        duration_minutes = max(
            1,
            int(duration_seconds / 60)
        )

        # Step 4: Calculate parking fee
        amount = calculate_parking_fee(duration_minutes)

        # Step 5: Update parking record
        cursor.execute("""
            UPDATE parking_records
            SET exit_time = ?,
                duration = ?,
                amount = ?,
                status = 'Completed'
            WHERE id = ?
        """, (
            exit_time,
            duration_minutes,
            amount,
            record["record_id"]
        ))

        # Step 6: Release parking slot
        cursor.execute("""
            UPDATE parking_slots
            SET status = 'Available',
                vehicle_id = NULL
            WHERE id = ?
        """, (record["slot_id"],))

        # Step 7: Record payment
        cursor.execute("""
            INSERT INTO payments
            (parking_record_id, amount, payment_method, payment_time)
            VALUES (?, ?, ?, ?)
        """, (
            record["record_id"],
            amount,
            payment_method,
            exit_time
        ))

        connection.commit()

        return {
            "success": True,
            "message": "Vehicle exit processed successfully.",
            "registration_no": record["registration_no"],
            "slot": record["slot_number"],
            "entry_time": entry_time.strftime("%Y-%m-%d %H:%M:%S"),
            "exit_time": exit_time.strftime("%Y-%m-%d %H:%M:%S"),
            "duration_minutes": duration_minutes,
            "amount": amount,
            "payment_method": payment_method
        }

    except Exception as error:
        connection.rollback()

        return {
            "success": False,
            "message": f"An error occurred: {error}"
        }

    finally:
        connection.close()