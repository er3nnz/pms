import api from "./client/apiClient";

const getCurrentUser = () => {
  return api.get("/users/me");
};

const updateUserProfile = (profileData) => {
  return api.put("/users/me", profileData);
};

const updateEmail = (emailData) => {
  return api.put("/users/me/email", emailData);
};

const updatePassword = (passwordData) => {
  return api.put("/users/me/password", passwordData);
};

const getAllUsers = () => {
  return api.get("/users");
};

const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

const updateUserById = (id, userData) => {
  return api.put(`/users/${id}`, userData);
};

const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};

export default {
  getCurrentUser,
  updateUserProfile,
  updateEmail,
  updatePassword,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
};
