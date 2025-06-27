import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { FaUserCircle, FaSignOutAlt, FaProjectDiagram, FaUsers, FaClipboardList, FaHome } from "react-icons/fa";

export default function ManagerHeader() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ background: "var(--primary-color)", boxShadow: "0 2px 8px rgba(54,116,181,0.08)" }}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/manager/dashboard" style={{ color: "#fff", fontWeight: 700, fontSize: "1.3rem", letterSpacing: 1 }}>
          <FaProjectDiagram style={{ marginRight: 8, fontSize: 24 }} /> ProManage
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#managerNavbar" aria-controls="managerNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>
        <div className="collapse navbar-collapse" id="managerNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/manager/dashboard" style={{ color: "#fff", fontWeight: 500 }}>
                <FaHome style={{ marginRight: 4 }} /> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manager/projects" style={{ color: "#fff", fontWeight: 500 }}>
                <FaClipboardList style={{ marginRight: 4 }} /> Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manager/users" style={{ color: "#fff", fontWeight: 500 }}>
                <FaUsers style={{ marginRight: 4 }} /> Users
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manager/audit-logs" style={{ color: "#fff", fontWeight: 500 }}>
                <FaClipboardList style={{ marginRight: 4 }} /> Audit Logs
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <Link to="/manager/profile" className="d-flex align-items-center" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>
              <FaUserCircle size={26} style={{ marginRight: 6 }} />
              <span style={{ fontSize: "1rem" }}>{user?.sub || "Manager"}</span>
            </Link>
            <button className="btn btn-light btn-sm ms-2 d-flex align-items-center" style={{ borderRadius: 8, fontWeight: 600, color: "var(--primary-color)" }} onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: 4 }} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
