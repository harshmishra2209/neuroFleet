import { useEffect, useState } from "react";
import api from "../services/api";

function Reports() {

  const [vehicles, setVehicles] = useState([]);

  const [summary, setSummary] = useState({
    totalVehicles: 0,
    running: 0,
    idle: 0,
    avgFuel: 0,
  });

  // ================= FETCH DATA =================

  const fetchVehicles = async () => {
    try {

      const res = await api.get("/api/vehicles?page=0&size=100");

      const data =
        res?.data?.data?.content ||
        res?.data?.data ||
        [];

      setVehicles(data);

      // ✅ FIXED LOGIC
      const running = data.filter(v => v.status === "IN_USE").length;
      const idle = data.filter(v => v.status !== "IN_USE").length;

      const avgFuel =
        data.length > 0
          ? (
              data.reduce((sum, v) => sum + v.fuelLevel, 0) / data.length
            ).toFixed(1)
          : 0;

      setSummary({
        totalVehicles: data.length,
        running,
        idle,
        avgFuel,
      });

    } catch (err) {
      console.error("Reports fetch error:", err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ================= EXPORT CSV =================

  const exportCSV = () => {

    const headers = [
      "Vehicle Number",
      "Model",
      "Fuel Level",
      "Speed",
      "Activity",
      "Status",
    ];

    const rows = vehicles.map(v => {

      const isRunning = v.status === "IN_USE";

      return [
        v.vehicleNumber,
        v.model,
        v.fuelLevel,
        v.speed,
        isRunning ? "RUNNING" : "IDLE",
        v.status,
      ];
    });

    const csvContent =
      [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "fleet-report.csv";
    a.click();
  };

  return (
    <div className="page-wrapper">

      {/* HEADER */}

      <div className="page-header">
        <h1>Reports</h1>
        <p>Fleet operational reports and summaries</p>

        <button className="primary-btn" onClick={exportCSV}>
          Export CSV
        </button>

      </div>
      <br />

      {/* SUMMARY REPORT */}

      <div className="kpi-grid">

        <div className="card kpi-card">
          <h4>Total Vehicles</h4>
          <h2>{summary.totalVehicles}</h2>
        </div>

        <div className="card kpi-card">
          <h4>Running Vehicles</h4>
          <h2>{summary.running}</h2>
        </div>

        <div className="card kpi-card">
          <h4>Idle Vehicles</h4>
          <h2>{summary.idle}</h2>
        </div>

        <div className="card kpi-card">
          <h4>Average Fuel</h4>
          <h2>{summary.avgFuel}%</h2>
        </div>

      </div>

      {/* VEHICLE ACTIVITY REPORT */}

      <div className="section">

        <h3>Vehicle Activity Report</h3>

        <div className="card table-card">

          <table className="vehicle-table">

            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Model</th>
                <th>Status</th>
                <th>Activity</th>
                <th>Speed</th>
              </tr>
            </thead>

            <tbody>

              {vehicles.map(v => {

                const isRunning = v.status === "IN_USE";

                return (
                  <tr key={v.id}>

                    <td>{v.vehicleNumber}</td>
                    <td>{v.model}</td>

                    <td>
                      <span className={`status-badge ${v.status?.toLowerCase()}`}>
                        {v.status}
                      </span>
                    </td>

                    <td>
                      <span className={`activity ${isRunning ? "running" : "idle"}`}>
                        {isRunning ? "RUNNING" : "IDLE"}
                      </span>
                    </td>

                    <td>{v.speed} km/h</td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* FUEL REPORT */}

      <div className="section">

        <h3>Fuel Report</h3>

        <div className="card table-card">

          <table className="vehicle-table">

            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Model</th>
                <th>Fuel Level</th>
              </tr>
            </thead>

            <tbody>

              {vehicles.map(v => (

                <tr key={v.id}>

                  <td>{v.vehicleNumber}</td>
                  <td>{v.model}</td>
                  <td>{v.fuelLevel}%</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* LOW FUEL REPORT */}

      <div className="section">

        <h3>Low Fuel Alerts</h3>

        <div className="card table-card">

          <table className="vehicle-table">

            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Model</th>
                <th>Fuel</th>
              </tr>
            </thead>

            <tbody>

              {vehicles
                .filter(v => v.fuelLevel < 20)
                .map(v => (

                  <tr key={v.id}>

                    <td>{v.vehicleNumber}</td>
                    <td>{v.model}</td>
                    <td>{v.fuelLevel}%</td>

                  </tr>

                ))}

              {vehicles.filter(v => v.fuelLevel < 20).length === 0 && (
                <tr>
                  <td colSpan="3">No low fuel vehicles</td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Reports;