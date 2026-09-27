import { CarFront } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 px-6 py-12 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <CarFront size={20} />
          </div>

          <div>
            <p className="font-bold">SmartPark</p>
            <p className="text-xs text-slate-400">
              Smart Parking Management System
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          © 2026 Smart Parking Management System
        </p>
      </div>
    </footer>
  );
}