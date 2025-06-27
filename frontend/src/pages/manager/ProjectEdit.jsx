import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import projectService from "../../services/ProjectService";

const statusOptions = ["NEW", "IN_PROGRESS", "COMPLETED", "INCOMPLETE"];

export default function ProjectEdit() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "NEW"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    projectService.getProjectById(id)
      .then(res => {
        setForm({
          name: res.data.name,
          description: res.data.description,
          startDate: res.data.startDate,
          endDate: res.data.endDate,
          status: res.data.status
        });
      })
      .catch(() => setError("Failed to fetch project."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    projectService.updateProject(id, form)
      .then(() => {
        setSuccess("Project updated successfully!");
        setTimeout(() => navigate(`/manager/projects/${id}`), 1200);
      })
      .catch(err => setError(err.response?.data?.message || "Failed to update project."));
  };

  if (loading) return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0" style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>Edit Project</h4>
        <Link to={`/manager/projects/${id}`} className="btn btn-outline-primary" style={{ fontWeight: 600, borderRadius: 8, borderColor: "var(--primary-color)" }}>Back</Link>
      </div>
      <div className="card shadow-sm" style={{ borderRadius: "var(--card-radius)" }}>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label className="form-label" style={{ color: "var(--primary-color)", fontWeight: 600 }}>Project Name</label>
              <input
                type="text"
                className="form-control"
                style={{  borderRadius: "var(--input-radius)" }}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label" style={{ color: "var(--primary-color)", fontWeight: 600 }}>Description</label>
              <textarea
                className="form-control"
                style={{  borderRadius: "var(--input-radius)" }}
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" style={{ color: "var(--primary-color)", fontWeight: 600 }}>Start Date</label>
              <input
                type="date"
                className="form-control"
                style={{  borderRadius: "var(--input-radius)" }}
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" style={{ color: "var(--primary-color)", fontWeight: 600 }}>End Date</label>
              <input
                type="date"
                className="form-control"
                style={{  borderRadius: "var(--input-radius)" }}
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label" style={{ color: "var(--primary-color)", fontWeight: 600 }}>Status</label>
              <select
                className="form-select"
                style={{  borderRadius: "var(--input-radius)" }}
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button type="submit" className="btn btn-primary px-4" style={{ fontWeight: 600, borderRadius: 8 }}>Update Project</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
