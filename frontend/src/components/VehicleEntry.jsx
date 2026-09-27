import { useState } from "react";
import { CarFront, CheckCircle, AlertCircle } from "lucide-react";

const API_URL = "http://127.0.0.1:5000/api";

export default function VehicleEntry() {
  const [form, setForm] = useState({
    registration_no: "",
    vehicle_type: "Car",
    owner_name: "",
    phone: "",
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/vehicles/entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message,
          slot: result.data?.slot,
          entry_time: result.data?.entry_time,
        });

        setForm({
          registration_no: "",
          vehicle_type: "Car",
          owner_name: "",
          phone: "",
        });
      } else {
        setMessage({
          type: "error",
          text: result.message || "Unable to park vehicle.",
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
    <section id="entry" className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">

        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Vehicle entry
          </p>

          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Park your vehicle
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Enter the vehicle details below and SmartPark will automatically
            assign the first available parking space.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-xl md:p-8">

          {/* Result message */}
          {message && (
            <div
              className={`mb-6 flex gap-3 rounded-xl border p-4 ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="mt-0.5 shrink-0" size={22} />
              ) : (
                <AlertCircle className="mt-0.5 shrink-0" size={22} />
              )}

              <div>
                <p className="font-semibold">
                  {message.text}
                </p>

                {message.slot && (
                  <p className="mt-1 text-sm">
                    Assigned parking space:{" "}
                    <strong>{message.slot}</strong>
                  </p>
                )}

                {message.entry_time && (
                  <p className="text-sm">
                    Entry time: {message.entry_time}
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Registration */}
            <div>
              <label
                htmlFor="registration_no"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Vehicle Registration Number
              </label>

              <input
                id="registration_no"
                name="registration_no"
                type="text"
                value={form.registration_no}
                onChange={handleChange}
                placeholder="e.g. KDA 123A"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 uppercase outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Vehicle type */}
            <div>
              <label
                htmlFor="vehicle_type"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Vehicle Type
              </label>

              <select
                id="vehicle_type"
                name="vehicle_type"
                value={form.vehicle_type}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="Car">Car</option>
                <option value="SUV">SUV</option>
                <option value="Van">Van</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            {/* Owner */}
            <div>
              <label
                htmlFor="owner_name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Owner Name
              </label>

              <input
                id="owner_name"
                name="owner_name"
                type="text"
                value={form.owner_name}
                onChange={handleChange}
                placeholder="Enter owner's name"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 0712 345 678"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CarFront size={20} />

              {loading ? "Processing..." : "Park Vehicle"}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}