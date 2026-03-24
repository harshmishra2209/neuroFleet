import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Fleet from "./pages/Fleet";
import FleetMap from "./pages/FleetMap";

import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Logs from "./pages/Logs";

import MyTrips from "./pages/MyTrips";
import AssignedTrips from "./pages/AssignedTrips";
import TripHistory from "./pages/TripHistory";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layout/AppLayout";

import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";



function App() {
  return (
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD - ALL ROLES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CUSTOMER", "DRIVER"]}>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* FLEET */}
        <Route
          path="/fleet"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <AppLayout>
                <Fleet />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN + MANAGER */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <AppLayout>
                <Analytics />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <AppLayout>
                <Reports />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN ONLY */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AppLayout>
                <Users />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* FLEET MAP */}

        <Route
          path="/fleet-map"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <AppLayout>
                <FleetMap />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/logs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AppLayout>
                <Logs />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-trips"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <AppLayout>
                <MyTrips />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* DRIVER */}
        <Route
          path="/assigned-trips"
          element={
            <ProtectedRoute allowedRoles={["DRIVER"]}>
              <AppLayout>
                <AssignedTrips />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/trip-history"
          element={
            <ProtectedRoute allowedRoles={["DRIVER"]}>
              <AppLayout>
                <TripHistory />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* DRIVER + CUSTOMER */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "DRIVER"]}>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-trip"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <AppLayout>
                <Booking />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <AppLayout>
                <MyBookings />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}

export default App;