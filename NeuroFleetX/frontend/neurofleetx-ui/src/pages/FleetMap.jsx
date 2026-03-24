import { useEffect, useState } from "react";
import api from "../services/api";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import L from "leaflet";

function FleetMap() {

  const [vehicles, setVehicles] = useState([]);

  // ================= FETCH VEHICLES =================
const fetchVehicles = async () => {
  try {

    const res = await api.get("/api/vehicles?page=0&size=100");

    // ✅ FIXED (strict extraction)
    const data = res?.data?.data?.content || [];

    setVehicles(Array.isArray(data) ? data : []);

  } catch (err) {
    console.error("Failed to fetch vehicles:", err);
  }
};

  // ================= AUTO REFRESH =================

  useEffect(() => {

    fetchVehicles();

    const interval = setInterval(fetchVehicles, 5000);

    return () => clearInterval(interval);

  }, []);

  // ================= ICON GENERATOR =================

  const getIcon = (isRunning) => {

    let iconUrl =
      "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";

    if (isRunning) {
      iconUrl = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
    }

    return new L.Icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  // ================= MAP CENTER =================

  const center =
    vehicles.length > 0 && vehicles[0].latitude && vehicles[0].longitude
      ? [vehicles[0].latitude, vehicles[0].longitude]
      : [19.0760, 72.8777];

  // ================= CORRECT STATUS LOGIC =================

  const running = vehicles.filter(v => v.status === "IN_USE").length;
  const idle = vehicles.filter(v => v.status !== "IN_USE").length;

  return (
    <div className="page-wrapper">

      <div className="page-header">
        <h1>Fleet Live Map</h1>
        <p>Real-time vehicle location tracking</p>
      </div>

      {/* ================= STATS ================= */}

      <div className="kpi-grid">

        <div className="card kpi-card">
          <h4>Total Vehicles</h4>
          <h2>{vehicles.length}</h2>
        </div>

        <div className="card kpi-card">
          <h4>Running</h4>
          <h2>{running}</h2>
        </div>

        <div className="card kpi-card">
          <h4>Idle</h4>
          <h2>{idle}</h2>
        </div>

      </div>

      {/* ================= MAP ================= */}

      <div className="card map-card">

        <MapContainer
          center={center}
          zoom={6}
          style={{ height: "500px", width: "100%" }}
        >

          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {vehicles.map((vehicle) => {

            if (!vehicle.latitude || !vehicle.longitude) return null;

            const isRunning = vehicle.status === "IN_USE";

            return (
              <Marker
                key={vehicle.id}
                position={[vehicle.latitude, vehicle.longitude]}
                icon={getIcon(isRunning)}
              >

                <Popup>

                  <strong>{vehicle.vehicleNumber}</strong>
                  <br />

                  Model: {vehicle.model}
                  <br />

                  Status: {isRunning ? "RUNNING" : "IDLE"}
                  <br />

                  Speed: {vehicle.speed} km/h
                  <br />

                  Fuel: {vehicle.fuelLevel}%

                </Popup>

              </Marker>
            );
          })}

        </MapContainer>

      </div>

    </div>
  );
}

export default FleetMap;