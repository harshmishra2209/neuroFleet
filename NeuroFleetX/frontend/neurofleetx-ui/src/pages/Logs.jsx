import { useEffect, useState } from "react";
import api from "../services/api";

function Logs() {

  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // ================= FETCH DATA =================
  const fetchLogs = async () => {
    try {

      const bookingRes = await api.get("/api/bookings");
      const vehicleRes = await api.get("/api/vehicles?page=0&size=50");

      const bookings = bookingRes.data || [];
      const vehicles =
        vehicleRes.data.data?.content ||
        vehicleRes.data.data ||
        [];

      // ================= BUILD LOGS =================

      const bookingLogs = bookings.map((b) => ({
        id: `B-${b.id}`,
        type: "BOOKING",
        message: `Trip ${b.status} from ${b.pickupLocation} → ${b.dropLocation}`,
        time: b.createdAt,
        status: b.status
      }));

      const vehicleLogs = vehicles.map((v) => ({
        id: `V-${v.id}`,
        type: "VEHICLE",
        message: `Vehicle ${v.vehicleNumber} is ${v.status}`,
        time: v.createdAt,
        status: v.status
      }));

      const allLogs = [...bookingLogs, ...vehicleLogs].sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );

      setLogs(allLogs);

    } catch (err) {
      console.error("Logs fetch error", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // ================= FILTER =================
  const filteredLogs = logs.filter((log) => {

    if (filter !== "ALL" && log.type !== filter) return false;

    if (search && !log.message.toLowerCase().includes(search.toLowerCase()))
      return false;

    return true;
  });

  return (
    <div className="page-wrapper">

      {/* HEADER */}
      <div className="page-header">
        <h1>System Logs</h1>
        <p>Monitor system activities and events</p>
      </div>

      {/* CONTROLS */}
      <div className="logs-controls">

        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filters">
          {["ALL", "BOOKING", "VEHICLE"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

      </div>

      {/* LOG LIST */}
      <div className="logs-container">

        {filteredLogs.length === 0 && (
          <p>No logs found</p>
        )}

        {filteredLogs.map((log) => (

          <div key={log.id} className="log-card">

            <div className="log-left">
              <span className={`log-type ${log.type.toLowerCase()}`}>
                {log.type}
              </span>
            </div>

            <div className="log-content">
              <p>{log.message}</p>
              <span className="log-time">
                {new Date(log.time).toLocaleString()}
              </span>
            </div>

            <div className="log-right">
              <span className={`status-badge ${log.status?.toLowerCase()}`}>
                {log.status}
              </span>
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Logs;