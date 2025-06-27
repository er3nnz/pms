import api from "./client/apiClient";

const assignEmployeeToProject = (projectId, employeeId) => {
  return api.post(`/projects/${projectId}/assign`, { employeeId });
};

const listEmployeesByProject = (projectId) => {
  return api.get(`/projects/${projectId}/employees`);
};

const listMyProjects = () => {
  return api.get("/projects/my");
};

const updateAssignment = (assignmentId, updateData) => {
  return api.put(`/projects/assignments/${assignmentId}`, updateData);
};

const unassignEmployee = (assignmentId) => {
  return api.delete(`/projects/assignments/${assignmentId}`);
};

export default {
  assignEmployeeToProject,
  listEmployeesByProject,
  listMyProjects,
  updateAssignment,
  unassignEmployee,
};
