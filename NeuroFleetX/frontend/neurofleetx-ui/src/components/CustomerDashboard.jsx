
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CustomerDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    totalSpent: 0,
    walletBalance: 620,
  });

  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/bookings");

      const bookings =
        res?.data?.content ||
        res?.data ||
        [];

      if (!Array.isArray(bookings)) {
        setUpcomingTrips([]);
        setRecentTrips([]);
        return;
      }

      const upcoming = [];
      const recent = [];
      let totalSpent = 0;

      bookings.forEach((b) => {

        totalSpent += b.fare || 0;

        // ✅ STATUS BASED LOGIC (FIXED)
        if (
          b.status === "CONFIRMED" ||
          b.status === "PENDING" ||
          b.status === "ONGOING"
        ) {
          upcoming.push(b);
        } 
        else if (b.status === "COMPLETED") {
          recent.push(b);
        }

      });

      // SORTING
      upcoming.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      recent.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setUpcomingTrips(upcoming.slice(0, 3));
      setRecentTrips(recent.slice(0, 5));

      setStats({
        totalTrips: bookings.length,
        upcomingTrips: upcoming.length,
        totalSpent,
        walletBalance: 620,
      });

    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }

    setLoading(false);
  };

  // ================= POLLING =================
  useEffect(() => {

    fetchBookings();

    const interval = setInterval(() => {
      fetchBookings();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="page-wrapper">

      {/* HEADER */}
      <div className="page-header">
        <h1>My Dashboard</h1>
        <p>Manage bookings, payments and trip history</p>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <KpiCard title="Total Trips" value={stats.totalTrips} />
        <KpiCard title="Upcoming Trips" value={stats.upcomingTrips} />
        <KpiCard title="Total Spent" value={`₹${stats.totalSpent}`} />
        <KpiCard title="Wallet Balance" value={`₹${stats.walletBalance}`} />
      </div>

      {/* UPCOMING TRIPS */}
      <div className="section">
        <div className="section-header">
          <h3>Upcoming Trips</h3>
        </div>

        <div className="trip-grid">

          {loading && <p>Loading...</p>}

          {!loading && upcomingTrips.length === 0 && (
            <p>No upcoming trips</p>
          )}

          {upcomingTrips.map((trip) => (
            <div key={trip.id} className="card trip-card">

              <div className="trip-route">
                <strong>{trip.pickupLocation}</strong>
                <span className="arrow">→</span>
                <strong>{trip.dropLocation}</strong>
              </div>

              <div className="trip-meta">
                <span>
                  {new Date(trip.createdAt).toLocaleString()}
                </span>

                <span
                  className={`status-badge ${
                    trip.status === "CONFIRMED"
                      ? "badge-success"
                      : trip.status === "ONGOING"
                      ? "badge-primary"
                      : "badge-warning"
                  }`}
                >
                  {trip.status}
                </span>
              </div>

              <div className="trip-actions">
                <button
                    className="secondary-btn small"
                    onClick={async () => {
                      try {
                        await api.put(`/api/bookings/${trip.id}/complete`);
                        alert("Ride marked as completed");

                        // refresh instantly
                        fetchBookings();

                      } catch (err) {
                        console.error("Failed to update status", err);
                      }
                    }}
                  >
                    Mark Completed
                  </button>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* RECENT TRIPS */}
      <div className="section">
        <div className="section-header">
          <h3>Recent Trips</h3>
        </div>

        <div className="card history-card">

          {!loading && recentTrips.length === 0 && (
            <p>No past trips</p>
          )}

          {recentTrips.map((trip) => (
            <div key={trip.id} className="history-item">

              <div className="history-left">
                <strong>
                  {trip.pickupLocation} → {trip.dropLocation}
                </strong>

                <div className="history-sub">
                  {new Date(trip.createdAt).toLocaleDateString()} • Fare: ₹{trip.fare}
                </div>
              </div>

              <div className="rating">
                ⭐
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* QUICK ACTION */}
      <div className="section">
        <div className="card book-card">

          <div>
            <h3>Need a Ride?</h3>
            <p className="book-subtext">
              Book a new trip instantly with AI-optimized routing.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => navigate("/book-trip")}
          >
            Book Trip
          </button>

        </div>
      </div>

    </div>
  );
}

function KpiCard({ title, value }) {
  return (
    <div className="card kpi-card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default CustomerDashboard;