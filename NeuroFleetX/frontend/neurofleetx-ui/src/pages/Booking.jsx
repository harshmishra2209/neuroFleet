import api from "../services/api";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

import { useState, useEffect } from "react";
import LocationSearch from "../components/LocationSearch";

function Booking() {

  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);

  const [routes, setRoutes] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [rideStarted, setRideStarted] = useState(false);

  // ================= FETCH AVAILABLE VEHICLES =================
  const fetchVehicles = async () => {
    try {
      // 🔥 FIX: call AVAILABLE API
      const res = await api.get("/api/vehicles/available");

      const data =
        res?.data?.data ||
        res?.data ||
        [];

      setVehicles(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Failed to fetch vehicles", err);
      setVehicles([]);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ================= ROUTE =================
  useEffect(() => {

    if (!pickup || !drop) return;

    const fetchRoute = async () => {
      try {
        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${pickup.lon},${pickup.lat};${drop.lon},${drop.lat}` +
          `?overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.routes || data.routes.length === 0) return;

        const coords = data.routes[0].geometry.coordinates.map(
          ([lon, lat]) => [lat, lon]
        );

        setRoutes([coords]);

        setDistance((data.routes[0].distance / 1000).toFixed(2));
        setDuration((data.routes[0].duration / 60).toFixed(1));

      } catch (err) {
        console.error("Route fetch failed", err);
      }
    };

    fetchRoute();

  }, [pickup, drop]);

  // ================= FARE =================
  const calculateFare = (v) => {
    if (!distance) return 0;

    let base = 20;

    if (v.model?.toLowerCase().includes("cab")) base = 50;
    if (v.model?.toLowerCase().includes("auto")) base = 30;

    return Math.round(base + distance * 10);
  };

  // ================= BOOK =================
  const handleBooking = async () => {

    if (!pickup || !drop || !selectedVehicle) {
      alert("Select pickup, drop and vehicle");
      return;
    }

    try {
      setBookingLoading(true);

      const payload = {
        pickupLocation: pickup.name,
        dropLocation: drop.name,
        distance: parseFloat(distance),
        fare: calculateFare(selectedVehicle),
        vehicle: {
          id: selectedVehicle.id
        }
      };

      await api.post("/api/bookings", payload);

      // 🔥 IMPORTANT: refresh available vehicles
      await fetchVehicles();

      setRideStarted(true);

    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      alert("Booking failed");
    }

    setBookingLoading(false);
  };

  // ================= ACTIVE RIDE =================
  if (rideStarted && selectedVehicle) {
    return (
      <div className="page-wrapper">

        <div className="page-header">
          <h1>Ride Confirmed 🚗</h1>
        </div>

        <div className="card">
          <h3>{selectedVehicle.model}</h3>
          <p>{selectedVehicle.vehicleNumber}</p>
          <p>Fuel: {selectedVehicle.fuelLevel}%</p>
          <p>Fare: ₹{calculateFare(selectedVehicle)}</p>

          <button
            className="primary-btn"
            onClick={() => setRideStarted(false)}
          >
            Done
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="page-wrapper">

      <div className="page-header">
        <h1>Book a Trip</h1>
      </div>

      <div className="booking-layout">

        {/* LEFT PANEL */}
        <div className="booking-panel">

          <LocationSearch placeholder="Pickup" onSelect={setPickup} />
          <LocationSearch placeholder="Drop" onSelect={setDrop} />

          {distance && (
            <div className="card">
              <p>{distance} km • {duration} mins</p>
            </div>
          )}

          {/* VEHICLES */}
          {distance && (
            <div className="vehicle-options">

              <h3>Available Vehicles</h3>

              {vehicles.length === 0 && (
                <p>No vehicles available</p>
              )}

              {vehicles.map((v) => (

                <div
                  key={v.id}
                  className={`vehicle-card ${
                    selectedVehicle?.id === v.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedVehicle(v)}
                >

                  <strong>{v.model}</strong>
                  <p>{v.vehicleNumber}</p>
                  <p>Fuel: {v.fuelLevel}%</p>
                  <p>₹{calculateFare(v)}</p>

                </div>

              ))}

            </div>
          )}

          {selectedVehicle && (
            <button
              className="primary-btn"
              onClick={handleBooking}
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking..." : "Confirm Ride"}
            </button>
          )}

        </div>

        {/* MAP */}
        <div className="booking-map">

          <MapContainer
            center={[18.52, 73.85]}
            zoom={13}
            style={{ height: "500px" }}
          >

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {vehicles.map(v => (
              v.latitude && v.longitude && (
                <Marker key={v.id} position={[v.latitude, v.longitude]}>
                  <Popup>{v.vehicleNumber}</Popup>
                </Marker>
              )
            ))}

            {pickup && <Marker position={[pickup.lat, pickup.lon]} />}
            {drop && <Marker position={[drop.lat, drop.lon]} />}

            {routes.map((r, i) => (
              <Polyline key={i} positions={r} />
            ))}

          </MapContainer>

        </div>

      </div>

    </div>
  );
}

export default Booking;