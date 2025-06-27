import { useState } from "react";
import authService from "../../services/AuthService";
import { useNavigate, Link } from "react-router-dom";
import "../../css/Auth.css";
import { FaUserPlus } from "react-icons/fa";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    position: "",
    roles: new Set([])
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await authService.register(
        formData.username,
        formData.password,
        formData.email,
        formData.firstName,
        formData.lastName,
        formData.position,
        Array.from(formData.roles)
      );
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Kayıt başarısız");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.2rem' }}>
          <FaUserPlus size={50} color="#3674B5" style={{ marginBottom: '0.5rem' }} />
          <h2 className="text-center mb-4" style={{ marginBottom: '0.5rem' }}>ProManage Register</h2>
          <div style={{ color: '#888', fontSize: '1rem', marginBottom: '0.2rem', textAlign: 'center' }}>
            Register now and join your team!
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            ["Username", "username"],
            ["Password", "password", "password"],
            ["Email", "email", "email"],
            ["First Name", "firstName"],
            ["Last Name", "lastName"],
            ["Position", "position"]
          ].map(([label, name, type = "text"]) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          ))}
          <button type="submit" className="button w-100">
            Register
          </button>
        </form>
        <div style={{ marginTop: '1.2rem', textAlign: 'center', color: '#555', fontSize: '0.98rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3674B5', fontWeight: 600, textDecoration: 'underline' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
