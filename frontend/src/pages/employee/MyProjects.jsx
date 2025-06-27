import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import assignmentService from "../../services/ProjectAssignmentService";

export default function MyProjects() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assignmentService.listMyProjects()
      .then(res => setAssignments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>My Projects</h4>
      </div>
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <div className="card shadow-sm" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
          <div className="card-body p-0" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
            <div className="table-responsive" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
              <table className="table table-hover align-middle mb-0" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Project</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Assigned Date</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted">No projects assigned.</td>
                    </tr>
                  )}
                  {assignments.map(a => (
                    <tr key={a.assignmentId}>
                      <td>{a.projectName}</td>
                      <td>{a.assignedDate}</td>
                      <td>
                        <Link to={`/employee/projects/${a.projectId}`} className="btn btn-sm btn-outline-primary" style={{ fontWeight: 600, borderRadius: 8, borderColor: "var(--primary-color)" }}>Detail</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
