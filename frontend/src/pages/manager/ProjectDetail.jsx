import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import projectService from "../../services/ProjectService";
import assignmentService from "../../services/ProjectAssignmentService";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      projectService.getProjectById(id),
      assignmentService.listEmployeesByProject(id)
    ])
      .then(([projRes, assignRes]) => {
        setProject(projRes.data);
        setAssignments(assignRes.data);
      })
      .catch(() => setError("Failed to fetch project details."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      projectService.deleteProject(id)
        .then(() => navigate("/manager/projects"))
        .catch(() => setError("Failed to delete project."));
    }
  };

  if (loading) return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!project) return null;

  return (
    <div className="container mt-4" style={{ maxWidth: 800 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>{project.name}</h2>
        <div className="d-flex gap-2">
          <Link to={`/manager/projects/${id}/edit`} className="btn btn-outline-primary" style={{ fontWeight: 600, borderRadius: 8, borderColor: "var(--primary-color)" }}>Edit</Link>
          <button className="btn btn-danger" style={{ fontWeight: 600, borderRadius: 8 }} onClick={handleDelete}>Delete</button>
        </div>
      </div>
      <div className="card mb-4 shadow-sm" style={{ borderRadius: "var(--card-radius)" }}>
        <div className="card-body">
          <div className="mb-2"><strong>Description:</strong> {project.description}</div>
          <div className="mb-2"><strong>Status:</strong> {project.status}</div>
          <div className="mb-2"><strong>Start Date:</strong> {project.startDate}</div>
          <div className="mb-2"><strong>End Date:</strong> {project.endDate}</div>
        </div>
      </div>
      <div className="card mb-4 shadow-sm" style={{ borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)"  }}>
        <div className="card-header bg-white" style={{ fontWeight: 700, color: "var(--primary-color)",borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
          Assigned Employees
          <Link to={`/manager/assignments?project=${id}`} className="btn btn-sm btn-primary float-end" style={{ fontWeight: 600, borderRadius: 8 }}>Assign Employee</Link>
        </div>
        <div className="card-body p-0">
          <table className="table mb-0 table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Employee</th>
                <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Assigned Date</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 && (
                <tr><td colSpan={2} className="text-center text-muted">No employees assigned.</td></tr>
              )}
              {assignments.map(a => (
                <tr key={a.assignmentId}>
                  <td>{a.employeeName}</td>
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
