import { useEffect, useState } from "react";
import projectService from "../../services/ProjectService";
import userService from "../../services/UserService";
import { Link } from "react-router-dom";
import { FaClipboardList, FaUsers, FaPlusCircle, FaClipboardCheck } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import Button from "../../components/Button";

export default function ManagerDashboard() {
  const [projectCount, setProjectCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    projectService.getAllProjects().then(res => {
      setProjectCount(res.data.length);
      setRecentProjects(res.data.slice(-5).reverse());
    });
    userService.getAllUsers().then(res => setUserCount(res.data.length));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4" style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>Welcome, {user.sub}!</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100" style={{ borderLeft: "6px solid var(--primary-color)", borderRadius: "var(--card-radius)" }}>
            <div className="card-body d-flex align-items-center">
              <FaClipboardList size={36} style={{ color: "var(--primary-color)", marginRight: 18 }} />
              <div>
                <h5 className="card-title mb-1" style={{ color: "var(--primary-color)", fontWeight: 700 }}>Total Projects</h5>
                <h2 style={{ fontWeight: 800, color: "var(--primary-color)" }}>{projectCount}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100" style={{ borderLeft: "6px solid #5fa8e6", borderRadius: "var(--card-radius)" }}>
            <div className="card-body d-flex align-items-center">
              <FaUsers size={36} style={{ color: "#5fa8e6", marginRight: 18 }} />
              <div>
                <h5 className="card-title mb-1" style={{ color: "#5fa8e6", fontWeight: 700 }}>Total Users</h5>
                <h2 style={{ fontWeight: 800, color: "#5fa8e6" }}>{userCount}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card h-100 shadow-sm" style={{ borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)"  }}>
            <div className="card-header bg-white" style={{ fontWeight: 700, color: "var(--primary-color)", borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
              Recent Projects
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table mb-0 table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Name</th>
                      <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Status</th>
                      <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Start</th>
                      <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.length === 0 && (
                      <tr><td colSpan={4} className="text-center text-muted">No projects found.</td></tr>
                    )}
                    {recentProjects.map(p => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.status}</td>
                        <td>{p.startDate}</td>
                        <td>{p.endDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: "var(--card-radius)" }}>
            <div className="card-header bg-white" style={{ fontWeight: 700, color: "var(--primary-color)", borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
              Quick Actions
            </div>
            <div className="card-body d-flex flex-column gap-3">
              <Link to="/manager/projects/new" style={{ textDecoration: "none" }}>
                <Button className="d-flex align-items-center gap-2"><FaPlusCircle /> New Project</Button>
              </Link>
              <Link to="/manager/users" style={{ textDecoration: "none" }}>
                <Button className="d-flex align-items-center gap-2" style={{ background: "#fff", color: "var(--primary-color)", border: "1px solid var(--primary-color)" }}><FaUsers /> Manage Users</Button>
              </Link>
              <Link to="/manager/assignments" style={{ textDecoration: "none" }}>
                <Button className="d-flex align-items-center gap-2" style={{ background: "#fff", color: "var(--primary-color)", border: "1px solid var(--primary-color)" }}><FaClipboardCheck /> Assign Employees</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
