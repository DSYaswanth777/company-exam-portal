import axios from "axios";
import { DEV_AUTH_BYPASS } from "./api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const studentApi = axios.create({
  baseURL: `${API_BASE_URL}/api/student`,
  headers: {
    "Content-Type": "application/json",
  },
});

studentApi.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("cxp_student_auth");
    if (auth) {
      try {
        const { access_token } = JSON.parse(auth);
        if (access_token) {
          config.headers.Authorization = `Bearer ${access_token}`;
          config.headers["X-Student-Token"] = access_token;
          // Add token as a query parameter for all requests
          config.params = {
            ...config.params,
            token: access_token,
          };
        }
      } catch (e) {
        console.error("Failed to parse student auth", e);
      }
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
      if (typeof DEV_AUTH_BYPASS !== 'undefined' && DEV_AUTH_BYPASS) {
        console.warn("Auth bypass enabled: Ignoring 401 error");
        return Promise.resolve(error.response);
      }
      localStorage.removeItem("cxp_student_auth");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      // Disqualified or Forbidden
      if (!window.location.pathname.includes("/disqualified")) {
        window.location.href = "/disqualified";
      }
    }
    return Promise.reject(error);
  },
);

export default studentApi;
