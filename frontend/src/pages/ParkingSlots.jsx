
import { useEffect, useMemo, useState } from "react";
import {
  Car,
  CircleParking,
  RefreshCw,
  Search,
} from "lucide-react";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loadSlots = async (showRefreshState = false) => {
    try {
      setError("");

      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/slots");

      if (response.data.success) {
        setSlots(response.data.data);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load parking slots."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const matchesSearch = String(slot.slot_number)
        .toLowerCase()
        .includes(search.toLowerCase());

      const normalizedStatus = slot.status?.toLowerCase();

      const matchesFilter =
        filter === "all" ||
        (filter === "available" && normalizedStatus === "available") ||
        (filter === "occupied" && normalizedStatus === "occupied");

      return matchesSearch && matchesFilter;
    });
  }, [slots, search, filter]);

  const totalSlots = slots.length;

  const availableSlots = slots.filter(
    (slot) => slot.status?.toLowerCase() === "available"
  ).length;

  const occupiedSlots = slots.filter(
    (slot) => slot.status?.toLowerCase() === "occupied"
  ).length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />

            <p className="text-gray-400">
              Loading parking slots...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Parking Slots
            </h2>

            <p className="mt-2 text-gray-400">
              Monitor the current status of every parking space.
            </p>
          </div>

          <button
            onClick={() => loadSlots(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh Slots"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          <SummaryCard
            title="Total Slots"
            value={totalSlots}
            icon={<CircleParking size={22} />}
          />

          <SummaryCard
            title="Available"
            value={availableSlots}
            icon={<CircleParking size={22} />}
          />

          <SummaryCard
            title="Occupied"
            value={occupiedSlots}
            icon={<Car size={22} />}
          />
        </div>

        {/* Controls */}
        <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search slot number..."
                className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All
              </FilterButton>

              <FilterButton
                active={filter === "available"}
                onClick={() => setFilter("available")}
              >
                Available
              </FilterButton>

              <FilterButton
                active={filter === "occupied"}
                onClick={() => setFilter("occupied")}
              >
                Occupied
              </FilterButton>
            </div>
          </div>
        </section>

        {/* Parking Grid */}
        <section className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                Parking Layout
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {filteredSlots.length} of {totalSlots} slots displayed
              </p>
            </div>

            <div className="hidden items-center gap-5 text-sm sm:flex">
              <Legend
                color="bg-emerald-500"
                label="Available"
              />

              <Legend
                color="bg-red-500"
                label="Occupied"
              />
            </div>
          </div>

          {filteredSlots.length === 0 ? (
            <div className="rounded-xl border border-gray-800 py-16 text-center">
              <CircleParking className="mx-auto mb-4 h-10 w-10 text-gray-700" />

              <p className="font-medium text-gray-400">
                No parking slots found.
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
              {filteredSlots.map((slot) => {
                const occupied =
                  slot.status?.toLowerCase() === "occupied";

                return (
                  <div
                    key={slot.id}
                    className={`group relative rounded-2xl border p-4 text-center transition duration-200 hover:-translate-y-1 ${
                      occupied
                        ? "border-red-500/30 bg-red-500/10 hover:border-red-500/50"
                        : "border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50"
                    }`}
                  >
                    {/* Slot Icon */}
                    <div
                      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${
                        occupied
                          ? "bg-red-500/10 text-red-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {occupied ? (
                        <Car size={23} />
                      ) : (
                        <CircleParking size={23} />
                      )}
                    </div>

                    {/* Slot Number */}
                    <p className="mt-3 text-lg font-bold text-white">
                      {slot.slot_number}
                    </p>

                    {/* Status */}
                    <p
                      className={`mt-1 text-xs font-medium ${
                        occupied
                          ? "text-red-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {occupied ? "Occupied" : "Available"}
                    </p>

                    {/* Vehicle ID */}
                    {occupied && slot.vehicle_id && (
                      <p className="mt-2 truncate text-[10px] text-gray-500">
                        Vehicle #{slot.vehicle_id}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </MainLayout>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
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

      <p className="mt-1 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-gray-400">{label}</span>
    </div>
  );
}

