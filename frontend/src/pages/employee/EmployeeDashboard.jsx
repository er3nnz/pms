import { useEffect, useState } from "react";
import assignmentService from "../../services/ProjectAssignmentService";
import { useAuthContext } from "../../context/AuthContext";
import { FaFolder } from "react-icons/fa";

export default function EmployeeDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    assignmentService.listMyProjects()
      .then(res => setAssignments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4" style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>Welcome, {user.sub}!</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100" style={{ borderLeft: "6px solid var(--primary-color)", borderRadius: "var(--card-radius)" }}>
            <div className="card-body d-flex align-items-center">
              <FaFolder size={36} style={{ color: "var(--primary-color)", marginRight: 18 }}/>
              <div>
                <h5 className="card-title mb-1" style={{ color: "var(--primary-color)", fontWeight: 700 }}>Assigned Projects</h5>
                <h2 style={{ fontWeight: 800, color: "var(--primary-color)" }}>{assignments.length}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card h-100 shadow-sm" style={{ borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
            <div className="card-header bg-white" style={{ fontWeight: 700, color: "var(--primary-color)", borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
              Recent Assignments
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="alert alert-info m-3">Loading...</div>
              ) : assignments.length === 0 ? (
                <div className="alert alert-secondary m-3 text-center">No assignments yet.</div>
              ) : (
                <table className="table mb-0 table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Project</th>
                      <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Description</th>
                      <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Assigned Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.slice(-5).reverse().map(a => (
                      <tr key={a.assignmentId}>
                        <td>{a.projectName}</td>
                        <td>{a.projectDescription || <span className="text-muted">No description</span>}</td>
                        <td>{a.assignedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
