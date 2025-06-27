import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import projectService from "../../services/ProjectService";
import Button from "../../components/Button";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  useEffect(() => {
    projectService.getAllProjects()
      .then(res => setProjects(res.data))
      .catch(() => setError("Failed to fetch projects."))
      .finally(() => setLoading(false));
  }, []);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const paginatedProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: "var(--primary-color)", fontWeight: 700, letterSpacing: 1 }}>Projects</h4>
        <Link to="/manager/projects/new" style={{ textDecoration: "none" }}><Button>+ New Project</Button></Link>
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
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Name</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Status</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Start</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>End</th>
                    <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProjects.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">No projects found.</td>
                    </tr>
                  )}
                  {paginatedProjects.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.status}</td>
                      <td>{p.startDate}</td>
                      <td>{p.endDate}</td>
                      <td>
                      <Link to={`/manager/projects/${p.id}`} className="btn btn-sm btn-outline-primary me-2" style={{ fontWeight: 600, borderRadius: 8, borderColor: "var(--primary-color)" }}>Detail</Link>
                        <Link to={`/manager/projects/${p.id}/edit`} className="btn btn-sm btn-outline-secondary" style={{ fontWeight: 600, borderRadius: 8 }}>Edit</Link>

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
                    <Button onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item${currentPage === i + 1 ? ' active' : ''}`}>
                      <Button onClick={() => handlePageChange(i + 1)}>{i + 1}</Button>
                    </li>
                  ))}
                  <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                    <Button onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
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
