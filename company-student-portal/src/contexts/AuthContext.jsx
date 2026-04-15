import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import studentService from "../services/studentService";
import api from "../lib/api";
import { DEV_AUTH_BYPASS } from "../utils/api";

function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Generic for Company/Admin
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Refers to student auth
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Initial State for Company/Admin
    const storedAuth = localStorage.getItem('cxp_auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        const claims = parsed?.token ? decodeJwt(parsed.token) : null;
        if (claims && claims.exp) {
          const now = Math.floor(Date.now() / 1000);
          if (claims.exp < now) {
            localStorage.removeItem('cxp_auth');
          } else {
            setUser({ ...parsed, claims });
          }
        }
      } catch (e) {
        localStorage.removeItem('cxp_auth');
      }
    }

    // 2. Initial State for Student
    if (DEV_AUTH_BYPASS) {
      const mockStudent = {
        name: "Test Student",
        email: "student@example.com",
        access_token: "mock-token",
      };
      setStudent(mockStudent);
      setIsAuthenticated(true);
      // Also store for studentApi interceptor
      localStorage.setItem("cxp_student_auth", JSON.stringify(mockStudent));
    } else {
      const storedStudentAuth = localStorage.getItem("cxp_student_auth");
      if (storedStudentAuth) {
        try {
          const parsed = JSON.parse(storedStudentAuth);
          setStudent(parsed);
          setIsAuthenticated(true);
        } catch (e) {
          localStorage.removeItem("cxp_student_auth");
        }
      }
    }
    
    setLoading(false);
  }, []);

  // Student Login
  const studentLogin = async (email, access_token) => {
    try {
      const response = await studentService.login(email, access_token);
      const studentData = response.data;
      localStorage.removeItem("exam_answers");
      localStorage.setItem("cxp_student_auth", JSON.stringify(studentData));
      setStudent(studentData);
      setIsAuthenticated(true);
      return { success: true, data: studentData };
    } catch (error) {
      console.error("Student Login error:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Invalid email or access token",
      };
    }
  };

  // Company/Admin Login
  const login = (token, userType) => {
    const payload = { token, userType };
    const claims = decodeJwt(token);
    localStorage.setItem('cxp_auth', JSON.stringify(payload));
    setUser({ ...payload, claims });
  };

  const logout = () => {
    // Determine which one to logout or just both?
    // Usually, logout is specific to the current contextual session
    localStorage.removeItem('cxp_auth');
    localStorage.removeItem('cxp_student_auth');
    localStorage.removeItem('exam_answers');
    setUser(null);
    setStudent(null);
    setIsAuthenticated(false);
    toast('Logged out');
    navigate('/');
  };

  const validateToken = async () => {
    try {
      const auth = localStorage.getItem("cxp_student_auth");
      if (!auth) return { valid: false };
      const token = JSON.parse(auth).access_token;

      const response = await studentService.validateToken(token);
      if (response.data.is_disqualified) {
        return {
          valid: false,
          disqualified: true,
          reason: response.data.disqualification_reason,
        };
      }
      return { valid: true };
    } catch (error) {
      console.error("Token validation error:", error);
      return { valid: false };
    }
  };

  const refreshStudentData = async () => {
    try {
      const auth = localStorage.getItem("cxp_student_auth");
      if (!auth) return false;
      const studentData = JSON.parse(auth);

      const response = await studentService.login(studentData.email, studentData.access_token);
      const freshData = response.data;
      localStorage.setItem("cxp_student_auth", JSON.stringify(freshData));
      setStudent(freshData);
      return true;
    } catch (error) {
      console.error("Error refreshing student data:", error);
      return false;
    }
  };

  const value = {
    user, // Company/Admin
    student,
    loading,
    isAuthenticated,
    studentLogin,
    login,
    logout,
    validateToken,
    refreshStudentData,
    api // Expose the api instance from lib
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
