import { useEffect, useState } from "react";
import api from "../services/api";

function Settings() {

  const defaultSettings = {
    speedLimit: 80,
    lowFuelThreshold: 20,
    maintenanceThreshold: 5000,
    notifications: true,
    autoRefresh: 10,
    theme: "light",
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");

  // ================= LOAD SETTINGS =================

  const loadSettings = async () => {
    try {

      const res = await api.get("/api/settings");

      const data = res?.data?.data;

      if (data) {
        setSettings(data);
        localStorage.setItem("fleetSettings", JSON.stringify(data));
      }

    } catch {

      // fallback to localStorage if backend not implemented yet

      const stored = localStorage.getItem("fleetSettings");

      if (stored) {
        setSettings(JSON.parse(stored));
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : Number(value) || value,
    });
  };

  // ================= VALIDATION =================

  const validateSettings = () => {

    if (settings.speedLimit < 20 || settings.speedLimit > 200) {
      return "Speed limit must be between 20 and 200 km/h";
    }

    if (settings.lowFuelThreshold < 5 || settings.lowFuelThreshold > 50) {
      return "Fuel threshold must be between 5% and 50%";
    }

    if (settings.autoRefresh < 5) {
      return "Auto refresh must be at least 5 seconds";
    }

    return null;
  };

  // ================= SAVE SETTINGS =================

  const saveSettings = async () => {

    const validationError = validateSettings();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      await api.put("/api/settings", settings);

      localStorage.setItem("fleetSettings", JSON.stringify(settings));

      setSavedMessage("Settings saved successfully");
      setError("");

      setTimeout(() => setSavedMessage(""), 3000);

    } catch {

      // if backend not implemented
      localStorage.setItem("fleetSettings", JSON.stringify(settings));

      setSavedMessage("Saved locally");
      setError("");

      setTimeout(() => setSavedMessage(""), 3000);
    }
  };

  if (loading) {
    return <div className="page-wrapper">Loading settings...</div>;
  }

  return (
    <div className="page-wrapper">

      {/* HEADER */}

      <div className="page-header">
        <h1>System Settings</h1>
        <br />
      </div>

      <div className="settings-grid">

        {/* OPERATIONAL SETTINGS */}

        <div className="card settings-section">

          <h3>Operational Rules</h3>

          <div className="setting-item">

            <label>Fleet Speed Limit (km/h)</label>

            <input
              type="number"
              name="speedLimit"
              value={settings.speedLimit}
              onChange={handleChange}
            />

            <p className="setting-desc">
              Vehicles exceeding this speed trigger alerts.
            </p>

          </div>

          <div className="setting-item">

            <label>Maintenance Distance Threshold (km)</label>

            <input
              type="number"
              name="maintenanceThreshold"
              value={settings.maintenanceThreshold}
              onChange={handleChange}
            />

            <p className="setting-desc">
              Vehicles exceeding this mileage require maintenance.
            </p>

          </div>

        </div>
        <br />

        {/* ALERT SETTINGS */}

        <div className="card settings-section">

          <h3>Alert Configuration</h3>

          <div className="setting-item">

            <label>Low Fuel Alert Threshold (%)</label>

            <input
              type="number"
              name="lowFuelThreshold"
              value={settings.lowFuelThreshold}
              onChange={handleChange}
            />

          </div>

          <div className="setting-item toggle-setting">

            <label>Enable System Notifications</label>

            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
            />

          </div>

        </div>
        <br />

        {/* DASHBOARD SETTINGS */}

        <div className="card settings-section">

          <h3>Dashboard Behavior</h3>

          <div className="setting-item">

            <label>Dashboard Auto Refresh (seconds)</label>

            <input
              type="number"
              name="autoRefresh"
              value={settings.autoRefresh}
              onChange={handleChange}
            />

          </div>

          <div className="setting-item">

            <label>Dashboard Theme</label>

            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>

          </div>

        </div>

      </div>

      {/* SAVE BUTTON */}
      <br />

      <div className="settings-actions">

        <button className="primary-btn" onClick={saveSettings}>
          Save Settings
        </button>

        {savedMessage && (
          <span className="save-message success">{savedMessage}</span>
        )}

        {error && (
          <span className="save-message error">{error}</span>
        )}

      </div>

    </div>
  );
}

export default Settings;