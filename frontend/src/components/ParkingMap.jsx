import { useEffect, useState } from "react";
import { CarFront, CircleParking } from "lucide-react";

const API_URL = "http://127.0.0.1:5000/api";

export default function ParkingMap() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSlots() {
    try {
      const response = await fetch(`${API_URL}/slots`);

      if (!response.ok) {
        throw new Error("Failed to load parking slots");
      }

      const result = await response.json();

      setSlots(result.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load parking slots.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSlots();

    // Refresh the parking map every 10 seconds
    const interval = setInterval(loadSlots, 10000);

    return () => clearInterval(interval);
  }, []);

  const available = slots.filter(
    (slot) => slot.status === "Available"
  ).length;

  const occupied = slots.filter(
    (slot) => slot.status === "Occupied"
  ).length;

  return (
    <section id="parking" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Live parking map
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Find an available parking space
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            View the current status of every parking space before entering.
          </p>
        </div>

        {/* Status summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">

          <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
              <CircleParking size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Available spaces
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {loading ? "—" : available}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-red-100 p-3 text-red-600">
              <CarFront size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Occupied spaces
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {loading ? "—" : occupied}
              </p>
            </div>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
            {error}
          </div>
        )}

        {/* Parking map */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Parking Area
              </h3>

              <p className="text-sm text-slate-500">
                50 total parking spaces
              </p>
            </div>

            {/* Legend */}
            <div className="flex gap-5 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                Available
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                Occupied
              </div>
            </div>
          </div>

          {/* Entrance */}
          <div className="mb-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-3 text-center text-sm font-semibold text-slate-500">
            PARKING ENTRANCE
          </div>

          {/* Slots */}
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Loading parking spaces...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 md:grid-cols-10">
              {slots.map((slot) => {
                const isAvailable = slot.status === "Available";

                return (
                  <div
                    key={slot.id}
                    className={`group relative flex min-h-24 flex-col items-center justify-center rounded-xl border-2 p-3 transition duration-200 hover:-translate-y-1 ${
                      isAvailable
                        ? "border-emerald-200 bg-emerald-50 hover:border-emerald-400 hover:shadow-lg"
                        : "border-red-200 bg-red-50 hover:border-red-400 hover:shadow-lg"
                    }`}
                  >
                    <div
                      className={`mb-2 rounded-lg p-2 ${
                        isAvailable
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      <CarFront size={20} />
                    </div>

                    <span className="text-sm font-bold text-slate-800">
                      {slot.slot_number}
                    </span>

                    <span
                      className={`mt-1 text-xs font-medium ${
                        isAvailable
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {isAvailable ? "Available" : "Occupied"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}