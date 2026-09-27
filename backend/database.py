import sqlite3
from pathlib import Path


# ==========================================
# DATABASE CONFIGURATION
# ==========================================

DATABASE_DIR = Path("database")
DATABASE_DIR.mkdir(exist_ok=True)

DATABASE_PATH = DATABASE_DIR / "parking.db"


# ==========================================
# DATABASE CONNECTION
# ==========================================

def get_connection():
    """Create and return a database connection."""

    connection = sqlite3.connect(DATABASE_PATH)

    # Return database rows as dictionary-like objects
    connection.row_factory = sqlite3.Row

    # Enable foreign key support
    connection.execute("PRAGMA foreign_keys = ON")

    return connection


# ==========================================
# INITIALIZE DATABASE
# ==========================================

def initialize_database():
    """Create all required database tables."""

    connection = get_connection()
    cursor = connection.cursor()

    # ------------------------------------------
    # Parking Slots
    # ------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS parking_slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slot_number TEXT NOT NULL UNIQUE,
            status TEXT NOT NULL DEFAULT 'Available',
            vehicle_id INTEGER
        )
    """)

    # ------------------------------------------
    # Vehicles
    # ------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            registration_no TEXT NOT NULL UNIQUE,
            vehicle_type TEXT NOT NULL,
            owner_name TEXT,
            phone TEXT
        )
    """)

    # ------------------------------------------
    # Parking Records
    # ------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS parking_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vehicle_id INTEGER NOT NULL,
            slot_id INTEGER NOT NULL,
            entry_time DATETIME NOT NULL,
            exit_time DATETIME,
            duration INTEGER,
            amount REAL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'Parked',

            FOREIGN KEY (vehicle_id)
                REFERENCES vehicles(id),

            FOREIGN KEY (slot_id)
                REFERENCES parking_slots(id)
        )
    """)

    # ------------------------------------------
    # Payments
    # ------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            parking_record_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            payment_method TEXT NOT NULL,
            payment_time DATETIME NOT NULL,

            FOREIGN KEY (parking_record_id)
                REFERENCES parking_records(id)
        )
    """)

    # ------------------------------------------
    # Admin Users
    # ------------------------------------------

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    """)

    # ------------------------------------------
    # Create Default Administrator
    # ------------------------------------------

    cursor.execute("""
        SELECT id
        FROM admin_users
        LIMIT 1
    """)

    admin_exists = cursor.fetchone()

    if not admin_exists:

        cursor.execute("""
            INSERT INTO admin_users (username, password)
            VALUES (?, ?)
        """, ("admin", "admin123"))

    # ------------------------------------------
    # Save Changes
    # ------------------------------------------

    connection.commit()
    connection.close()

    print("Database initialized successfully.")


# ==========================================
# CREATE DEFAULT PARKING SLOTS
# ==========================================

def create_default_slots():
    """Create the default 50 parking slots."""

    connection = get_connection()
    cursor = connection.cursor()

    for row in ["A", "B", "C", "D", "E"]:

        for number in range(1, 11):

            slot_number = f"{row}{number:02d}"

            cursor.execute("""
                INSERT OR IGNORE INTO parking_slots
                (slot_number, status)
                VALUES (?, 'Available')
            """, (slot_number,))

    connection.commit()
    connection.close()

    print("Default parking slots created.")


# ==========================================
# RUN DATABASE SETUP DIRECTLY
# ==========================================

if __name__ == "__main__":

    initialize_database()
    create_default_slots()

