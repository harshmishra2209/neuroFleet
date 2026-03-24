import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function AdminDashboard() {

  const navigate = useNavigate();

  const hour = new Date().getHours();
  let greeting = "Welcome";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  // ================= STATE =================

  const [vehicles, setVehicles] = useState([]);

  const [kpis, setKpis] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    idleVehicles: 0,
    systemHealth: 100,
  });

  // ================= FETCH DATA =================

  const fetchDashboardData = async () => {
    try {

      // ✅ VEHICLE LIST (for UI, charts, alerts)
      const vehicleRes = await api.get("/api/vehicles?page=0&size=100");

      const vehicleData =
        vehicleRes?.data?.data?.content ||
        vehicleRes?.data?.content ||
        [];

      setVehicles(vehicleData);

      // ✅ STATS FROM BACKEND (CORRECT LOGIC)
      const statsRes = await api.get("/api/vehicles/stats");

      const stats =
        statsRes?.data?.data ||
        statsRes?.data ||
        {};

      setKpis({
        totalVehicles: stats.total || 0,
        activeVehicles: stats.running || 0,
        idleVehicles: stats.idle || 0,
        systemHealth: 99.8,
      });

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // 🔥 polling (real-time feel)
    const interval = setInterval(fetchDashboardData, 5000);

    return () => clearInterval(interval);

  }, []);

  // ================= CHART DATA =================

  const fuelData = vehicles.map((v) => ({
    vehicle: v.vehicleNumber,
    efficiency: v.fuelLevel,
  }));

  const tripTrendData = [
    { month: "Jan", trips: vehicles.length * 3 },
    { month: "Feb", trips: vehicles.length * 4 },
    { month: "Mar", trips: vehicles.length * 5 },
    { month: "Apr", trips: vehicles.length * 6 },
    { month: "May", trips: vehicles.length * 4 },
  ];

  // ================= ALERTS =================

  const alerts = vehicles
    .filter((v) => v.fuelLevel < 20)
    .map((v) => ({
      id: v.id,
      message: `Vehicle ${v.vehicleNumber} has low fuel (${v.fuelLevel}%)`,
      severity: "High",
    }));

  return (
    <div className="page-wrapper">

      {/* HEADER */}
      <div className="page-header">
        <h1>{greeting}, Admin</h1>
        <p>Complete system control & monitoring</p>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        <StatCard title="Total Vehicles" value={kpis.totalVehicles} />
        <StatCard title="Running Vehicles" value={kpis.activeVehicles} />
        <StatCard title="Idle Vehicles" value={kpis.idleVehicles} />
        <StatCard title="System Health" value={`${kpis.systemHealth}%`} />
      </div>

      {/* ACTIONS */}
      <div className="section">
        <h3>Admin Actions</h3>

        <div className="action-grid">

          <ActionCard
            title="Manage Users"
            desc="Update & manage accounts"
            onClick={() => navigate("/users")}
          />

          <ActionCard
            title="Analytics"
            desc="System insights"
            onClick={() => navigate("/analytics")}
          />

          <ActionCard
            title="Reports"
            desc="Generate reports"
            onClick={() => navigate("/reports")}
          />

          <ActionCard
            title="Settings"
            desc="Platform configuration"
            onClick={() => navigate("/settings")}
          />

          <ActionCard
            title="Logs"
            desc="System monitoring"
            onClick={() => navigate("/logs")}
          />

          <ActionCard
            title="Fleet Management"
            desc="Manage vehicles"
            onClick={() => navigate("/fleet")}
          />

        </div>
      </div>

      {/* CHARTS */}
      <div className="section">
        <h3>Performance Overview</h3>

        <div className="chart-grid">

          <div className="card chart-card">
            <h4>Trip Trends</h4>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={tripTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="trips"
                  stroke="#4f46e5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

          <div className="card chart-card">
            <h4>Fuel Levels</h4>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={fuelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vehicle" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="efficiency" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>
      </div>

      {/* VEHICLES */}
<div className="section">
  <h3>Fleet Overview</h3>

  <div className="vehicle-grid">

    {vehicles.slice(0, 6).map((v) => (

      <div key={v.id} className="card vehicle-card">

        <h4>{v.vehicleNumber}</h4>
        <p>{v.model}</p>

        <div className="vehicle-meta">

          <span>Fuel {v.fuelLevel}%</span>

          {/* ✅ FIXED: use backend status instead of speed */}
          <span
            className={`status ${
              v.status === "IN_USE" ? "running" : "idle"
            }`}
          >
            {v.status === "IN_USE" ? "RUNNING" : "IDLE"}
          </span>

        </div>

      </div>

    ))}

  </div>
</div>

      {/* ALERTS */}
      <div className="section">

        <h3>System Alerts</h3>

        <div className="card alert-card">

          {alerts.length === 0 ? (
            <p>No alerts</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-item ${alert.severity.toLowerCase()}`}
              >
                <span>{alert.message}</span>
                <span className="severity">{alert.severity}</span>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

// ================= COMPONENTS =================

function StatCard({ title, value }) {
  return (
    <div className="card kpi-card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

function ActionCard({ title, desc, onClick }) {
  return (
    <div className="card action-card clickable" onClick={onClick}>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}

export default AdminDashboard;