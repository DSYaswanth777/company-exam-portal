import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
// import { DEV_AUTH_BYPASS_VAL } from "./api";

// const DEV_AUTH_BYPASS = false; // Force real API connection

const studentApi = axios.create({
  baseURL: `${API_BASE_URL}/api/student`,
  headers: {
    "Content-Type": "application/json",
  },
});

studentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("student_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["X-Student-Token"] = token;
      // Add token as a query parameter for all requests
      config.params = {
        ...config.params,
        token: token,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

studentApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (DEV_AUTH_BYPASS) {
        console.warn("Auth bypass enabled: Ignoring 401 error");
        return Promise.resolve(error.response);
      }
      localStorage.removeItem("student_access_token");
      localStorage.removeItem("student_data");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default studentApi;
