import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userService from "../../services/UserService";


export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    userService.getAllUsers()
      .then(res => setUsers(res.data))
      .catch(() => setError("Failed to fetch users."))
      .finally(() => setLoading(false));
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>Users</h4>
      </div>
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="card shadow-sm" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
        <div className="card-body p-0" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
          <div className="table-responsive" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
            <table className="table table-hover align-middle mb-0" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Full Name</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Username</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Email</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Position</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Roles</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted">No users found.</td>
                    </tr>
                  )}
                  {paginatedUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.fullName}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.position}</td>
                      <td>{u.roles?.join(", ")}</td>
                      <td>
                        <Link to={`/manager/users/${u.id}`} className="btn btn-sm btn-outline-primary me-2" style={{ fontWeight: 600, borderRadius: 8, borderColor: "var(--primary-color)" }}>Detail</Link>
                        <Link to={`/manager/users/${u.id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                    <button className="page-link" style={{ color: "black" }} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item${currentPage === i + 1 ? ' active' : ''}`}>
                      <button className="page-link" style={{ color: "black" }} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                    <button className="page-link" style={{ color: "black" }} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
