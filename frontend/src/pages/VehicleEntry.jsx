import { useEffect, useState } from "react";
import {
  Car,
  CheckCircle2,
  CircleParking,
  Loader2,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

const initialForm = {
  registration_no: "",
  vehicle_type: "",
  owner_name: "",
  phone: "",
};

export default function VehicleEntry() {
  const [form, setForm] = useState(initialForm);
  const [slots, setSlots] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  const loadSlots = async () => {
    try {
      setLoadingSlots(true);

      const response = await api.get("/slots");

      if (response.data.success) {
        setSlots(response.data.data);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load parking availability."
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const availableSlots =
    slots?.filter(
      (slot) => slot.status?.toLowerCase() === "available"
    ).length ?? 0;

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
      const response = await api.post("/vehicles/entry", {
        registration_no: form.registration_no.trim().toUpperCase(),
        vehicle_type: form.vehicle_type,
        owner_name: form.owner_name.trim(),
        phone: form.phone.trim(),
      });

      if (response.data.success) {
        setSuccess(response.data);
        setForm(initialForm);

        await loadSlots();
      } else {
        setError(
          response.data.message ||
            "Vehicle entry could not be completed."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to process vehicle entry."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Vehicle Entry
          </h2>

          <p className="mt-2 text-gray-400">
            Register a vehicle and assign an available parking slot.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-800 bg-red-950/40 px-5 py-4 text-red-300">
            <span className="mt-0.5">⚠</span>

            <div>
              <p className="font-medium">
                Entry failed
              </p>

              <p className="mt-1 text-sm text-red-400">
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={24} />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-emerald-300">
                  Vehicle Entry Successful
                </h3>

                <p className="mt-1 text-sm text-emerald-400/80">
                  The vehicle has been registered and assigned a
                  parking slot.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <ResultItem
                    label="Registration"
                    value={
                      success.registration_no ||
                      form.registration_no
                    }
                  />

                  <ResultItem
                    label="Assigned Slot"
                    value={
                      success.slot_number ||
                      success.slot ||
                      "Assigned"
                    }
                  />

                  <ResultItem
                    label="Status"
                    value="Parked"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Entry Form */}
          <section className="lg:col-span-2 rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                <Car size={25} />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Vehicle Information
                </h3>

                <p className="text-sm text-gray-500">
                  Enter the vehicle details below.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white uppercase outline-none transition placeholder:normal-case placeholder:text-gray-600 focus:border-blue-500"
                />

                <p className="mt-2 text-xs text-gray-600">
                  Enter the vehicle's official registration number.
                </p>
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Vehicle Type
                </label>

                <select
                  name="vehicle_type"
                  value={form.vehicle_type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                >
                  <option value="">
                    Select vehicle type
                  </option>
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Owner */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Owner Name
                  <span className="ml-1 text-gray-600">
                    (Optional)
                  </span>
                </label>

                <input
                  type="text"
                  name="owner_name"
                  value={form.owner_name}
                  onChange={handleChange}
                  placeholder="Enter owner's name"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Phone Number
                  <span className="ml-1 text-gray-600">
                    (Optional)
                  </span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0712345678"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || availableSlots === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Processing Entry...
                  </>
                ) : (
                  <>
                    <Car size={19} />
                    Register Vehicle Entry
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Availability */}
          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Parking Availability
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Current capacity
                </p>
              </div>

              <button
                type="button"
                onClick={loadSlots}
                disabled={loadingSlots}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-800 hover:text-white"
                title="Refresh availability"
              >
                <RefreshCw
                  size={18}
                  className={
                    loadingSlots ? "animate-spin" : ""
                  }
                />
              </button>
            </div>

            <div className="mt-8 text-center">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-8 border-emerald-500/20">
                <div>
                  <p className="text-3xl font-bold text-emerald-400">
                    {availableSlots}
                  </p>

                  <p className="text-xs text-gray-500">
                    available
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm text-gray-400">
                out of {slots?.length ?? 50} total parking slots
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <AvailabilityRow
                label="Available"
                value={availableSlots}
                className="text-emerald-400"
              />

              <AvailabilityRow
                label="Occupied"
                value={
                  slots
                    ? slots.length - availableSlots
                    : 0
                }
                className="text-red-400"
              />

              <div className="border-t border-gray-800 pt-3">
                <AvailabilityRow
                  label="Capacity"
                  value={slots?.length ?? 50}
                  className="text-white"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}

function ResultItem({ label, value }) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-black/10 p-3">
      <p className="text-xs text-emerald-500/70">
        {label}
      </p>

      <p className="mt-1 font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function AvailabilityRow({ label, value, className }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className={`font-semibold ${className}`}>
        {value}
      </span>
    </div>
  );
}
