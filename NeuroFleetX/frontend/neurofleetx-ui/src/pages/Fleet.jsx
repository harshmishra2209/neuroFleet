import { useEffect, useState } from "react";
import api from "../services/api";

function Fleet() {

  const [vehicles, setVehicles] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [filter, setFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    model: "",
    latitude: "",
    longitude: "",
    speed: "",
    fuelLevel: "",
  });

  // ================= FETCH VEHICLES =================

  const fetchVehicles = async () => {
    try {
      const res = await api.get(`/api/vehicles?page=${page}&size=5`);

      const data = res?.data?.data;

      if (Array.isArray(data)) {
        setVehicles(data);
        setTotalPages(1);
      } 
      else if (data?.content) {
        setVehicles(data.content);
        setTotalPages(data.totalPages);
      } 
      else {
        setVehicles([]);
        setTotalPages(1);
      }

    } catch (err) {
      console.error("Error fetching vehicles", err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [page]);

  // ================= FILTER =================

  const filteredVehicles =
    filter === "ALL"
      ? vehicles
      : vehicles.filter(v => v.status === filter);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CREATE / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingVehicle) {
        await api.put(`/api/vehicles/${editingVehicle.id}`, formData);
      } else {
        await api.post("/api/vehicles", formData);
      }

      setShowModal(false);
      setEditingVehicle(null);
      resetForm();
      fetchVehicles();

    } catch (err) {
      console.error("Save failed");
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id, isRunning) => {

    if (isRunning) {
      alert("Cannot delete a running vehicle");
      return;
    }

    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/api/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleNumber: "",
      model: "",
      latitude: "",
      longitude: "",
      speed: "",
      fuelLevel: "",
    });
  };

  const openEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData(vehicle);
    setShowModal(true);
  };

  return (
    <div className="page-wrapper">

      <div className="page-header">
        <h1>Fleet Inventory</h1>
        <p>Real-time vehicle telemetry & status monitoring</p>

        <button
          className="primary-btn"
          onClick={() => {
            resetForm();
            setEditingVehicle(null);
            setShowModal(true);
          }}
        >
          + Add Vehicle
        </button>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        {["ALL", "AVAILABLE", "IN_USE"].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "IN_USE" ? "In Use" : f}
          </button>
        ))}
      </div>

      {/* CARD GRID */}
      <div className="fleet-grid">

        {filteredVehicles.map((v) => {

          const isRunning = v.status === "IN_USE";

          return (
            <div key={v.id} className="fleet-card">

              {/* HEADER */}
              <div className="fleet-header">
                <h4>{v.model}</h4>
                <span className={`status-badge ${v.status?.toLowerCase()}`}>
                  {v.status === "IN_USE" ? "In Use" : "Available"}
                </span>
              </div>

              <p className="vehicle-number">{v.vehicleNumber}</p>

              <p>📍 {v.latitude || "-"}, {v.longitude || "-"}</p>

              {/* FUEL */}
              <div className="metric">
                <span>Fuel</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${v.fuelLevel}%` }}
                  />
                </div>
                <span>{v.fuelLevel}%</span>
              </div>

              {/* SPEED */}
              <p>Speed: {v.speed} km/h</p>

              {/* ACTIVITY */}
              <p className={isRunning ? "running" : "idle"}>
                {isRunning ? "RUNNING" : "IDLE"}
              </p>

              {/* ACTIONS */}
              <div className="card-actions">

                <button
                  className="secondary-btn small"
                  onClick={() => openEdit(v)}
                >
                  Edit
                </button>

                <button
                  className="danger-btn small"
                  disabled={isRunning}
                  onClick={() => handleDelete(v.id, isRunning)}
                  style={{
                    opacity: isRunning ? 0.5 : 1,
                    cursor: isRunning ? "not-allowed" : "pointer"
                  }}
                >
                  Delete
                </button>

              </div>

            </div>
          );
        })}

      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
        </span>

        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h3>{editingVehicle ? "Edit Vehicle" : "Add Vehicle"}</h3>

            <form onSubmit={handleSubmit}>

              <input
                name="vehicleNumber"
                placeholder="Vehicle Number"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />

              <input
                name="model"
                placeholder="Model"
                value={formData.model}
                onChange={handleChange}
                required
              />

              <input
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleChange}
              />

              <input
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleChange}
              />

              <input
                name="speed"
                placeholder="Speed"
                value={formData.speed}
                onChange={handleChange}
              />

              <input
                name="fuelLevel"
                placeholder="Fuel Level"
                value={formData.fuelLevel}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  Save
                </button>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Fleet;