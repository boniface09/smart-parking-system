import { motion } from "framer-motion";
import {
  CarFront,
  CreditCard,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Real-Time Dashboard",
    description:
      "See parking availability and occupancy at a glance through a clear management dashboard.",
  },
  {
    icon: CarFront,
    title: "Vehicle Management",
    description:
      "Register vehicles, assign parking spaces and keep accurate parking records.",
  },
  {
    icon: CreditCard,
    title: "Simple Payments",
    description:
      "Calculate parking fees automatically and record the selected payment method.",
  },
  {
    icon: BarChart3,
    title: "Reports & Insights",
    description:
      "Track parking activity, completed sessions and revenue through useful reports.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-slate-50 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Built for simplicity
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Everything needed to manage parking
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Smart Parking brings the essential parts of parking management
            together in one easy-to-use system.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={23} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}