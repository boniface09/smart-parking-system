import { useEffect, useMemo, useState } from "react";
import {
  Car,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
} from "lucide-react";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");

  const loadVehicles = async (showRefreshState = false) => {
    try {
      setError("");

      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/vehicles");

      if (response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load vehicle records."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    const query = search.toLowerCase().trim();

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !query ||
        vehicle.registration_no
          ?.toLowerCase()
          .includes(query) ||
        vehicle.owner_name
          ?.toLowerCase()
          .includes(query) ||
        vehicle.vehicle_type
          ?.toLowerCase()
          .includes(query);

      const status =
        vehicle.status?.toLowerCase() || "";

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "parked" && status === "parked") ||
        (statusFilter === "completed" && status === "completed");

      return matchesSearch && matchesStatus;
    });
  }, [vehicles, search, statusFilter]);

  const currentlyParked = vehicles.filter(
    (vehicle) =>
      vehicle.status?.toLowerCase() === "parked"
  ).length;

  const completedRecords = vehicles.filter(
    (vehicle) =>
      vehicle.status?.toLowerCase() === "completed"
  ).length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />

            <p className="text-gray-400">
              Loading vehicle records...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Vehicles / Records
            </h2>

            <p className="mt-2 text-gray-400">
              View registered vehicles and their parking history.
            </p>
          </div>

          <button
            onClick={() => loadVehicles(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh Records"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="grid gap-5 sm:grid-cols-3">
          <SummaryCard
            title="Total Records"
            value={vehicles.length}
            icon={<Car size={22} />}
          />

          <SummaryCard
            title="Currently Parked"
            value={currentlyParked}
            icon={<Clock3 size={22} />}
          />

          <SummaryCard
            title="Completed Sessions"
            value={completedRecords}
            icon={<CheckCircle2 size={22} />}
          />
        </div>

        {/* Search and Filters */}
        <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search registration, owner or vehicle type..."
                className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </FilterButton>

              <FilterButton
                active={statusFilter === "parked"}
                onClick={() => setStatusFilter("parked")}
              >
                Currently Parked
              </FilterButton>

              <FilterButton
                active={statusFilter === "completed"}
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </FilterButton>
            </div>
          </div>
        </section>

        {/* Records Table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 px-6 py-5">
            <h3 className="text-xl font-semibold">
              Parking Records
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredVehicles.length} of{" "}
              {vehicles.length} records
            </p>
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="py-16 text-center">
              <Car className="mx-auto mb-4 h-10 w-10 text-gray-700" />

              <p className="font-medium text-gray-400">
                No vehicle records found.
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-950/50">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Vehicle
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Owner
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Slot
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Entry Time
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Exit Time
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Duration
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleRow
                      key={`${vehicle.id}-${vehicle.parking_record_id || "none"}`}
                      vehicle={vehicle}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </MainLayout>
  );
}

function VehicleRow({ vehicle }) {
  const parked =
    vehicle.status?.toLowerCase() === "parked";

  return (
    <tr className="transition hover:bg-gray-800/40">
      {/* Vehicle */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              parked
                ? "bg-blue-500/10 text-blue-400"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            <Car size={19} />
          </div>

          <div>
            <p className="font-semibold text-white">
              {vehicle.registration_no}
            </p>

            <p className="text-xs text-gray-500">
              {vehicle.vehicle_type || "Unknown type"}
            </p>
          </div>
        </div>
      </td>

      {/* Owner */}
      <td className="px-6 py-4">
        <p className="text-sm text-gray-300">
          {vehicle.owner_name || "—"}
        </p>

        {vehicle.phone && (
          <p className="mt-1 text-xs text-gray-600">
            {vehicle.phone}
          </p>
        )}
      </td>

      {/* Slot */}
      <td className="px-6 py-4">
        {vehicle.slot_number ? (
          <span className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-300">
            {vehicle.slot_number}
          </span>
        ) : (
          <span className="text-sm text-gray-600">
            Released
          </span>
        )}
      </td>

      {/* Entry */}
      <td className="px-6 py-4 text-sm text-gray-400">
        {formatDate(vehicle.entry_time)}
      </td>

      {/* Exit */}
      <td className="px-6 py-4 text-sm text-gray-400">
        {vehicle.exit_time
          ? formatDate(vehicle.exit_time)
          : "—"}
      </td>

      {/* Duration */}
      <td className="px-6 py-4 text-sm text-gray-400">
        {vehicle.duration || "—"}
      </td>

      {/* Amount */}
      <td className="px-6 py-4">
        {vehicle.amount !== null &&
        vehicle.amount !== undefined ? (
          <span className="font-semibold text-white">
            KES {Number(vehicle.amount).toFixed(2)}
          </span>
        ) : (
          <span className="text-gray-600">
            —
          </span>
        )}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={vehicle.status} />
      </td>
    </tr>
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

function StatusBadge({ status }) {
  const normalized = status?.toLowerCase();

  const parked = normalized === "parked";

  return (
    <span
      className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-medium ${
        parked
          ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-KE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
