import { useEffect, useState } from "react";
import {
  BarChart3,
  Car,
  CheckCircle2,
  Clock3,
  DollarSign,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadReports = async (showRefreshState = false) => {
    try {
      setError("");

      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/reports");

      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />

            <p className="text-gray-400">
              Loading reports...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const totalVehicles = reports?.total_vehicles ?? 0;
  const currentlyParked = reports?.currently_parked ?? 0;
  const completedSessions = reports?.completed_sessions ?? 0;
  const totalRevenue = Number(reports?.total_revenue ?? 0);

  const completedPercentage =
    totalVehicles > 0
      ? Math.round(
          (completedSessions / totalVehicles) * 100
        )
      : 0;

  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Reports & Analytics
            </h2>

            <p className="mt-2 text-gray-400">
              Overview of parking activity and revenue.
            </p>
          </div>

          <button
            onClick={() => loadReports(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh Reports"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {/* Main Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ReportCard
            title="Total Vehicles"
            value={totalVehicles}
            description="Vehicles registered"
            icon={<Car size={23} />}
          />

          <ReportCard
            title="Currently Parked"
            value={currentlyParked}
            description="Active parking sessions"
            icon={<Clock3 size={23} />}
          />

          <ReportCard
            title="Completed Sessions"
            value={completedSessions}
            description="Completed parking sessions"
            icon={<CheckCircle2 size={23} />}
          />

          <ReportCard
            title="Total Revenue"
            value={`KES ${totalRevenue.toFixed(2)}`}
            description="Recorded payments"
            icon={<DollarSign size={23} />}
          />
        </div>

        {/* Activity Overview */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Session Summary */}
          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                <BarChart3 size={23} />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Session Overview
                </h3>

                <p className="text-sm text-gray-500">
                  Current parking activity
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <ProgressRow
                label="Completed Sessions"
                value={completedSessions}
                percentage={completedPercentage}
              />

              <ProgressRow
                label="Currently Parked"
                value={currentlyParked}
                percentage={
                  totalVehicles > 0
                    ? Math.round(
                        (currentlyParked / totalVehicles) *
                          100
                      )
                    : 0
                }
              />
            </div>
          </section>

          {/* Revenue Summary */}
          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp size={23} />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Revenue Summary
                </h3>

                <p className="text-sm text-gray-500">
                  Recorded parking payments
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <p className="text-sm text-gray-500">
                Total Revenue
              </p>

              <p className="mt-2 text-4xl font-bold text-emerald-400">
                KES {totalRevenue.toFixed(2)}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                <DollarSign size={16} />

                <span>
                  Based on recorded completed payments
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Operational Summary */}
        <section className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">
              Operational Summary
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Current state of the parking management system
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryItem
              label="Vehicles Registered"
              value={totalVehicles}
            />

            <SummaryItem
              label="Active Sessions"
              value={currentlyParked}
            />

            <SummaryItem
              label="Completed Sessions"
              value={completedSessions}
            />

            <SummaryItem
              label="Revenue Collected"
              value={`KES ${totalRevenue.toFixed(2)}`}
            />
          </div>
        </section>
      </main>
    </MainLayout>
  );
}

function ReportCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
          {icon}
        </div>

        <span className="text-xs uppercase tracking-wider text-gray-600">
          Live
        </span>
      </div>

      <p className="mt-5 text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-1 break-words text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-600">
        {description}
      </p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  percentage,
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          {label}
        </span>

        <span className="text-sm font-semibold text-white">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>

      <p className="mt-2 text-xs text-gray-600">
        {percentage}% of recorded vehicles
      </p>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
      <p className="text-xs uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}
