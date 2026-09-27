import { useEffect, useState } from "react";
import { Car, CircleParking, RefreshCw } from "lucide-react";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [slots, setSlots] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async (showRefreshState = false) => {
    try {
      setError("");

      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [dashboardResponse, slotsResponse] = await Promise.all([
        api.get("/dashboard"),
        api.get("/slots"),
      ]);

      if (dashboardResponse.data.success) {
        setStats(dashboardResponse.data.data);
      }

      if (slotsResponse.data.success) {
        setSlots(slotsResponse.data.data);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load parking information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const getSlotClasses = (status) => {
    if (status?.toLowerCase() === "occupied") {
      return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />

            <p className="text-gray-400">
              Loading parking dashboard...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Parking Dashboard
            </h2>

            <p className="mt-2 text-gray-400">
              Monitor parking availability and occupancy in real time.
            </p>
          </div>

          <button
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Slots"
            value={stats?.total ?? 0}
            icon={<CircleParking size={22} />}
          />

          <StatCard
            title="Available"
            value={stats?.available ?? 0}
            icon={<CircleParking size={22} />}
          />

          <StatCard
            title="Occupied"
            value={stats?.occupied ?? 0}
            icon={<Car size={22} />}
          />

          <StatCard
            title="Occupancy"
            value={
              stats?.total
                ? `${Math.round(
                    (stats.occupied / stats.total) * 100
                  )}%`
                : "0%"
            }
            icon={<Car size={22} />}
          />
        </div>

        {/* Parking Slots */}
        <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-semibold">
                Parking Slots
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Live status of all parking spaces
              </p>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-gray-400">
                  Available
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-gray-400">
                  Occupied
                </span>
              </div>
            </div>
          </div>

          {slots.length === 0 ? (
            <div className="rounded-xl border border-gray-800 py-12 text-center text-gray-500">
              No parking slots found.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`rounded-xl border p-4 text-center transition hover:scale-[1.02] ${getSlotClasses(
                    slot.status
                  )}`}
                >
                  <div className="text-lg font-bold">
                    {slot.slot_number}
                  </div>

                  <div className="mt-1 text-xs capitalize opacity-80">
                    {slot.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </MainLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
          {icon}
        </div>

        <span className="text-xs uppercase tracking-wider text-gray-600">
          Live
        </span>
      </div>

      <p className="mt-5 text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}
