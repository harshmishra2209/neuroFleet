import { useEffect, useState } from "react";
import api from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Analytics() {

  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    idle: 0,
    avgSpeed: 0,
    lowFuel: 0,
  });

  // ===== FETCH VEHICLE DATA =====

  const fetchVehicles = async () => {
    try {

      const res = await api.get("/api/vehicles?page=0&size=100");

      const data =
        res?.data?.data?.content ||
        res?.data?.data ||
        [];

      setVehicles(data);

      // ✅ FIXED LOGIC
      const running = data.filter(v => v.status === "IN_USE").length;
      const idle = data.filter(v => v.status !== "IN_USE").length;
      const lowFuel = data.filter(v => v.fuelLevel < 20).length;

      const avgSpeed =
        data.length > 0
          ? (
              data.reduce((sum, v) => sum + v.speed, 0) / data.length
            ).toFixed(1)
          : 0;

      setStats({
        total: data.length,
        running,
        idle,
        avgSpeed,
        lowFuel,
      });

    } catch (err) {
      console.error("Analytics fetch error:", err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ===== STATUS PIE CHART =====

  const statusData = [
    { name: "Running", value: stats.running },
    { name: "Idle", value: stats.idle },
  ];

  const COLORS = ["#22c55e", "#94a3b8"];

  // ===== FUEL BAR CHART =====

  const fuelData = vehicles.map(v => ({
    vehicle: v.vehicleNumber,
    fuel: v.fuelLevel,
  }));

  return (
    <div className="page-wrapper">

      {/* HEADER */}
      <div className="page-header">
        <h1>Fleet Analytics</h1>
        <p>System insights and performance metrics</p>
      </div>

      {/* KPI SECTION */}
      <div className="kpi-grid">

        <div className="card kpi-card">
          <h4>Total Vehicles</h4>
          <h2>{stats.total}</h2>
        </div>

        <div className="card kpi-card">
          <h4>Running Vehicles</h4>
          <h2>{stats.running}</h2>
        </div>

        <div className="card kpi-card">
          <h4>Average Speed</h4>
          <h2>{stats.avgSpeed} km/h</h2>
        </div>

        <div className="card kpi-card">
          <h4>Low Fuel Alerts</h4>
          <h2>{stats.lowFuel}</h2>
        </div>

      </div>

      {/* CHARTS */}

      <div className="section">

        <h3>Fleet Activity Distribution</h3>

        <div className="chart-grid">

          {/* PIE CHART */}

          <div className="card chart-card">
            <h4>Vehicle Activity</h4>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>

                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label
                  outerRadius={90}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>

          </div>

          {/* FUEL CHART */}

          <div className="card chart-card">
            <h4>Fuel Levels</h4>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={fuelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vehicle" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="fuel" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* LOW FUEL VEHICLES */}

      <div className="section">

        <h3>Vehicles With Low Fuel</h3>

        <div className="card table-card">

          <table className="vehicle-table">

            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Model</th>
                <th>Fuel</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {vehicles
                .filter(v => v.fuelLevel < 20)
                .map(v => {

                  const isRunning = v.status === "IN_USE";

                  return (
                    <tr key={v.id}>
                      <td>{v.vehicleNumber}</td>
                      <td>{v.model}</td>
                      <td>{v.fuelLevel}%</td>
                      <td>{isRunning ? "RUNNING" : "IDLE"}</td>
                    </tr>
                  );
                })}

              {vehicles.filter(v => v.fuelLevel < 20).length === 0 && (
                <tr>
                  <td colSpan="4">No low fuel vehicles</td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Analytics;