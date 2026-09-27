import { useState } from "react";
import {
  CarFront,
  CheckCircle,
  AlertCircle,
  Receipt,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000/api";

export default function VehicleExit() {
  const [registrationNo, setRegistrationNo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/vehicles/exit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration_no: registrationNo.trim().toUpperCase(),
          payment_method: paymentMethod,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message,
          data: result.data,
        });

        setRegistrationNo("");
        setPaymentMethod("Cash");
      } else {
        setMessage({
          type: "error",
          text: result.message || "Unable to process vehicle exit.",
        });
      }
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: "Could not connect to the parking system.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="exit" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Vehicle exit
          </p>

          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Complete your parking session
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Enter the vehicle registration number to calculate the parking
            fee, process payment, and release the parking space.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">

          {/* Result */}
          {message && (
            <div
              className={`mb-6 rounded-2xl border p-5 ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex gap-3">

                {message.type === "success" ? (
                  <CheckCircle
                    className="mt-0.5 shrink-0 text-emerald-600"
                    size={24}
                  />
                ) : (
                  <AlertCircle
                    className="mt-0.5 shrink-0 text-red-600"
                    size={24}
                  />
                )}

                <div className="w-full">
                  <p
                    className={`font-semibold ${
                      message.type === "success"
                        ? "text-emerald-800"
                        : "text-red-800"
                    }`}
                  >
                    {message.text}
                  </p>

                  {/* Receipt */}
                  {message.data && (
                    <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-5">

                      <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
                        <Receipt
                          size={20}
                          className="text-blue-600"
                        />

                        <h3 className="font-bold text-slate-900">
                          Parking Receipt
                        </h3>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">

                        <ReceiptItem
                          label="Registration"
                          value={message.data.registration_no}
                        />

                        <ReceiptItem
                          label="Parking Slot"
                          value={message.data.slot}
                        />

                        <ReceiptItem
                          label="Entry Time"
                          value={message.data.entry_time}
                        />

                        <ReceiptItem
                          label="Exit Time"
                          value={message.data.exit_time}
                        />

                        <ReceiptItem
                          label="Duration"
                          value={`${message.data.duration_minutes} minutes`}
                        />

                        <ReceiptItem
                          label="Payment Method"
                          value={message.data.payment_method}
                        />

                      </div>

                      <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-900 px-5 py-4 text-white">
                        <span className="font-medium">
                          Amount Paid
                        </span>

                        <span className="text-2xl font-bold">
                          KSh {Number(message.data.amount).toFixed(2)}
                        </span>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Registration */}
            <div>
              <label
                htmlFor="exit-registration"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Vehicle Registration Number
              </label>

              <input
                id="exit-registration"
                type="text"
                value={registrationNo}
                onChange={(event) =>
                  setRegistrationNo(event.target.value)
                }
                placeholder="e.g. KDA 123A"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 uppercase outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Payment method */}
            <div>
              <label
                htmlFor="payment-method"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Payment Method
              </label>

              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="Cash">Cash</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Card">Card</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CarFront size={20} />

              {loading
                ? "Processing Exit..."
                : "Process Vehicle Exit"}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}

function ReceiptItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}