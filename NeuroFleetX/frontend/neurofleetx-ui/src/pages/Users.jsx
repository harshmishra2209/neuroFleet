import { useEffect, useState } from "react";
import api from "../services/api";

function Users() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // ================= FETCH USERS =================

  const fetchUsers = async () => {
    try {

      const res = await api.get("/api/users?page=0&size=50");

      const apiResponse = res.data;

      const usersData =
        apiResponse.data?.content ||
        apiResponse.data ||
        [];

      setUsers(usersData);

    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= ENABLE / DISABLE =================

  const toggleUser = async (id) => {
    try {

      await api.put(`/api/users/${id}/toggle`);

      fetchUsers();

    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  // ================= CHANGE ROLE =================

  const changeRole = async (id, newRole) => {
    try {

      await api.put(`/api/users/${id}/role?role=${newRole}`);

      fetchUsers();

    } catch (err) {
      console.error("Role change failed:", err);
    }
  };

  // ================= RESET PASSWORD =================

  const resetPassword = async (id) => {

    const newPassword = prompt("Enter new password");

    if (!newPassword) return;

    try {

      await api.put(`/api/users/${id}/reset-password?newPassword=${newPassword}`);

      alert("Password reset successfully");

    } catch (err) {
      console.error("Password reset failed:", err);
    }
  };

  // ================= DELETE USER =================

  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    try {

      await api.delete(`/api/users/${id}`);

      fetchUsers();

    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ================= FILTER USERS =================

  const filteredUsers = users.filter((user) => {

    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "" || user.role === roleFilter;

    return matchesSearch && matchesRole;

  });

  return (
    <div className="page-wrapper">

      {/* HEADER */}

      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage system users and roles</p>
      </div>

      {/* FILTERS */}

      <div className="card table-card">

        <div className="table-toolbar">

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="DRIVER">Driver</option>
            <option value="CUSTOMER">Customer</option>
          </select>

        </div>

        {/* USERS TABLE */}

        <table className="vehicle-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((user) => (

              <tr key={user.id}>

                <td>{user.id}</td>

                <td>{user.name}</td>

                <td>{user.email}</td>

                {/* ROLE */}

                <td>
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user.id, e.target.value)}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="DRIVER">DRIVER</option>
                    <option value="CUSTOMER">CUSTOMER</option>
                  </select>
                </td>

                {/* STATUS */}

                <td>
                  <span
                    className={`status-badge ${
                      user.enabled ? "active" : "inactive"
                    }`}
                  >
                    {user.enabled ? "Active" : "Disabled"}
                  </span>
                </td>

                {/* ACTIONS */}

                <td>

                  <button
                    className="secondary-btn small"
                    onClick={() => toggleUser(user.id)}
                  >
                    {user.enabled ? "Disable" : "Enable"}
                  </button>

                  <button
                    className="secondary-btn small"
                    onClick={() => resetPassword(user.id)}
                  >
                    Reset
                  </button>

                  {/* prevent deleting admins */}

                  {user.role !== "ADMIN" && (
                    <button
                      className="danger-btn small"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  )}

                </td>

              </tr>

            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Users;