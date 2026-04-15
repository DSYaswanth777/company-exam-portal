import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({ children, allowedTypes = [] }) {
  const { user } = useAuth();

  // Special check for student path if allowedTypes includes 'student'
  const studentAuthRoot = localStorage.getItem("cxp_student_auth");
  const studentUser = studentAuthRoot ? JSON.parse(studentAuthRoot) : null;

  // If student is allowed and student is logged in, allow
  if (allowedTypes.includes("student") && studentUser?.access_token) {
    return children;
  }

  // Redirection logic for unauthenticated users
  if (!user?.token && !studentUser?.access_token) {
    if (allowedTypes.includes("student")) {
      return <Navigate to="/student/login" replace />;
    }
    if (allowedTypes.includes("admin")) {
      return <Navigate to="/admin/login" replace />;
    }
    if (allowedTypes.includes("company")) {
      return <Navigate to="/company/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Type check
  if (allowedTypes.length > 0) {
    const isStudent =
      allowedTypes.includes("student") && studentUser?.access_token;
    const isCompanyOrAdmin = allowedTypes.includes(user?.userType);

    if (!isStudent && !isCompanyOrAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
