import AdminDashboard from "../components/AdminDashboard";
import ManagerDashboard from "../components/ManagerDashboard";
import DriverDashboard from "../components/DriverDashboard";
import CustomerDashboard from "../components/CustomerDashboard";

function Dashboard() {
  const role = localStorage.getItem("role");

  if (role === "ADMIN") return <AdminDashboard />;
  if (role === "MANAGER") return <ManagerDashboard />;
  if (role === "CUSTOMER") return <CustomerDashboard />;
  if (role === "DRIVER") return <DriverDashboard />;

  return <h1>Unauthorized</h1>;
}

export default Dashboard;