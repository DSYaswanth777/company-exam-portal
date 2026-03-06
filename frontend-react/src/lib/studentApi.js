import axios from "axios";

// Base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create axios instance for student-specific API calls
const studentApi = axios.create({
  baseURL: `${API_BASE_URL}/api/student`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
studentApi.interceptors.request.use(
  (config) => {
    // Student uses a different auth key to avoid conflict with admin/company
    const studentAuth = localStorage.getItem("cxp_student_auth");
    if (studentAuth) {
      try {
        const parsed = JSON.parse(studentAuth);
        if (parsed.access_token) {
          // Student API expects token in Header or as a dependency
          // Based on backend, it's often a Bearer token or a custom header
          config.headers.Authorization = `Bearer ${parsed.access_token}`;
          // Also set as custom header just in case (some endpoints might use it)
          config.headers["X-Student-Token"] = parsed.access_token;
        }
      } catch (e) {
        console.error("Failed to parse student auth data:", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
studentApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("cxp_student_auth");
      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/student/login")) {
        window.location.href = "/student/login";
      }
    }
    return Promise.reject(error);
  },
);

export default studentApi;
