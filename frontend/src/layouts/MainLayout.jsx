import { useState } from "react";
import {
  BarChart3,
  Car,
  CircleParking,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Parking Slots",
      path: "/parking-slots",
      icon: CircleParking,
    },
    {
      name: "Vehicle Entry",
      path: "/vehicle-entry",
      icon: Car,
    },
    {
      name: "Vehicle Exit",
      path: "/vehicle-exit",
      icon: LogOut,
    },
    {
      name: "Vehicles / Records",
      path: "/vehicles",
      icon: ClipboardList,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-800 bg-gray-900 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <CircleParking size={24} />
            </div>

            <div>
              <h1 className="font-bold text-white">
                Smart Parking
              </h1>

              <p className="text-xs text-gray-500">
                Management System
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
            Main Menu
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="my-6 border-t border-gray-800" />

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
            System
          </p>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/settings");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>
        </nav>

        {/* User / Logout */}
        <div className="border-t border-gray-800 p-4">
          <div className="mb-3 rounded-xl bg-gray-800/60 p-3">
            <p className="text-xs text-gray-500">
              Signed in as
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {JSON.parse(localStorage.getItem("user") || "{}")
                .username || "Admin"}
            </p>

            <p className="text-xs text-blue-400">
              Administrator
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-800 bg-gray-950/90 px-4 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <Menu size={22} />
          </button>

          <div className="ml-3">
            <p className="font-semibold">
              Smart Parking
            </p>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
