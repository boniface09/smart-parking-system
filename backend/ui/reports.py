import tkinter as tk
from tkinter import ttk
from datetime import datetime

from database import get_connection


class ReportsWindow(tk.Toplevel):

    def __init__(self, parent):
        super().__init__(parent)

        self.title("Reports & Analytics")
        self.geometry("1100x700")
        self.minsize(950, 600)

        self.configure(bg="#f5f6fa")

        self.create_header()
        self.create_summary_cards()
        self.create_payment_summary()
        self.create_history_table()

        self.load_reports()

    # ---------------------------------------------------------
    # HEADER
    # ---------------------------------------------------------

    def create_header(self):

        header = tk.Frame(
            self,
            bg="#1f2937",
            height=70
        )

        header.pack(fill="x")
        header.pack_propagate(False)

        title = tk.Label(
            header,
            text="REPORTS & ANALYTICS",
            font=("Arial", 22, "bold"),
            fg="white",
            bg="#1f2937"
        )

        title.pack(
            side="left",
            padx=25,
            pady=20
        )

        refresh_button = tk.Button(
            header,
            text="Refresh",
            command=self.load_reports,
            font=("Arial", 10, "bold"),
            bg="#2563eb",
            fg="white",
            relief="flat",
            padx=15,
            pady=7
        )

        refresh_button.pack(
            side="right",
            padx=25
        )

    # ---------------------------------------------------------
    # SUMMARY CARDS
    # ---------------------------------------------------------

    def create_summary_cards(self):

        cards_frame = tk.Frame(
            self,
            bg="#f5f6fa"
        )

        cards_frame.pack(
            fill="x",
            padx=20,
            pady=20
        )

        self.today_label = self.create_card(
            cards_frame,
            "Today's Vehicles",
            0
        )

        self.parked_label = self.create_card(
            cards_frame,
            "Currently Parked",
            1
        )

        self.completed_label = self.create_card(
            cards_frame,
            "Completed Sessions",
            2
        )

        self.revenue_label = self.create_card(
            cards_frame,
            "Today's Revenue",
            3
        )

        self.occupancy_label = self.create_card(
            cards_frame,
            "Occupancy Rate",
            4
        )

    def create_card(self, parent, title, column):

        card = tk.Frame(
            parent,
            bg="white",
            bd=1,
            relief="solid"
        )

        card.grid(
            row=0,
            column=column,
            padx=7,
            sticky="nsew"
        )

        parent.grid_columnconfigure(
            column,
            weight=1
        )

        title_label = tk.Label(
            card,
            text=title,
            font=("Arial", 10),
            fg="#6b7280",
            bg="white"
        )

        title_label.pack(
            pady=(15, 5)
        )

        value_label = tk.Label(
            card,
            text="0",
            font=("Arial", 20, "bold"),
            fg="#111827",
            bg="white"
        )

        value_label.pack(
            pady=(0, 15)
        )

        return value_label

    # ---------------------------------------------------------
    # PAYMENT SUMMARY
    # ---------------------------------------------------------

    def create_payment_summary(self):

        frame = tk.LabelFrame(
            self,
            text="Revenue by Payment Method",
            font=("Arial", 11, "bold"),
            bg="#f5f6fa",
            padx=15,
            pady=10
        )

        frame.pack(
            fill="x",
            padx=20,
            pady=(0, 15)
        )

        self.cash_label = tk.Label(
            frame,
            text="Cash: KSh 0.00",
            font=("Arial", 11, "bold"),
            bg="#f5f6fa"
        )

        self.cash_label.pack(
            side="left",
            padx=25
        )

        self.mpesa_label = tk.Label(
            frame,
            text="M-Pesa: KSh 0.00",
            font=("Arial", 11, "bold"),
            bg="#f5f6fa"
        )

        self.mpesa_label.pack(
            side="left",
            padx=25
        )

        self.card_label = tk.Label(
            frame,
            text="Card: KSh 0.00",
            font=("Arial", 11, "bold"),
            bg="#f5f6fa"
        )

        self.card_label.pack(
            side="left",
            padx=25
        )

    # ---------------------------------------------------------
    # HISTORY TABLE
    # ---------------------------------------------------------

    def create_history_table(self):

        frame = tk.LabelFrame(
            self,
            text="Parking History",
            font=("Arial", 11, "bold"),
            bg="#f5f6fa"
        )

        frame.pack(
            fill="both",
            expand=True,
            padx=20,
            pady=(0, 20)
        )

        columns = (
            "registration",
            "type",
            "slot",
            "entry",
            "exit",
            "duration",
            "amount",
            "payment"
        )

        self.history_table = ttk.Treeview(
            frame,
            columns=columns,
            show="headings"
        )

        headings = {
            "registration": "Registration",
            "type": "Vehicle Type",
            "slot": "Slot",
            "entry": "Entry Time",
            "exit": "Exit Time",
            "duration": "Duration",
            "amount": "Amount",
            "payment": "Payment"
        }

        widths = {
            "registration": 110,
            "type": 100,
            "slot": 70,
            "entry": 150,
            "exit": 150,
            "duration": 90,
            "amount": 90,
            "payment": 90
        }

        for column in columns:

            self.history_table.heading(
                column,
                text=headings[column]
            )

            self.history_table.column(
                column,
                width=widths[column],
                anchor="center"
            )

        scrollbar = ttk.Scrollbar(
            frame,
            orient="vertical",
            command=self.history_table.yview
        )

        self.history_table.configure(
            yscrollcommand=scrollbar.set
        )

        self.history_table.pack(
            side="left",
            fill="both",
            expand=True
        )

        scrollbar.pack(
            side="right",
            fill="y"
        )

    # ---------------------------------------------------------
    # LOAD REPORTS
    # ---------------------------------------------------------

    def load_reports(self):

        connection = get_connection()
        cursor = connection.cursor()

        today = datetime.now().strftime("%Y-%m-%d")

        # Today's vehicles
        cursor.execute("""
            SELECT COUNT(*)
            FROM parking_records
            WHERE DATE(entry_time) = ?
        """, (today,))

        today_vehicles = cursor.fetchone()[0]

        # Currently parked
        cursor.execute("""
            SELECT COUNT(*)
            FROM parking_records
            WHERE status = 'Parked'
        """)

        currently_parked = cursor.fetchone()[0]

        # Completed sessions
        cursor.execute("""
            SELECT COUNT(*)
            FROM parking_records
            WHERE status = 'Completed'
        """)

        completed_sessions = cursor.fetchone()[0]

        # Today's revenue
        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0)
            FROM parking_records
            WHERE status = 'Completed'
            AND DATE(exit_time) = ?
        """, (today,))

        today_revenue = cursor.fetchone()[0]

        # Parking statistics
        cursor.execute("""
            SELECT COUNT(*)
            FROM parking_slots
        """)

        total_slots = cursor.fetchone()[0]

        cursor.execute("""
            SELECT COUNT(*)
            FROM parking_slots
            WHERE status = 'Occupied'
        """)

        occupied_slots = cursor.fetchone()[0]

        if total_slots > 0:
            occupancy_rate = (
                occupied_slots / total_slots
            ) * 100
        else:
            occupancy_rate = 0

        # Update summary cards

        self.today_label.config(
            text=str(today_vehicles)
        )

        self.parked_label.config(
            text=str(currently_parked)
        )

        self.completed_label.config(
            text=str(completed_sessions)
        )

        self.revenue_label.config(
            text=f"KSh {today_revenue:,.2f}"
        )

        self.occupancy_label.config(
            text=f"{occupancy_rate:.1f}%"
        )

        # -----------------------------------------------------
        # PAYMENT METHOD REVENUE
        # -----------------------------------------------------

        cursor.execute("""
            SELECT
                p.payment_method,
                COALESCE(SUM(p.amount), 0)
            FROM payments p
            JOIN parking_records pr
                ON p.parking_record_id = pr.id
            WHERE DATE(p.payment_time) = ?
            GROUP BY p.payment_method
        """, (today,))

        payment_data = cursor.fetchall()

        cash = 0
        mpesa = 0
        card = 0

        for row in payment_data:

            method = row["payment_method"]
            amount = row[1]

            if method == "Cash":
                cash = amount

            elif method == "M-Pesa":
                mpesa = amount

            elif method == "Card":
                card = amount

        self.cash_label.config(
            text=f"Cash: KSh {cash:,.2f}"
        )

        self.mpesa_label.config(
            text=f"M-Pesa: KSh {mpesa:,.2f}"
        )

        self.card_label.config(
            text=f"Card: KSh {card:,.2f}"
        )

        # -----------------------------------------------------
        # HISTORY TABLE
        # -----------------------------------------------------

        for item in self.history_table.get_children():
            self.history_table.delete(item)

        cursor.execute("""
            SELECT
                v.registration_no,
                v.vehicle_type,
                ps.slot_number,
                pr.entry_time,
                pr.exit_time,
                pr.duration,
                pr.amount,
                p.payment_method
            FROM parking_records pr
            JOIN vehicles v
                ON pr.vehicle_id = v.id
            JOIN parking_slots ps
                ON pr.slot_id = ps.id
            LEFT JOIN payments p
                ON pr.id = p.parking_record_id
            ORDER BY pr.entry_time DESC
        """)

        records = cursor.fetchall()

        for row in records:

            duration = row["duration"]

            if duration is not None:

                hours = duration // 60
                minutes = duration % 60

                if hours > 0:
                    duration_text = f"{hours}h {minutes}m"
                else:
                    duration_text = f"{minutes}m"

            else:
                duration_text = "Still parked"

            amount = row["amount"] or 0

            self.history_table.insert(
                "",
                "end",
                values=(
                    row["registration_no"],
                    row["vehicle_type"],
                    row["slot_number"],
                    row["entry_time"],
                    row["exit_time"] or "-",
                    duration_text,
                    f"KSh {amount:,.2f}",
                    row["payment_method"] or "-"
                )
            )

        connection.close()