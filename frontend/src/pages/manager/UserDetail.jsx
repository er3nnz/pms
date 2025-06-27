import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import userService from "../../services/UserService";
import assignmentService from "../../services/ProjectAssignmentService";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      userService.getUserById(id),
      assignmentService.listMyProjects(id)
    ])
      .then(([userRes, assignRes]) => {
        setUser(userRes.data);
        setAssignments(assignRes.data);
      })
      .catch(() => setError("Failed to fetch user details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!user) return null;

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>{user.fullName}</h4>
        <div>
          <Link to={`/manager/users/${user.id}/edit`} className="btn btn-primary me-2" style={{ fontWeight: 600, borderRadius: 8 }}>Edit</Link>
          <Link to="/manager/users" className="btn btn-outline-primary" style={{ fontWeight: 600, borderRadius: 8, borderColor: "var(--primary-color)" }}>Back to Users</Link>
        </div>
      </div>
      <div className="card mb-4 shadow-sm" style={{ borderRadius: "var(--card-radius)" }}>
        <div className="card-body">
          <div className="mb-2"><strong>Username:</strong> {user.username}</div>
          <div className="mb-2"><strong>Email:</strong> {user.email}</div>
          <div className="mb-2"><strong>Position:</strong> {user.position}</div>
          <div className="mb-2"><strong>Roles:</strong> {user.roles?.join(", ")}</div>
        </div>
      </div>
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-white" style={{ fontWeight: 700, color: "var(--primary-color)", borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
          Assigned Projects
        </div>
        <div className="card-body p-0">
          <table className="table mb-0 table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Project</th>
                <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 && (
                <tr><td colSpan={2} className="text-center text-muted">No projects assigned.</td></tr>
              )}
              {assignments.map(a => (
                <tr key={a.assignmentId}>
                  <td>{a.projectName}</td>
                  <td>{a.assignedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
