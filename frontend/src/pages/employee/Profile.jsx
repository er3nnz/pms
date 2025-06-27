import { useEffect, useState } from "react";
import userService from "../../services/UserService";
import Button from "../../components/Button";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => {
    userService.getCurrentUser().then(res => {
      setUser(res.data);
      setEmail(res.data.email);
    });
  }, []);

  const handleEmailUpdate = (e) => {
    e.preventDefault();
    setEmailMsg("");
    userService.updateEmail({ email })
      .then(() => setEmailMsg("Email updated successfully!"))
      .catch(() => setEmailMsg("Failed to update email."));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setPwMsg("");
    userService.updatePassword({ oldPassword, newPassword })
      .then(() => {
        setPwMsg("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
      })
      .catch(() => setPwMsg("Failed to update password."));
  };

  if (!user) return <div className="container mt-4"><div className="alert alert-info">Loading...</div></div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h4 className="mb-4" style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>My Profile</h4>
      <div className="card mb-4 shadow-sm" style={{ borderRadius: "var(--card-radius)" }}>
        <div className="card-body">
          <h5 className="card-title mb-3" style={{ color: "var(--primary-color)", fontWeight: 700 }}>Profile Information</h5>
          <div className="mb-2"><strong>Username:</strong> {user.username}</div>
          <div className="mb-2"><strong>Full Name:</strong> {user.fullName}</div>
          <div className="mb-2"><strong>Position:</strong> {user.position}</div>
          <div className="mb-2"><strong>Roles:</strong> {user.roles?.join(", ")}</div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm" style={{ borderRadius: "var(--card-radius)" }}>
        <div className="card-body">
          <h5 className="card-title mb-3" style={{ color: "var(--primary-color)", fontWeight: 700 }}>Update Email</h5>
          {emailMsg && <div className="alert alert-info py-2">{emailMsg}</div>}
          <form onSubmit={handleEmailUpdate} className="row g-2 align-items-end">
            <div className="col-12 col-md-8">
              <input
                type="email"
                className="form-control"
                style={{ borderRadius: "var(--card-radius)" }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-12 col-md-4">
              <Button type="submit" className="w-100" style={{ fontWeight: 600, borderRadius: 8 }}>Update Email</Button>
            </div>
          </form>
        </div>
      </div>

      <div className="card mb-4 shadow-sm" style={{ borderRadius: "var(--card-radius)" }}>
        <div className="card-body">
          <h5 className="card-title mb-3" style={{ color: "var(--primary-color)", fontWeight: 700 }}>Change Password</h5>
          {pwMsg && <div className="alert alert-info py-2">{pwMsg}</div>}
          <form onSubmit={handlePasswordUpdate} className="row g-2 align-items-end">
            <div className="col-12 col-md-5">
              <input
                type="password"
                className="form-control"
                style={{ borderRadius: "var(--card-radius)" }}
                placeholder="Old Password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-12 col-md-5">
              <input
                type="password"
                className="form-control"
                style={{ borderRadius: "var(--card-radius)" }}
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-12 col-md-2">
              <Button type="submit" className="w-100" style={{ fontWeight: 600, borderRadius: 8 }}>Update</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
