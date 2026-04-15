import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({ children, allowedTypes = [] }) {
  const { user, student } = useAuth();

  // If student is allowed and student is logged in, allow
  if (allowedTypes.includes("student") && student?.access_token) {
    return children;
  }

  // If company is allowed and user (company) is logged in, allow
  if (allowedTypes.includes("company") && user?.token && user.userType === 'company') {
    return children;
  }

  // Redirection logic for unauthenticated users
  if (!user?.token && !student?.access_token) {
    if (allowedTypes.includes("student")) {
      return <Navigate to="/login" replace />;
    }
    if (allowedTypes.includes("company")) {
      return <Navigate to="/company/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Type check if already logged in but not the right type
  if (allowedTypes.length > 0) {
    const isStudent = allowedTypes.includes("student") && student?.access_token;
    const isCompany = allowedTypes.includes("company") && user?.token && user.userType === 'company';

    if (!isStudent && !isCompany) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
