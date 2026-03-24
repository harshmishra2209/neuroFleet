import { useEffect, useState } from "react";
import api from "../services/api";

function AssignedTrips() {

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BOOKINGS =================
  const fetchTrips = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/bookings");

      const data = res?.data || [];

      // ✅ filter today's + active trips
      const today = new Date().toISOString().split("T")[0];

      const filtered = data.filter((b) => {
        if (!b.createdAt) return false;

        const bookingDate = b.createdAt.split("T")[0];

        return (
          bookingDate === today &&
          b.status !== "COMPLETED"
        );
      });

      setTrips(filtered);

    } catch (err) {
      console.error("Failed to fetch trips", err);
      setTrips([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // ================= COMPLETE TRIP =================
  const completeTrip = async (id) => {
    try {
      await api.put(`/api/bookings/${id}/complete`);
      fetchTrips(); // refresh
    } catch (err) {
      console.error("Failed to complete trip", err);
      alert("Error completing trip");
    }
  };

  // ================= UI =================
  return (
    <div className="page-wrapper">

      <div className="page-header">
        <h1>Assigned Trips</h1>
        <p>Manage your active trips</p>
      </div>

      <div className="card">

        {loading && <p>Loading trips...</p>}

        {!loading && trips.length === 0 && (
          <p>No trips assigned for today</p>
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

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{trip.pickupLocation}</strong>
              <span>→</span>
              <strong>{trip.dropLocation}</strong>
            </div>

            <p><b>Fare:</b> ₹{trip.fare}</p>
            <p><b>Status:</b> {trip.status}</p>

            {trip.vehicle && (
              <>
                <p><b>Vehicle:</b> {trip.vehicle.model}</p>
                <p><b>Number:</b> {trip.vehicle.vehicleNumber}</p>
              </>
            )}

            <button
              className="primary-btn"
              onClick={() => completeTrip(trip.id)}
              style={{ marginTop: "10px" }}
            >
              Mark as Completed
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AssignedTrips;