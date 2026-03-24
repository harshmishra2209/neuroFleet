import { NavLink } from "react-router-dom";

function Sidebar() {

  const role = localStorage.getItem("role");

  return (
    <div className="sidebar">

      <div className="sidebar-logo">NeuroFleetX</div>

      {/* MAIN */}
      <div className="sidebar-section">

        <p className="sidebar-title">Main</p>

        <NavLink to="/dashboard" className="sidebar-link">
          Dashboard
        </NavLink>

        {(role === "ADMIN" || role === "MANAGER") && (
          <>
            <NavLink to="/fleet" className="sidebar-link">
              Fleet
            </NavLink>

            <NavLink to="/fleet-map" className="sidebar-link">
              Fleet Map
            </NavLink>
          </>
        )}

        {role === "CUSTOMER" && (
          <NavLink to="/my-trips" className="sidebar-link">
            Recent Trips
          </NavLink>
        )}

        {role === "DRIVER" && (
          <NavLink to="/assigned-trips" className="sidebar-link">
            Assigned Trips
          </NavLink>
        )}

      </div>

      {/* ADMIN PANEL */}
      {role === "ADMIN" && (
        <div className="sidebar-section">

          <p className="sidebar-title">Administration</p>

          <NavLink to="/analytics" className="sidebar-link">
            Analytics
          </NavLink>

          <NavLink to="/users" className="sidebar-link">
            Users
          </NavLink>

          <NavLink to="/reports" className="sidebar-link">
            Reports
          </NavLink>

          <NavLink to="/settings" className="sidebar-link">
            Settings
          </NavLink>

          <NavLink to="/logs" className="sidebar-link">
            Logs
          </NavLink>

        </div>
      )}

      {/* MANAGER PANEL */}
      {role === "MANAGER" && (
        <div className="sidebar-section">

          <p className="sidebar-title">Operations</p>

          <NavLink to="/analytics" className="sidebar-link">
            Analytics
          </NavLink>

          <NavLink to="/reports" className="sidebar-link">
            Reports
          </NavLink>

        </div>
      )}

      {/* DRIVER PANEL */}
      {role === "DRIVER" && (
        <div className="sidebar-section">

          <p className="sidebar-title">Driver Panel</p>

          <NavLink to="/trip-history" className="sidebar-link">
            Trip History
          </NavLink>

          <NavLink to="/profile" className="sidebar-link">
            Profile
          </NavLink>

        </div>
      )}

      {/* CUSTOMER PANEL */}
      {role === "CUSTOMER" && (
        <div className="sidebar-section">

          <p className="sidebar-title">Account</p>

          <NavLink to="/book-trip" className="sidebar-link">
            Book Trip
          </NavLink>

          <NavLink to="/profile" className="sidebar-link">
            Profile
          </NavLink>

          <NavLink to="/my-bookings" className="sidebar-link">
            My Upcoming Trips
          </NavLink>

        </div>
      )}

    </div>
  );
}

export default Sidebar;