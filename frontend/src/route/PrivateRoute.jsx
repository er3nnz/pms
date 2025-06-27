import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some((role) => user.role?.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
