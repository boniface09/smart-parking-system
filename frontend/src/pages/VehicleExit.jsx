import { useState } from "react";
import {
  Car,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  LogOut,
} from "lucide-react";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

const initialForm = {
  registration_no: "",
  payment_method: "",
};

export default function VehicleExit() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await api.post("/vehicles/exit", {
        registration_no: form.registration_no.trim().toUpperCase(),
        payment_method: form.payment_method,
      });

      if (response.data.success) {
        setSuccess(response.data);
        setForm(initialForm);
      } else {
        setError(
          response.data.message ||
            "Vehicle exit could not be completed."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to process vehicle exit."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const result = success?.data || success;

  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Vehicle Exit
          </h2>

          <p className="mt-2 text-gray-400">
            Process a vehicle departure and record its payment.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-800 bg-red-950/40 px-5 py-4 text-red-300">
            <span className="mt-0.5">⚠</span>

            <div>
              <p className="font-medium">
                Exit failed
              </p>

              <p className="mt-1 text-sm text-red-400">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={25} />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-emerald-300">
                  Vehicle Exit Successful
                </h3>

                <p className="mt-1 text-sm text-emerald-400/80">
                  The parking session has been completed and
                  payment recorded.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <ResultItem
                    label="Registration"
                    value={
                      result?.registration_no ||
                      form.registration_no ||
                      "Completed"
                    }
                    icon={<Car size={17} />}
                  />

                  <ResultItem
                    label="Parking Slot"
                    value={
                      result?.slot_number ||
                      result?.slot ||
                      "Released"
                    }
                    icon={<LogOut size={17} />}
                  />

                  <ResultItem
                    label="Duration"
                    value={
                      result?.duration ||
                      result?.parking_duration ||
                      "Completed"
                    }
                    icon={<Clock3 size={17} />}
                  />

                  <ResultItem
                    label="Amount Paid"
                    value={
                      formatAmount(
                        result?.amount ??
                          result?.fee ??
                          result?.total_amount
                      )
                    }
                    icon={<CreditCard size={17} />}
                  />
                </div>

                <div className="mt-4 rounded-xl border border-emerald-500/20 bg-black/10 px-4 py-3">
                  <p className="text-xs text-emerald-500/70">
                    Payment Method
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {result?.payment_method ||
                      "Payment recorded"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Exit Form */}
          <section className="lg:col-span-2 rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <LogOut size={25} />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Departure Information
                </h3>

                <p className="text-sm text-gray-500">
                  Enter the registration number and payment method.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Registration */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Registration Number
                </label>

                <input
                  type="text"
                  name="registration_no"
                  value={form.registration_no}
                  onChange={handleChange}
                  placeholder="e.g. KDA 123A"
                  required
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white uppercase outline-none transition placeholder:normal-case placeholder:text-gray-600 focus:border-orange-500"
                />

                <p className="mt-2 text-xs text-gray-600">
                  Enter the registration number of the vehicle leaving
                  the parking area.
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Payment Method
                </label>

                <select
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-orange-500"
                >
                  <option value="">
                    Select payment method
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/10 transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Processing Exit...
                  </>
                ) : (
                  <>
                    <LogOut size={19} />
                    Process Vehicle Exit
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Instructions */}
          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
              <CreditCard size={22} />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Exit Process
            </h3>

            <div className="mt-6 space-y-5">
              <Step
                number="01"
                title="Identify Vehicle"
                text="Enter the registration number of the parked vehicle."
              />

              <Step
                number="02"
                title="Calculate Fee"
                text="The existing parking algorithm calculates the session duration and fee."
              />

              <Step
                number="03"
                title="Record Payment"
                text="Select the payment method used by the customer."
              />

              <Step
                number="04"
                title="Release Slot"
                text="The occupied parking slot is released automatically."
              />
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}

function ResultItem({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-black/10 p-4">
      <div className="flex items-center gap-2 text-emerald-500/70">
        {icon}

        <p className="text-xs">
          {label}
        </p>
      </div>

      <p className="mt-2 font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-xs font-bold text-gray-400">
        {number}
      </div>

      <div>
        <p className="font-medium text-white">
          {title}
        </p>

        <p className="mt-1 text-sm leading-5 text-gray-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function formatAmount(amount) {
  if (amount === undefined || amount === null || amount === "") {
    return "Recorded";
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return String(amount);
  }

  return `KES ${numericAmount.toFixed(2)}`;
}
