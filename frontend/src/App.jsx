import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import PrivateRoute from "./route/PrivateRoute";
import RoleRedirect from "./route/RoleRedirect";
import ManagerLayout from "./layouts/ManagerLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import Projects from "./pages/manager/Projects";
import ProjectCreate from "./pages/manager/ProjectCreate";
import ProjectDetail from "./pages/manager/ProjectDetail";
import ProjectEdit from "./pages/manager/ProjectEdit";
import Assignments from "./pages/manager/Assignments";
import Users from "./pages/manager/Users";
import UserDetail from "./pages/manager/UserDetail";
import AuditLogs from "./pages/manager/AuditLogs";
import Profile from "./pages/manager/Profile";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyProjects from "./pages/employee/MyProjects";
import EmployeeProjectDetail from "./pages/employee/ProjectDetail";
import EmployeeProfile from "./pages/employee/Profile";
import UserEdit from "./pages/manager/UserEdit";

const NotFound = () => <div>404 - Sayfa Bulunamadı</div>;

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <RoleRedirect />
              </PrivateRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <PrivateRoute allowedRoles={["ROLE_MANAGER"]}>
                <ManagerLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<ProjectCreate />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="projects/:id/edit" element={<ProjectEdit />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="users/:id/edit" element={<UserEdit/>}/>
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route
            path="/employee"
            element={
              <PrivateRoute allowedRoles={["ROLE_EMPLOYEE"]}>
                <EmployeeLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="projects" element={<MyProjects />} />
            <Route path="projects/:id" element={<EmployeeProjectDetail />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
