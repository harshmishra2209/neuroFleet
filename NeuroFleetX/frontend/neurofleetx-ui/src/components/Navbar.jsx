import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">NeuroFleetX</h2>

      <div>
        {!token && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-button">
              Sign Up
            </Link>
          </>
        )}

        {token && (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button className="nav-link logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;