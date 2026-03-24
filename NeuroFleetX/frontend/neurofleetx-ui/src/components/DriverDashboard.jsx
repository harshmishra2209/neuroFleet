import { useEffect, useState } from "react";
import api from "../services/api";

function DriverDashboard() {

  const [stats, setStats] = useState({
    todayTrips: 0,
    earnings: 0,
    rating: 4.8,
    fuelLevel: 0,
  });

  const [trips, setTrips] = useState([]);

  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/bookings");

      const data = res.data || [];

      // 🔥 latest booking first
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // ================= DRIVER TRIPS =================
      const driverTrips = sorted.slice(0, 2).map((b) => ({
        id: b.id,
        pickup: b.pickupLocation,
        drop: b.dropLocation,
        distance: `${b.distance} km`,
        status: b.status === "COMPLETED" ? "Completed" : "Ongoing",
        vehicle: b.vehicle?.vehicleNumber || "N/A",
      }));

      setTrips(driverTrips);

      // ================= STATS =================
      const today = new Date().toDateString();

      const todayBookings = data.filter(
        (b) => new Date(b.createdAt).toDateString() === today
      );

      const earnings = todayBookings.reduce(
        (sum, b) => sum + b.fare,
        0
      );

      const fuel =
        data.length > 0
          ? data[0].vehicle?.fuelLevel || 0
          : 0;

      setStats({
        todayTrips: todayBookings.length,
        earnings,
        rating: 4.8,
        fuelLevel: fuel,
      });

    } catch (err) {
      console.error("Driver Dashboard Error:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="page-wrapper">

      {/* HEADER */}
      <div className="page-header">
        <h1>Driver Control Center</h1>
        <p>Manage your trips and performance</p>
      </div>

      {/* STATS */}
      <div className="kpi-grid">
        <StatCard title="Trips Today" value={stats.todayTrips} />
        <StatCard title="Earnings Today" value={`₹${stats.earnings}`} />
        <StatCard title="Rating" value={stats.rating} />
        <StatCard title="Fuel Level" value={`${stats.fuelLevel}%`} />
      </div>

      {/* ASSIGNED TRIPS */}
      <div className="section">
        <h3>Assigned Trips</h3>

        <div className="trip-grid">
          {trips.length === 0 ? (
            <p>No trips assigned yet</p>
          ) : (
            trips.map((trip) => (
              <div key={trip.id} className="card trip-card">

                <div className="trip-route">
                  <strong>{trip.pickup}</strong>
                  <span> → </span>
                  <strong>{trip.drop}</strong>
                </div>

                <div className="trip-meta">
                  <span>{trip.distance}</span>
                  <span>{trip.vehicle}</span>

                  <span
                    className={`status ${
                      trip.status === "Ongoing"
                        ? "running pulse"
                        : "idle"
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>

                <div className="trip-actions">
                  {trip.status === "Ongoing" && (
                    <button className="danger-btn small">
                      End Trip
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* PERFORMANCE */}
      <div className="section">
        <h3>Performance Overview</h3>

        <div className="card performance-card">
          <div className="performance-item">
            Weekly Trips: {stats.todayTrips * 5}
          </div>
          <div className="performance-item">
            Average Rating: {stats.rating} ⭐
          </div>
          <div className="performance-item">
            On-Time Arrival: 94%
          </div>
        </div>
      </div>

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="card kpi-card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default DriverDashboard;