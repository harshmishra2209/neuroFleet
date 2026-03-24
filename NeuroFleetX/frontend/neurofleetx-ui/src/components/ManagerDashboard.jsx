import { useState, useEffect } from "react";
import api from "../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function ManagerDashboard() {

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [kpis, setKpis] = useState({
    totalVehicles: 0,
    runningVehicles: 0,
    avgFuelLevel: 0,
    fleetUtilization: 0,
  });

  const [tripTrend, setTripTrend] = useState([]);

  // ================= SAFE DATA EXTRACTOR =================
  const extractData = (res) => {
    if (!res) return [];

    // ApiResponse + Pageable
    if (res.data?.data?.content) return res.data.data.content;

    // ApiResponse + List
    if (Array.isArray(res.data?.data)) return res.data.data;

    // Raw List
    if (Array.isArray(res.data)) return res.data;

    return [];
  };

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {

      const vehicleRes = await api.get("/api/vehicles?page=0&size=100");
      const bookingRes = await api.get("/api/bookings");

      const vehicleData = extractData(vehicleRes);
      const bookingData = extractData(bookingRes);

      console.log("VEHICLES FINAL:", vehicleData);
      console.log("BOOKINGS FINAL:", bookingData);

      setVehicles(vehicleData);
      setBookings(bookingData);

      computeKPIs(vehicleData, bookingData);
      computeTripTrend(bookingData);

    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);

  }, []);

  // ================= KPI =================
  const computeKPIs = (vehicleData, bookingData) => {

    const totalVehicles = vehicleData.length;

    const runningVehicles = vehicleData.filter(
      (v) => v.status === "IN_USE"
    ).length;

    const avgFuel =
      vehicleData.reduce((sum, v) => sum + (v.fuelLevel || 0), 0) /
      (totalVehicles || 1);

    const utilization =
      totalVehicles > 0
        ? ((runningVehicles / totalVehicles) * 100).toFixed(1)
        : 0;

    setKpis({
      totalVehicles,
      runningVehicles,
      avgFuelLevel: avgFuel.toFixed(1),
      fleetUtilization: utilization,
    });
  };

  // ================= TRIP TREND =================
  const computeTripTrend = (bookingData) => {

    const daysMap = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0,
      Fri: 0, Sat: 0, Sun: 0,
    };

    bookingData.forEach((b) => {
      if (!b.createdAt) return;

      const day = new Date(b.createdAt).toLocaleString("en-US", {
        weekday: "short",
      });

      if (daysMap[day] !== undefined) {
        daysMap[day]++;
      }
    });

    setTripTrend(
      Object.keys(daysMap).map((day) => ({
        day,
        trips: daysMap[day],
      }))
    );
  };

  // ================= GREETING =================
  const hour = new Date().getHours();
  let greeting = "Welcome";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  return (
    <div className="page-wrapper">

      {/* HEADER */}
      <div className="page-header">
        <h1>{greeting}, Manager</h1>
        <p>Operational fleet monitoring & control</p>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        <StatCard title="Total Vehicles" value={kpis.totalVehicles} />
        <StatCard title="Running Vehicles" value={kpis.runningVehicles} />
        <StatCard title="Avg Fuel Level" value={`${kpis.avgFuelLevel}%`} />
        <StatCard title="Fleet Utilization" value={`${kpis.fleetUtilization}%`} />
      </div>

      {/* TRIP TREND */}
      <div className="section">
        <h3>Trip Trend Overview</h3>

        <div className="card chart-card">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={tripTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
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
      </div>

      {/* FLEET TABLE */}
      <div className="section">
        <h3>Fleet Status</h3>

        <div className="card">
          <table className="fleet-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Fuel</th>
                <th>Speed</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.vehicleNumber}</td>
                  <td>
                    <span className={`status ${v.status === "IN_USE" ? "running" : "idle"}`}>
                      {v.status === "IN_USE" ? "RUNNING" : "IDLE"}
                    </span>
                  </td>
                  <td>{v.fuelLevel}%</td>
                  <td>{v.speed} km/h</td>
                </tr>
              ))}

              {vehicles.length === 0 && (
                <tr>
                  <td colSpan="4">No vehicles found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="section">
        <h3>Recent Activity</h3>

        <div className="card activity-card">
          {bookings.slice(0, 5).map((b) => (
            <div key={b.id} className="activity-item">
              {b.status} → {b.pickupLocation} → {b.dropLocation}
            </div>
          ))}

          {bookings.length === 0 && (
            <div>No recent activity</div>
          )}
        </div>
      </div>

    </div>
  );
}

// ================= COMPONENT =================
function StatCard({ title, value }) {
  return (
    <div className="card kpi-card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default ManagerDashboard;