import tkinter as tk
from tkinter import messagebox, ttk

from algorithms import vehicle_entry


class VehicleEntryWindow(tk.Toplevel):

    def __init__(self, parent, on_success=None):
        super().__init__(parent)

        self.parent = parent
        self.on_success = on_success

        self.title("Vehicle Entry")
        self.geometry("500x600")
        self.resizable(False, False)

        self.configure(bg="#f4f6f8")

        self.create_interface()
        self.bind("<Return>", lambda event: self.submit_entry())
    # ==========================================
    # INTERFACE
    # ==========================================

    def create_interface(self):

        # Header
        header = tk.Frame(
            self,
            bg="#2563eb",
            height=70
        )

        header.pack(
            fill="x"
        )

        header.pack_propagate(False)

        title = tk.Label(
            header,
            text="Vehicle Entry",
            font=("Arial", 20, "bold"),
            fg="white",
            bg="#2563eb"
        )

        title.pack(
            pady=20
        )

        # Form container
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
            text="Registration Number",
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
            font=("Arial", 12),
            relief="solid",
            bd=1
        )

        self.registration_entry.pack(
            fill="x",
            padx=25,
            ipady=7
        )

        # Vehicle type
        tk.Label(
            form,
            text="Vehicle Type",
            font=("Arial", 11, "bold"),
            bg="white",
            fg="#374151"
        ).pack(
            anchor="w",
            padx=25,
            pady=(18, 5)
        )

        self.vehicle_type = ttk.Combobox(
            form,
            values=[
                "Saloon",
                "SUV",
                "Pickup",
                "Van",
                "Truck",
                "Motorcycle"
            ],
            font=("Arial", 11),
            state="readonly"
        )

        self.vehicle_type.pack(
            fill="x",
            padx=25,
            ipady=5
        )

        self.vehicle_type.set("Saloon")

        # Owner name
        tk.Label(
            form,
            text="Owner / Driver Name",
            font=("Arial", 11, "bold"),
            bg="white",
            fg="#374151"
        ).pack(
            anchor="w",
            padx=25,
            pady=(18, 5)
        )

        self.owner_entry = tk.Entry(
            form,
            font=("Arial", 12),
            relief="solid",
            bd=1
        )

        self.owner_entry.pack(
            fill="x",
            padx=25,
            ipady=7
        )

        # Phone
        tk.Label(
            form,
            text="Phone Number",
            font=("Arial", 11, "bold"),
            bg="white",
            fg="#374151"
        ).pack(
            anchor="w",
            padx=25,
            pady=(18, 5)
        )

        self.phone_entry = tk.Entry(
            form,
            font=("Arial", 12),
            relief="solid",
            bd=1
        )

        self.phone_entry.pack(
            fill="x",
            padx=25,
            ipady=7
        )

        # Buttons
        button_frame = tk.Frame(
            form,
            bg="white"
        )

        button_frame.pack(
            pady=25
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

        park_button = tk.Button(
            button_frame,
            text="Park Vehicle",
            font=("Arial", 11, "bold"),
            bg="#2563eb",
            fg="white",
            activebackground="#1d4ed8",
            activeforeground="white",
            padx=25,
            pady=10,
            relief="flat",
            command=self.submit_entry
        )

        park_button.pack(
            side="left",
            padx=5
        )

    # ==========================================
    # SUBMIT ENTRY
    # ==========================================

    def submit_entry(self):

        registration_no = (
            self.registration_entry
            .get()
            .strip()
            .upper()
        )

        vehicle_type = self.vehicle_type.get()

        owner_name = (
            self.owner_entry
            .get()
            .strip()
        )

        phone = (
            self.phone_entry
            .get()
            .strip()
        )

        # -----------------------------
        # VALIDATION
        # -----------------------------

        if not registration_no:

            messagebox.showwarning(
                "Missing Information",
                "Please enter the vehicle registration number.",
                parent=self
            )

            return

        if not vehicle_type:

            messagebox.showwarning(
                "Missing Information",
                "Please select the vehicle type.",
                parent=self
            )

            return

        if not owner_name:

            messagebox.showwarning(
                "Missing Information",
                "Please enter the owner/driver name.",
                parent=self
            )

            return

        # -----------------------------
        # SEND TO ALGORITHM
        # -----------------------------

        result = vehicle_entry(
            registration_no=registration_no,
            vehicle_type=vehicle_type,
            owner_name=owner_name,
            phone=phone
        )

        # -----------------------------
        # RESULT
        # -----------------------------

        if result["success"]:

            messagebox.showinfo(
                "Vehicle Parked",
                (
                    f"Vehicle successfully parked!\n\n"
                    f"Registration: {registration_no}\n"
                    f"Assigned Slot: {result['slot']}\n"
                    f"Entry Time: {result['entry_time']}"
                ),
                parent=self
            )

            # Refresh dashboard
            if self.on_success:
                self.on_success()

            self.destroy()

        else:

            messagebox.showerror(
                "Vehicle Entry Failed",
                result["message"],
                parent=self
            )