import tkinter as tk
from tkinter import messagebox

from ui.reports import ReportsWindow
from ui.vehicles import VehicleRecordsWindow
from ui.exit import VehicleExitWindow
from ui.entry import VehicleEntryWindow
from database import initialize_database, create_default_slots
from algorithms import get_parking_statistics


class SmartParkingApp(tk.Tk):

    def __init__(self):
        super().__init__()

        self.title("Smart Parking Management System")
        self.geometry("1200x750")
        self.minsize(1000, 650)

        self.configure(bg="#f4f6f8")

        # Initialize database
        initialize_database()
        create_default_slots()

        self.create_header()
        self.create_dashboard()
        self.create_parking_map()

        self.refresh_dashboard()

    # ==========================================
    # HEADER
    # ==========================================

    def create_header(self):

        header = tk.Frame(
            self,
            bg="#1f2937",
            height=75
        )

        header.pack(
            fill="x"
        )

        header.pack_propagate(False)

        title = tk.Label(
            header,
            text="SMART PARKING",
            font=("Arial", 22, "bold"),
            fg="white",
            bg="#1f2937"
        )

        title.pack(
            side="left",
            padx=30
        )

        subtitle = tk.Label(
            header,
            text="Parking Management System",
            font=("Arial", 11),
            fg="#d1d5db",
            bg="#1f2937"
        )

        subtitle.pack(
            side="left"
        )

    # ==========================================
    # DASHBOARD CARDS
    # ==========================================

    def create_dashboard(self):

        dashboard = tk.Frame(
            self,
            bg="#f4f6f8"
        )

        dashboard.pack(
            fill="x",
            padx=30,
            pady=25
        )

        self.total_card = self.create_card(
            dashboard,
            "TOTAL SLOTS",
            "0"
        )

        self.total_card.pack(
            side="left",
            fill="both",
            expand=True,
            padx=8
        )

        self.available_card = self.create_card(
            dashboard,
            "AVAILABLE",
            "0"
        )

        self.available_card.pack(
            side="left",
            fill="both",
            expand=True,
            padx=8
        )

        self.occupied_card = self.create_card(
            dashboard,
            "OCCUPIED",
            "0"
        )

        self.occupied_card.pack(
            side="left",
            fill="both",
            expand=True,
            padx=8
        )

        # Buttons
        buttons = tk.Frame(
            self,
            bg="#f4f6f8"
        )

        buttons.pack(
            fill="x",
            padx=30
        )

        entry_button = tk.Button(
            buttons,
            text="🚗  VEHICLE ENTRY",
            font=("Arial", 12, "bold"),
            bg="#2563eb",
            fg="white",
            activebackground="#1d4ed8",
            activeforeground="white",
            padx=25,
            pady=12,
            relief="flat",
            cursor="hand2",
            command=self.vehicle_entry
        )

        entry_button.pack(
            side="left",
            padx=8
        )

        exit_button = tk.Button(
            buttons,
            text="🚪  VEHICLE EXIT",
            font=("Arial", 12, "bold"),
            bg="#dc2626",
            fg="white",
            activebackground="#b91c1c",
            activeforeground="white",
            padx=25,
            pady=12,
            relief="flat",
            cursor="hand2",
            command=self.vehicle_exit
        )

        exit_button.pack(
            side="left",
            padx=8
        )

        records_button = tk.Button(
    buttons,
    text="📋  VEHICLE RECORDS",
    font=("Arial", 11, "bold"),
    bg="#059669",
    fg="white",
    activebackground="#047857",
    activeforeground="white",
    padx=20,
    pady=12,
    relief="flat",
    cursor="hand2",
    command=self.vehicle_records
    )

        records_button.pack(
        side="right",
        padx=8
        )

        refresh_button = tk.Button(
            buttons,
            text="🔄  REFRESH",
            font=("Arial", 11, "bold"),
            bg="#374151",
            fg="white",
            activebackground="#1f2937",
            activeforeground="white",
            padx=20,
            pady=12,
            relief="flat",
            cursor="hand2",
            command=self.refresh_dashboard
        )

        refresh_button.pack(
            side="right",
            padx=8
        )

        reports_button = tk.Button(
            buttons,
            text="Reports",
            command=self.reports,
            font=("Arial", 10, "bold"),
            bg="#7c3aed",
            fg="white",
            relief="flat",
            padx=15,
            pady=8
        )

        reports_button.pack(
            side="left",
            padx=5
        )

    # ==========================================
    # DASHBOARD CARD
    # ==========================================

    def create_card(self, parent, title, value):

        card = tk.Frame(
            parent,
            bg="white",
            height=100,
            bd=1,
            relief="solid"
        )

        title_label = tk.Label(
            card,
            text=title,
            font=("Arial", 10, "bold"),
            fg="#6b7280",
            bg="white"
        )

        title_label.pack(
            pady=(15, 2)
        )

        value_label = tk.Label(
            card,
            text=value,
            font=("Arial", 28, "bold"),
            fg="#111827",
            bg="white"
        )

        value_label.pack()

        card.value_label = value_label

        return card

    # ==========================================
    # PARKING MAP
    # ==========================================

    def create_parking_map(self):

        container = tk.Frame(
            self,
            bg="#f4f6f8"
        )

        container.pack(
            fill="both",
            expand=True,
            padx=30,
            pady=25
        )

        title = tk.Label(
            container,
            text="Parking Slot Availability",
            font=("Arial", 16, "bold"),
            fg="#111827",
            bg="#f4f6f8"
        )

        title.pack(
            anchor="w",
            pady=(0, 10)
        )

        self.slot_frame = tk.Frame(
            container,
            bg="white",
            bd=1,
            relief="solid"
        )

        self.slot_frame.pack(
            fill="both",
            expand=True
        )

        self.create_slot_buttons()

    def create_slot_buttons(self):

        # Clear existing buttons
        for widget in self.slot_frame.winfo_children():
            widget.destroy()

        connection_stats = get_parking_statistics()

        # We will display 50 slots
        for row_index, row in enumerate(
            ["A", "B", "C", "D", "E"]
        ):

            for col_index in range(10):

                slot_number = f"{row}{col_index + 1:02d}"

                button = tk.Button(
                    self.slot_frame,
                    text=f"🅿\n{slot_number}",
                    font=("Arial", 9, "bold"),
                    width=8,
                    height=3,
                    bg="#dcfce7",
                    fg="#166534",
                    relief="flat"
                )

                button.grid(
                    row=row_index,
                    column=col_index,
                    padx=8,
                    pady=8
                )

    # ==========================================
    # REFRESH DASHBOARD
    # ==========================================

    def refresh_dashboard(self):

        stats = get_parking_statistics()

        self.total_card.value_label.config(
            text=stats["total"]
        )

        self.available_card.value_label.config(
            text=stats["available"]
        )

        self.occupied_card.value_label.config(
            text=stats["occupied"]
        )

        self.update_slot_status()

    # ==========================================
    # UPDATE SLOT STATUS
    # ==========================================

    def update_slot_status(self):

        from database import get_connection

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT slot_number, status
            FROM parking_slots
            ORDER BY slot_number
        """)

        slots = cursor.fetchall()

        connection.close()

        buttons = self.slot_frame.winfo_children()

        for index, slot in enumerate(slots):

            if index >= len(buttons):
                break

            button = buttons[index]

            if slot["status"] == "Occupied":

                button.config(
                    bg="#fee2e2",
                    fg="#991b1b"
                )

            else:

                button.config(
                    bg="#dcfce7",
                    fg="#166534"
                )

    # ==========================================
    # VEHICLE ENTRY
    # ==========================================

    def vehicle_entry(self):

        VehicleEntryWindow(self, on_success=self.refresh_dashboard)

    # ==========================================
    # VEHICLE EXIT
    # ==========================================

    def vehicle_exit(self):

        VehicleExitWindow(self, on_success=self.refresh_dashboard)
        
    def vehicle_records(self):

        VehicleRecordsWindow(self)
    
    def reports(self):
        ReportsWindow(self)

# ==========================================
# START APPLICATION
# ==========================================

if __name__ == "__main__":

    app = SmartParkingApp()

    app.mainloop()