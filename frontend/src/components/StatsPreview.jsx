import { useEffect, useState } from "react";
import { CarFront, CircleParking, SquareParking } from "lucide-react";
import { getDashboardStats } from "../api";

export default function StatsPreview() {
    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        occupied: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await getDashboardStats();

                setStats({
                    total: data.data?.total ?? 0,
                    available: data.data?.available ?? 0,
                    occupied: data.data?.occupied ?? 0,
                });
            } catch (error) {
                console.error("Failed to load parking statistics:", error);
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    const cards = [
        {
            title: "Total Spaces",
            value: stats.total,
            icon: CircleParking,
            description: "Parking capacity",
        },
        {
            title: "Available",
            value: stats.available,
            icon: SquareParking,
            description: "Spaces ready",
        },
        {
            title: "Currently Parked",
            value: stats.occupied,
            icon: CarFront,
            description: "Vehicles inside",
        },
    ];

    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                <div className="mb-10 text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
                        Live parking status
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                        Know what is available before you arrive
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                        SmartPark keeps track of parking spaces in real time so drivers
                        and administrators always have the latest information.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                        <Icon size={24} />
                                    </div>

                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                </div>

                                <p className="mt-6 text-sm font-medium text-slate-500">
                                    {card.title}
                                </p>

                                <p className="mt-1 text-4xl font-bold text-slate-900">
                                    {loading ? "—" : card.value}
                                </p>

                                <p className="mt-2 text-sm text-slate-500">
                                    {card.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}