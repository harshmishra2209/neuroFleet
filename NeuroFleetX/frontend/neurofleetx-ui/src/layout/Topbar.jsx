import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="topbar">
      <div className="topbar-title">Dashboard</div>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Topbar;