import { useEffect, useState } from "react";
import projectService from "../../services/ProjectService";
import userService from "../../services/UserService";
import assignmentService from "../../services/ProjectAssignmentService";

export default function Assignments() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    projectService.getAllProjects().then(res => setProjects(res.data));
    userService.getAllUsers().then(res => setEmployees(res.data));
  }, []);

  useEffect(() => {
    if (selectedProject) {
      assignmentService.listEmployeesByProject(selectedProject)
        .then(res => setAssignments(res.data));
    } else {
      setAssignments([]);
    }
  }, [selectedProject]);

  const handleAssign = (e) => {
    e.preventDefault();
    setMessage("");
    if (!selectedProject || !selectedEmployee) return;
    if(selectedProject === "") {
      setMessage("Please select a project to assign employees.");
      return;
    }
    if(selectedEmployee === "") {
      setMessage("Please select an employee to assign.");
      return;
    }
    assignmentService.assignEmployeeToProject(Number(selectedProject), Number(selectedEmployee))
      .then(() => {
        setMessage("Employee assigned successfully!");
        assignmentService.listEmployeesByProject(selectedProject)
          .then(res => setAssignments(res.data));
      })
      .catch(() => setMessage("Assignment failed!"));
  };

  const handleUnassign = (assignmentId) => {
    assignmentService.unassignEmployee(assignmentId)
      .then(() => {
        setMessage("Assignment removed!");
        assignmentService.listEmployeesByProject(selectedProject)
          .then(res => setAssignments(res.data));
      });
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4" style={{ color: "var(--primary-color)", fontWeight: 700 }}>Project Assignments</h4>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <form className="row g-3 align-items-end" onSubmit={handleAssign}>
            <div className="col-md-5">
              <label className="form-label" style={{ color: "var(--primary-color)", fontWeight: 600 }}>Select Project</label>
              <select
                className="form-select"
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
                required
              >
                <option value="">Select a project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <label className="form-label" style={{ color: "var(--primary-color)", fontWeight: 600 }}>Select Employee</label>
              <select
                className="form-select"
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value)}
                required
              >
                <option value="">Select an employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.username})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100" style={{ fontWeight: 600, borderRadius: 8 }}>Assign</button>
            </div>
          </form>
        </div>
      </div>

      {selectedProject && (
        <div className="card shadow-sm">
          <div className="card-header bg-white" style={{ color: "var(--primary-color)", fontWeight: 700 }}>
            Assigned Employees
          </div>
          <div className="card-body p-0">
            <table className="table table-bordered table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Employee</th>
                  <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Assigned Date</th>
                  <th style={{ color: "var(--primary-color)", fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-muted">No assignments yet.</td>
                  </tr>
                )}
                {assignments.map(a => (
                  <tr key={a.assignmentId}>
                    <td>{a.employeeName}</td>
                    <td>{a.assignedDate}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        style={{ fontWeight: 600, borderRadius: 8 }}
                        onClick={() => handleUnassign(a.assignmentId)}
                      >
                        Unassign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
