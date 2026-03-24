import { useEffect, useState } from "react";
import api from "../services/api";

function MyBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {

    try {

      const res = await api.get("/api/bookings");

      const data = res?.data || [];

      const upcoming = data.filter(
        (b) =>
          b.status === "CONFIRMED" ||
          b.status === "PENDING" ||
          b.status === "ONGOING"
      );

      upcoming.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setBookings(upcoming);

    } catch (err) {
      console.error("Failed to load bookings");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="page-wrapper">

      <div className="page-header">
        <h1>Upcoming Trips</h1>
        <p>Your active and upcoming rides</p>
      </div>

      <div className="card table-card">

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No upcoming trips</p>
        ) : (
          <table className="booking-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Pickup</th>
                <th>Drop</th>
                <th>Vehicle</th>
                <th>Fare</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {bookings.map((b) => (

                <tr key={b.id}>

                  <td>{b.id}</td>
                  <td>{b.pickupLocation}</td>
                  <td>{b.dropLocation}</td>
                  <td>{b.vehicleType}</td>
                  <td>₹{b.fare}</td>
                  <td>
                    <span className="badge-warning">{b.status}</span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default MyBookings;