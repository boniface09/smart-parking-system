import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ParkingSlots from "./pages/ParkingSlots";
import VehicleEntry from "./pages/VehicleEntry";
import VehicleExit from "./pages/VehicleExit";
import Vehicles from "./pages/Vehicles";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";


function ProtectedRoute({ children }) {

  const token = localStorage.getItem(
    "access_token"
  );

  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return children;
}


function PlaceholderPage({ title }) {

  return (

    <div className="min-h-screen bg-gray-950 px-6 py-8 text-white">

      <div className="mx-auto max-w-7xl">

        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <p className="mt-2 text-gray-400">
          This section will be connected to the
          parking system next.
        </p>

      </div>

    </div>

  );
}


function App() {

  return (

    <Routes>

      {/* ======================================
          PUBLIC PAGES
      ====================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />


      {/* ======================================
          PROTECTED DASHBOARD
      ====================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* ======================================
          PARKING SLOTS
      ====================================== */}

      <Route
        path="/parking-slots"
        element={
          <ProtectedRoute>
            <ParkingSlots />
          </ProtectedRoute>
        }
      />


      {/* ======================================
          VEHICLE ENTRY
      ====================================== */}

      <Route
        path="/vehicle-entry"
        element={
          <ProtectedRoute>
            <VehicleEntry />
          </ProtectedRoute>
        }
      />


      {/* ======================================
          VEHICLE EXIT
      ====================================== */}

      <Route
        path="/vehicle-exit"
        element={
          <ProtectedRoute>
            <VehicleExit />
          </ProtectedRoute>
        }
      />


      {/* ======================================
          VEHICLES
      ====================================== */}

      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            <Vehicles />
          </ProtectedRoute>
        }
      />


      {/* ======================================
          REPORTS
      ====================================== */}

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />


      {/* ======================================
          SETTINGS
      ====================================== */}

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />


      {/* ======================================
          UNKNOWN ROUTES
      ====================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>

  );
}


export default App;

