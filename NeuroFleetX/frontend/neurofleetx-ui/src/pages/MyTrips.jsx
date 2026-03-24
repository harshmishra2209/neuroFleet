import { useEffect, useState } from "react";
import api from "../services/api";

function MyTrips() {

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const res = await api.get("/api/bookings");

      const data = res?.data || [];

      const completedTrips = data.filter(
        (b) => b.status === "COMPLETED"
      );

      // latest first
      completedTrips.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTrips(completedTrips);

    } catch (err) {
      console.error("Failed to fetch trips");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="page-wrapper">

      <div className="page-header">
        <h1>Recent Trips</h1>
        <p>Your completed rides</p>
      </div>

      <div className="card history-card">

        {loading ? (
          <p>Loading...</p>
        ) : trips.length === 0 ? (
          <p>No completed trips</p>
        ) : (
          trips.map((trip) => (
            <div key={trip.id} className="history-item">

              <div className="history-left">
                <strong>
                  {trip.pickupLocation} → {trip.dropLocation}
                </strong>

                <div className="history-sub">
                  {new Date(trip.createdAt).toLocaleDateString()} • Fare: ₹{trip.fare}
                </div>
              </div>

              <div className="status-badge badge-success">
                COMPLETED
              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default MyTrips;