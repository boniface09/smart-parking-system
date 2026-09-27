import tkinter as tk
from tkinter import messagebox, ttk

from algorithms import vehicle_exit
from database import get_connection


class VehicleExitWindow(tk.Toplevel):

    def __init__(self, parent, on_success=None):
        super().__init__(parent)

        self.parent = parent
        self.on_success = on_success

        self.title("Vehicle Exit")
        self.geometry("520x520")
        self.resizable(False, False)

        self.configure(bg="#f4f6f8")

        self.create_interface()

        self.bind(
            "<Return>",
            lambda event: self.process_exit()
        )

    # ==========================================
    # INTERFACE
    # ==========================================

    def create_interface(self):

        header = tk.Frame(
            self,
            bg="#dc2626",
            height=70
        )

        header.pack(fill="x")
        header.pack_propagate(False)

        title = tk.Label(
            header,
            text="Vehicle Exit & Payment",
            font=("Arial", 20, "bold"),
            fg="white",
            bg="#dc2626"
        )

        title.pack(pady=20)

        form = tk.Frame(
            self,
            bg="white",
            bd=1,
            relief="solid"
        )

        form.pack(
            fill="both",
            expand=True,
            padx=30,
            pady=25
        )

        # Registration number
        tk.Label(
            form,
            text="Vehicle Registration Number",
            font=("Arial", 11, "bold"),
            bg="white",
            fg="#374151"
        ).pack(
            anchor="w",
            padx=25,
            pady=(25, 5)
        )

        self.registration_entry = tk.Entry(
            form,
            font=("Arial", 13),
            relief="solid",
            bd=1
        )

        self.registration_entry.pack(
            fill="x",
            padx=25,
            ipady=8
        )

        self.registration_entry.focus()

        # Payment method
        tk.Label(
            form,
            text="Payment Method",
            font=("Arial", 11, "bold"),
            bg="white",
            fg="#374151"
        ).pack(
            anchor="w",
            padx=25,
            pady=(20, 5)
        )

        self.payment_method = ttk.Combobox(
            form,
            values=[
                "Cash",
                "M-Pesa",
                "Card"
            ],
            state="readonly",
            font=("Arial", 11)
        )

        self.payment_method.set("Cash")

        self.payment_method.pack(
            fill="x",
            padx=25,
            ipady=5
        )

        # Information
        info = tk.Label(
            form,
            text=(
                "The system will calculate the parking duration\n"
                "and amount payable automatically."
            ),
            font=("Arial", 10),
            fg="#6b7280",
            bg="white",
            justify="left"
        )

        info.pack(
            anchor="w",
            padx=25,
            pady=15
        )

        # Buttons
        button_frame = tk.Frame(
            form,
            bg="white"
        )

        button_frame.pack(
            pady=20
        )

        cancel_button = tk.Button(
            button_frame,
            text="Cancel",
            font=("Arial", 11, "bold"),
            bg="#e5e7eb",
            fg="#374151",
            padx=25,
            pady=10,
            relief="flat",
            command=self.destroy
        )

        cancel_button.pack(
            side="left",
            padx=5
        )

        exit_button = tk.Button(
            button_frame,
            text="Process Exit",
            font=("Arial", 11, "bold"),
            bg="#dc2626",
            fg="white",
            activebackground="#b91c1c",
            activeforeground="white",
            padx=25,
            pady=10,
            relief="flat",
            cursor="hand2",
            command=self.process_exit
        )

        exit_button.pack(
            side="left",
            padx=5
        )

    # ==========================================
    # PROCESS EXIT
    # ==========================================

    def process_exit(self):

        registration_no = (
            self.registration_entry
            .get()
            .strip()
            .upper()
        )

        payment_method = self.payment_method.get()

        if not registration_no:

            messagebox.showwarning(
                "Missing Information",
                "Please enter the vehicle registration number.",
                parent=self
            )

            return

        if not payment_method:

            messagebox.showwarning(
                "Missing Information",
                "Please select a payment method.",
                parent=self
            )

            return

        # Process exit
        result = vehicle_exit(
            registration_no,
            payment_method
        )

        if not result["success"]:

            messagebox.showerror(
                "Vehicle Exit Failed",
                result["message"],
                parent=self
            )

            return

        # Calculate readable duration
        duration = result["duration_minutes"]

        hours = duration // 60
        minutes = duration % 60

        if hours > 0:

            duration_text = (
                f"{hours} hour(s) "
                f"{minutes} minute(s)"
            )

        else:

            duration_text = (
                f"{minutes} minute(s)"
            )

        # --------------------------------------
        # PAYMENT SUMMARY
        # --------------------------------------

        payment_message = (
            "PARKING PAYMENT RECEIPT\n"
            "\n"
            f"Registration: {result['registration_no']}\n"
            f"Parking Slot: {result['slot']}\n"
            f"Entry Time: {result['entry_time']}\n"
            f"Exit Time: {result['exit_time']}\n"
            f"Duration: {duration_text}\n"
            "\n"
            f"Payment Method: {result['payment_method']}\n"
            "\n"
            f"AMOUNT PAID: "
            f"KSh {result['amount']:,.2f}"
        )

        messagebox.showinfo(
            "Payment Successful",
            payment_message,
            parent=self
        )

        # Refresh dashboard
        if self.on_success:
            self.on_success()

        self.destroy()