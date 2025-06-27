import api from "./client/apiClient";

const getAuditLogs = () => {
  return api.get("/audit/logs");
};

export default {
  getAuditLogs,
}; 