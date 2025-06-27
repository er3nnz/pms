import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import projectService from "../../services/ProjectService";
import assignmentService from "../../services/ProjectAssignmentService";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      projectService.getProjectById(id),
      assignmentService.listMyProjects()
    ])
      .then(([projRes, assignRes]) => {
        setProject(projRes.data);
        const found = assignRes.data.find(a => String(a.projectId) === String(id));
        setAssignment(found);
      })
      .catch(() => setError("Failed to fetch project details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!project) return null;

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>{project.name}</h4>
        <Link to="/employee/projects" className="btn btn-outline-primary" style={{ fontWeight: 600, borderRadius: 8, borderColor: "var(--primary-color)" }}>Back to My Projects</Link>
      </div>
      <div className="card mb-4 shadow-sm" style={{ borderRadius: "var(--card-radius)" }}>
        <div className="card-body">
          <div className="mb-2"><strong>Description:</strong> {project.description}</div>
          <div className="mb-2"><strong>Status:</strong> {project.status}</div>
          <div className="mb-2"><strong>Start Date:</strong> {project.startDate}</div>
          <div className="mb-2"><strong>End Date:</strong> {project.endDate}</div>
          <div className="mb-2"><strong>Assigned Date:</strong> {assignment?.assignedDate || "-"}</div>
        </div>
      </div>
    </div>
  );
}
