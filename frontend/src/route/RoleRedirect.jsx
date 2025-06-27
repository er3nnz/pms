import { useAuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RoleRedirect() {
  const { user } = useAuthContext();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role?.includes("ROLE_MANAGER")) return <Navigate to="/manager/dashboard" replace />;
  if (user.role?.includes("ROLE_EMPLOYEE")) return <Navigate to="/employee/dashboard" replace />;
  return <Navigate to="/login" replace />;
}