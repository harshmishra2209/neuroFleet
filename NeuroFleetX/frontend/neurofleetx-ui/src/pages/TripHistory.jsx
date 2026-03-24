import { useEffect, useState } from "react";
import api from "../services/api";

function TripHistory() {

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalEarnings, setTotalEarnings] = useState(0);

  // ================= FETCH HISTORY =================
  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/bookings");
      const data = res?.data || [];

      // ✅ only completed trips
      const completedTrips = data
        .filter((b) => b.status === "COMPLETED")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setTrips(completedTrips);

      // ✅ calculate total earnings
      const earnings = completedTrips.reduce((sum, t) => sum + (t.fare || 0), 0);
      setTotalEarnings(earnings);

    } catch (err) {
      console.error("Failed to fetch history", err);
      setTrips([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ================= FORMAT DATE =================
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    const d = new Date(dateStr);

    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  // ================= UI =================
  return (
    <div className="page-wrapper">

      <div className="page-header">
        <h1>Trip History</h1>
        <p>Your completed rides</p>
      </div>

      {/* SUMMARY */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <p><b>Total Trips:</b> {trips.length}</p>
        <p><b>Total Earnings:</b> ₹{totalEarnings}</p>
      </div>

      <div className="card">

        {loading && <p>Loading history...</p>}

        {!loading && trips.length === 0 && (
          <p>No completed trips yet</p>
        )}

        {!loading && trips.map((trip) => (

          <div
            key={trip.id}
            className="trip-card"
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              borderRadius: "10px",
              marginBottom: "12px"
            }}
          >

            {/* ROUTE */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{trip.pickupLocation}</strong>
              <span>→</span>
              <strong>{trip.dropLocation}</strong>
            </div>

            {/* DETAILS */}
            <p><b>Fare:</b> ₹{trip.fare}</p>
            <p><b>Date:</b> {formatDate(trip.createdAt)}</p>

            {trip.vehicle && (
              <>
                <p><b>Vehicle:</b> {trip.vehicle.model}</p>
                <p><b>Number:</b> {trip.vehicle.vehicleNumber}</p>
              </>
            )}

            <p style={{ color: "green", fontWeight: "bold" }}>
              Completed
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default TripHistory;