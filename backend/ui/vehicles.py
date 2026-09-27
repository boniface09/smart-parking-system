import tkinter as tk
from tkinter import ttk

from database import get_connection


class VehicleRecordsWindow(tk.Toplevel):

    def __init__(self, parent):
        super().__init__(parent)

        self.title("Vehicle Records")
        self.geometry("1100x600")
        self.minsize(900, 500)

        self.configure(bg="#f4f6f8")

        self.create_interface()
        self.load_records()

    # ==========================================
    # INTERFACE
    # ==========================================

    def create_interface(self):

        # Header
        header = tk.Frame(
            self,
            bg="#1f2937",
            height=70
        )

        header.pack(fill="x")
        header.pack_propagate(False)

        title = tk.Label(
            header,
            text="Vehicle Records",
            font=("Arial", 20, "bold"),
            fg="white",
            bg="#1f2937"
        )

        title.pack(
            side="left",
            padx=25,
            pady=20
        )

        # Search section
        search_frame = tk.Frame(
            self,
            bg="#f4f6f8"
        )

        search_frame.pack(
            fill="x",
            padx=25,
            pady=20
        )

        tk.Label(
            search_frame,
            text="Search Registration:",
            font=("Arial", 11, "bold"),
            bg="#f4f6f8",
            fg="#374151"
        ).pack(side="left")

        self.search_entry = tk.Entry(
            search_frame,
            font=("Arial", 11),
            width=25
        )

        self.search_entry.pack(
            side="left",
            padx=10,
            ipady=6
        )

        self.search_entry.bind(
            "<KeyRelease>",
            self.search_records
        )

        refresh_button = tk.Button(
            search_frame,
            text="🔄 Refresh",
            font=("Arial", 10, "bold"),
            bg="#374151",
            fg="white",
            relief="flat",
            padx=15,
            pady=8,
            command=self.load_records
        )

        refresh_button.pack(side="left")

        # Status filter
        tk.Label(
            search_frame,
            text="Status:",
            font=("Arial", 11, "bold"),
            bg="#f4f6f8",
            fg="#374151"
        ).pack(
            side="left",
            padx=(30, 5)
        )

        self.status_filter = ttk.Combobox(
            search_frame,
            values=[
                "All",
                "Parked",
                "Completed"
            ],
            state="readonly",
            width=12
        )

        self.status_filter.set("All")

        self.status_filter.pack(
            side="left"
        )

        self.status_filter.bind(
            "<<ComboboxSelected>>",
            self.search_records
        )

        # Table container
        table_frame = tk.Frame(
            self,
            bg="white",
            bd=1,
            relief="solid"
        )

        table_frame.pack(
            fill="both",
            expand=True,
            padx=25,
            pady=(0, 25)
        )

        # Scrollbars
        vertical_scroll = ttk.Scrollbar(
            table_frame,
            orient="vertical"
        )

        horizontal_scroll = ttk.Scrollbar(
            table_frame,
            orient="horizontal"
        )

        columns = (
            "registration",
            "type",
            "owner",
            "slot",
            "entry",
            "exit",
            "duration",
            "amount",
            "status"
        )

        self.table = ttk.Treeview(
            table_frame,
            columns=columns,
            show="headings",
            yscrollcommand=vertical_scroll.set,
            xscrollcommand=horizontal_scroll.set
        )

        vertical_scroll.config(
            command=self.table.yview
        )

        horizontal_scroll.config(
            command=self.table.xview
        )

        # Column headings
        self.table.heading(
            "registration",
            text="Registration"
        )

        self.table.heading(
            "type",
            text="Vehicle Type"
        )

        self.table.heading(
            "owner",
            text="Owner / Driver"
        )

        self.table.heading(
            "slot",
            text="Slot"
        )

        self.table.heading(
            "entry",
            text="Entry Time"
        )

        self.table.heading(
            "exit",
            text="Exit Time"
        )

        self.table.heading(
            "duration",
            text="Duration"
        )

        self.table.heading(
            "amount",
            text="Amount"
        )

        self.table.heading(
            "status",
            text="Status"
        )

        # Column widths
        self.table.column(
            "registration",
            width=110
        )

        self.table.column(
            "type",
            width=110
        )

        self.table.column(
            "owner",
            width=150
        )

        self.table.column(
            "slot",
            width=70
        )

        self.table.column(
            "entry",
            width=150
        )

        self.table.column(
            "exit",
            width=150
        )

        self.table.column(
            "duration",
            width=90
        )

        self.table.column(
            "amount",
            width=100
        )

        self.table.column(
            "status",
            width=100
        )

        self.table.pack(
            side="left",
            fill="both",
            expand=True
        )

        vertical_scroll.pack(
            side="right",
            fill="y"
        )

        horizontal_scroll.pack(
            side="bottom",
            fill="x"
        )

        # Double click information
        self.table.bind(
            "<Double-1>",
            self.show_record_details
        )

    # ==========================================
    # LOAD RECORDS
    # ==========================================

    def load_records(self):

        self.search_entry.delete(
            0,
            tk.END
        )

        self.status_filter.set("All")

        self.fetch_records()

    # ==========================================
    # SEARCH
    # ==========================================

    def search_records(self, event=None):

        self.fetch_records()

    # ==========================================
    # FETCH DATABASE RECORDS
    # ==========================================

    def fetch_records(self):

        search = (
            self.search_entry
            .get()
            .strip()
            .upper()
        )

        status = self.status_filter.get()

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            SELECT
                v.registration_no,
                v.vehicle_type,
                v.owner_name,
                ps.slot_number,
                pr.entry_time,
                pr.exit_time,
                pr.duration,
                pr.amount,
                pr.status
            FROM parking_records pr

            JOIN vehicles v
                ON pr.vehicle_id = v.id

            JOIN parking_slots ps
                ON pr.slot_id = ps.id

            WHERE 1=1
        """

        parameters = []

        # Registration search
        if search:

            query += """
                AND v.registration_no LIKE ?
            """

            parameters.append(
                f"%{search}%"
            )

        # Status filter
        if status != "All":

            query += """
                AND pr.status = ?
            """

            parameters.append(status)

        query += """
            ORDER BY pr.entry_time DESC
        """

        cursor.execute(
            query,
            parameters
        )

        records = cursor.fetchall()

        connection.close()

        # Clear existing table
        for item in self.table.get_children():

            self.table.delete(item)

        # Insert records
        for record in records:

            duration = record["duration"]

            if duration is None:

                duration_text = "-"

            else:

                hours = duration // 60
                minutes = duration % 60

                duration_text = (
                    f"{hours}h {minutes}m"
                )

            exit_time = (
                record["exit_time"]
                if record["exit_time"]
                else "-"
            )

            amount = (
                f"KSh {record['amount']:,.2f}"
                if record["amount"] is not None
                else "-"
            )

            self.table.insert(
                "",
                "end",
                values=(
                    record["registration_no"],
                    record["vehicle_type"],
                    record["owner_name"] or "-",
                    record["slot_number"],
                    record["entry_time"],
                    exit_time,
                    duration_text,
                    amount,
                    record["status"]
                )
            )

    # ==========================================
    # RECORD DETAILS
    # ==========================================

    def show_record_details(self, event):

        selected = self.table.selection()

        if not selected:
            return

        values = self.table.item(
            selected[0],
            "values"
        )

        details = (
            f"Registration: {values[0]}\n"
            f"Vehicle Type: {values[1]}\n"
            f"Owner / Driver: {values[2]}\n"
            f"Parking Slot: {values[3]}\n"
            f"Entry Time: {values[4]}\n"
            f"Exit Time: {values[5]}\n"
            f"Duration: {values[6]}\n"
            f"Amount: {values[7]}\n"
            f"Status: {values[8]}"
        )

        from tkinter import messagebox

        messagebox.showinfo(
            "Vehicle Details",
            details,
            parent=self
        )