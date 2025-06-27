import { useEffect, useState } from "react";
import auditLogService from "../../services/AuditLogService";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    auditLogService.getAuditLogs()
      .then(res => setLogs(res.data))
      .catch(() => setError("Failed to fetch audit logs."))
      .finally(() => setLoading(false));
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedLogs = logs.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(logs.length / usersPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4" style={{ color: "var(--primary-color)", fontWeight: 700 }}>Audit Logs</h4>
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="card shadow-sm" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)"}}>
          <div className="card-body p-0" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
            <div className="table-responsive" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
              <table className="table table-hover align-middle mb-0" style={{borderTopLeftRadius: "var(--card-radius)", borderTopRightRadius: "var(--card-radius)" }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>#</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Username</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Action</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Description</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">No audit logs found.</td>
                    </tr>
                  )}
                  {paginatedLogs.map((log, idx) => (
                    <tr key={log.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{log.username}</td>
                      <td>{log.action}</td>
                      <td>{log.description}</td>
                      <td>{log.timestamp?.replace("T", " ").slice(0, 19)}</td>
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
