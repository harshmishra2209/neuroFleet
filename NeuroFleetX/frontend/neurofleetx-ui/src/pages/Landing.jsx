import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Landing() {

  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    totalVehicles: 0,
    runningVehicles: 0,
    avgFuel: 0,
    systemHealth: 100,
  });

  // ===== FETCH METRICS =====

  const fetchMetrics = async () => {
    try {

      const res = await api.get("/api/vehicles?page=0&size=100");

      const vehicles = res.data.data.content || [];

      const running = vehicles.filter(
        v => v.activityStatus === "RUNNING"
      ).length;

      const avgFuel =
        vehicles.length > 0
          ? (
              vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) /
              vehicles.length
            ).toFixed(1)
          : 0;

      const systemHealth =
        vehicles.length > 0
          ? (
              (running / vehicles.length) * 100
            ).toFixed(1)
          : 100;

      setMetrics({
        totalVehicles: vehicles.length,
        runningVehicles: running,
        avgFuel,
        systemHealth,
      });

    } catch (err) {
      console.error("Landing metrics error:", err);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="landing-wrapper">

      <div className="landing-container">

        <div className="hero-badge">
          AI-Powered Urban Mobility
        </div>

        <h1 className="hero-title">
          Next-Gen Fleet
          <br />
          Optimization Platform
        </h1>

        <p className="hero-subtext">
          Real-time AI tracking, predictive maintenance,
          intelligent routing, and operational intelligence —
          all in one secure mobility platform.
        </p>

        <div className="hero-actions">

          <button
            className="primary-btn"
            onClick={() => navigate("/register")}
          >
            Launch My Fleet
          </button>

          <button
            className="ghost-btn"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>

        </div>

        {/* HERO METRICS */}

        <div className="hero-metrics">

          <div>
            <h3>{metrics.totalVehicles}</h3>
            <p>Active Vehicles</p>
          </div>

          <div>
            <h3>{metrics.runningVehicles}</h3>
            <p>Running Vehicles</p>
          </div>

          <div>
            <h3>{metrics.systemHealth}%</h3>
            <p>System Health</p>
          </div>

        </div>

      </div>

      {/* PREVIEW CARD */}

      <div className="hero-preview">

        <div className="preview-card">

          <div className="preview-header">
            Fleet Overview
          </div>

          <div className="preview-content">

            <div className="preview-stat">

              <h4>Active Vehicles</h4>

              <p className="stat-value">
                {metrics.totalVehicles}
              </p>

              <div className="stat-bar"></div>

            </div>

            <div className="preview-stat">

              <h4>Fuel Efficiency</h4>

              <p className="stat-value">
                {metrics.avgFuel}%
              </p>

              <div className="stat-bar"></div>

            </div>

            <div className="preview-stat">

              <h4>System Health</h4>

              <p className="stat-value success">
                {metrics.systemHealth}%
              </p>

              <div className="stat-bar"></div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Landing;