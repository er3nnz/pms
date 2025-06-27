import api from "./client/apiClient";

const createProject = (project) => {
  return api.post("/projects", project);
};

const updateProject = (id, project) => {
  return api.put(`/projects/${id}`, project);
};

const getProjectById = (id) => {
  return api.get(`/projects/${id}`);
};

const getAllProjects = () => {
  return api.get("/projects");
};

const deleteProject = (id) => {
  return api.delete(`/projects/${id}`);
};

const updateProjectStatus = (id, status) => {
  return api.put(`/projects/${id}/status`, { status });
};

export default {
  createProject,
  updateProject,
  getProjectById,
  getAllProjects,
  deleteProject,
  updateProjectStatus,
};
