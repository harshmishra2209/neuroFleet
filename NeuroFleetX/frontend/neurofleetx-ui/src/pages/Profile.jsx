import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/me");

      console.log("Profile API:", res.data);

      // ✅ FIX: extract correct data
      const data =
        res?.data?.data ||   // ApiResponse
        res?.data ||         // direct response fallback
        {};

      setUser({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || ""
      });

    } catch (err) {
      console.error("Failed to load profile", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  // ================= SAVE =================
  const handleSave = async () => {
  try {

    setSaving(true);

    const payload = {
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    console.log("Sending payload:", payload);

    const res = await api.put("/api/users/me", payload);

    console.log("Response:", res.data);

    alert("Profile updated successfully");

  } catch (err) {

    console.error("FULL ERROR:", err);

    if (err.response) {
      console.error("Backend error:", err.response.data);
      alert(err.response.data.message || "Update failed");
    } else {
      alert("Server not reachable");
    }

  }

  setSaving(false);
};

  return (
    <div className="page-wrapper">

      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account details</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (

        <div className="card profile-card">

          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          </div>

          <br />

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          </div>

          <br />

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />
          </div>

          <br />

          <button
            className="primary-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>
      )}

    </div>
  );
}

export default Profile;