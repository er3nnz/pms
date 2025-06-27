import { useState } from "react";
import authService from "../../services/AuthService";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../../css/Auth.css";
import { FaUserCircle } from "react-icons/fa";

export default function LoginPage() {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuthContext();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authService.login(credential, password);
        if (response.data.token) {
            login(response.data.token);
            navigate("/", { replace: true });
        } else {
            setError("Invalid login response");
        }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.2rem' }}>
          <FaUserCircle size={54} color="#3674B5" style={{ marginBottom: '0.5rem' }} />
          <h2 className="text-center mb-4" style={{ marginBottom: '0.5rem' }}>ProManage Login</h2>
          <div style={{ color: '#888', fontSize: '1rem', marginBottom: '0.2rem', textAlign: 'center' }}>
            Welcome! Please login.
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3 d-flex flex-column">
            <label className="form-label">Username / Email</label>
            <input
              type="text"
              className="form-control"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 d-flex flex-column">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button w-100">
            Login
          </button>
        </form>
        <div style={{ marginTop: '1.2rem', textAlign: 'center', color: '#555', fontSize: '0.98rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#3674B5', fontWeight: 600, textDecoration: 'underline' }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
