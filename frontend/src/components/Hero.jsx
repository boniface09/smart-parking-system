import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { getDashboardStats } from "../api";

export default function Hero() {
  const [stats, setStats] = useState({
    available: 0,
    occupied: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await getDashboardStats();

        setStats({
          available: response.data?.available ?? 0,
          occupied: response.data?.occupied ?? 0,
        });
      } catch (error) {
        console.error("Failed to load hero parking statistics:", error);
      }
    }

    loadStats();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-slate-950 text-white"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.25),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.16),transparent_30%)]" />

      <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-32 lg:px-8">
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">

          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Smart parking made simple
            </div>

            <h2 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Parking that works
              <span className="block text-blue-400">
                smarter.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              A modern parking management system designed to make vehicle
              entry, parking, payments and exit faster, simpler and easier
              to manage.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#parking"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue-900/30 transition hover:bg-blue-500"
              >
                Find a Parking Slot
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                How it works
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                Real-time availability
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                Fast vehicle entry
              </div>
            </div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-lg">

              {/* Glow */}
              <div className="absolute inset-10 rounded-full bg-blue-500/20 blur-3xl" />

              {/* Main card */}
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
                <div className="rounded-[1.5rem] bg-slate-900 p-6">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Parking overview
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        Today's availability
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                      <CarFront size={22} />
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3">

                    {/* Available */}
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      <p className="text-sm text-slate-400">
                        Available
                      </p>

                      <p className="mt-2 text-4xl font-bold text-emerald-400">
                        {stats.available}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        parking spaces
                      </p>
                    </div>

                    {/* Occupied */}
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      <p className="text-sm text-slate-400">
                        Occupied
                      </p>

                      <p className="mt-2 text-4xl font-bold text-blue-400">
                        {String(stats.occupied).padStart(2, "0")}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        vehicles parked
                      </p>
                    </div>
                  </div>

                  {/* Mini parking map */}
                  <div className="mt-5 rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Parking map
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                        <MapPin size={13} />
                        Live
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 15 }).map((_, index) => (
                        <div
                          key={index}
                          className={`flex h-10 items-center justify-center rounded-lg text-xs font-semibold ${
                            index === 3 || index === 11
                              ? "bg-red-500/20 text-red-300"
                              : "bg-emerald-500/15 text-emerald-300"
                          }`}
                        >
                          {String.fromCharCode(
                            65 + Math.floor(index / 5)
                          )}
                          {(index % 5) + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                    <CheckCircle2
                      className="text-emerald-400"
                      size={20}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Space available
                    </p>

                    <p className="text-xs text-slate-400">
                      Ready for your vehicle
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

