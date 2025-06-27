import { useState } from "react";
import projectService from "../../services/ProjectService";
import { useNavigate } from "react-router-dom";

export default function ProjectCreate() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    projectService.createProject(form)
      .then(() => {
        setSuccess("Project created successfully!");
        setTimeout(() => navigate("/manager/projects"), 1200);
      })
      .catch(err => setError(err.response?.data?.message || "Failed to create project."));
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h4 className="mb-4" style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>Create New Project</h4>
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
            <div className="col-12 d-flex justify-content-end">
              <button type="submit" className="btn btn-primary px-4" style={{ fontWeight: 600, borderRadius: 8 }}>Create Project</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
