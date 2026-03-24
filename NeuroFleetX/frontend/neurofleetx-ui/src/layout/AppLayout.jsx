import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-section">
        <Topbar />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;