import api from "./client/apiClient";

const login = (credential, password) => {
  return api.post("/auth/login", { credential, password });
};

const register = (
  username,
  password,
  email,
  firstName,
  lastName,
  position,
  roles
) => {
  return api.post("/auth/register", {
    username,
    password,
    email,
    firstName,
    lastName,
    position,
    roles,
  });
};

const logout = () => {
  return api.post("/auth/logout");
};

export default {
  login,
  register,
  logout,
};
