import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import userService from "../../services/UserService";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ fullName: "", position: "", roles: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    userService.getUserById(id)
      .then(res => {
        setUser(res.data);
        setForm({
          fullName: res.data.fullName || "",
          position: res.data.position || "",
          roles: res.data.roles || [],
        });
      })
      .catch(() => setError("Failed to fetch user details."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };


  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await userService.updateUserById(id, form);
      setSuccess("User updated successfully.");
      setTimeout(() => navigate(`/manager/users/${id}`), 1200);
    } catch {
      setError("Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  if (!user) return null;

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>Edit User</h4>
        <Link to={`/manager/users/${id}`} className="btn btn-outline-primary" style={{ fontWeight: 600, borderRadius: 8, borderColor: "var(--primary-color)" }}>Back</Link>
      </div>
      <div className="card shadow-sm" style={{ borderRadius: "var(--card-radius)" }}>
        <div className="card-body">
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="fullName">Full Name</label>
              <input type="text" className="form-control" id="fullName" name="fullName" value={form.fullName} onChange={handleChange} style={{ borderRadius: "var(--card-radius)" }} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="position">Position</label>
              <input type="text" className="form-control" id="position" name="position" value={form.position} onChange={handleChange} style={{ borderRadius: "var(--card-radius)" }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 600, borderRadius: 8 }} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
