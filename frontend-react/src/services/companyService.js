import companyApi from "../lib/companyApi";
import api from "../lib/api";

/**
 * Company Service - Centralized API calls for Company Portal
 */
const companyService = {
  // Authentication
  login: (username, password) =>
    api.post("/auth/company/login", { username, password }),
  register: (data) =>
    api.post("/auth/company/register", data, {
      headers: {
        "Content-Type":
          data instanceof FormData ? "multipart/form-data" : "application/json",
      },
    }),

  // Dashboard & Profile
  getStats: () => companyApi.get("/stats"),
  getProfile: () => companyApi.get("/profile"),

  /**
   * Aggregates stats from available drives since /stats might be unreliable
   */
  getAggregatedStats: async () => {
    try {
      const res = await companyService.getMyDrives();
      const drives = res.data || [];

      return {
        data: {
          total_drives: drives.length,
          total_students: drives.reduce(
            (acc, d) => acc + (d.student_count || 0),
            0,
          ),
          active_drives: drives.filter((d) => d.status === "live").length,
        },
      };
    } catch (err) {
      console.error("Failed to aggregate company stats:", err);
      throw err;
    }
  },

  // Drive Management
  getMyDrives: () => companyApi.get("/drives"),
  getDriveDetail: (id) => companyApi.get(`/drives/${id}`),
  getColleges: () => companyApi.get("/colleges"),
  getGroups: () => companyApi.get("/student-groups"),
  createDrive: (data) => companyApi.post("/drives", data),
  updateDrive: (id, data) => companyApi.put(`/drives/${id}`, data),
  updateDriveStatus: (id, status) =>
    companyApi.put(`/drives/${id}/status`, { status }),
  submitDrive: (id) => companyApi.put(`/drives/${id}/submit`),
  startExam: (id) => companyApi.post(`/drives/${id}/start`),
  endExam: (id) => companyApi.post(`/drives/${id}/end`),
  getDriveExamStatus: (id) => companyApi.get(`/drives/${id}/exam-status`),
  getDriveQuestions: (id) => companyApi.get(`/drives/${id}/questions`),
  getDriveStudents: (id) => companyApi.get(`/drives/${id}/students`),
  uploadQuestions: (id, formData) =>
    companyApi.post(`/drives/${id}/upload-questions`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  uploadStudents: (id, formData) =>
    companyApi.post(`/drives/${id}/upload-students`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getResults: (id, params) =>
    companyApi.get(`/drives/${id}/results`, { params }),
  exportResults: (id, params) =>
    companyApi.get(`/drives/${id}/results/export`, {
      params,
      responseType: "blob",
    }),

  // Email Communications
  getDriveEmailStatus: (id) => companyApi.get(`/drives/${id}/email-status`),
  getEmailTemplate: () => companyApi.get("/email-template"),
  updateEmailTemplate: (data) => companyApi.put("/email-template", data),
  getDriveEmailProgress: (id) => companyApi.get(`/drives/${id}/email-progress`),
  verifyProgress: (progressId) =>
    companyApi.get(`/broadcasts/progress/${progressId}`),

  // Search
  search: (query) => companyApi.get(`/search?q=${query}`),
  sendEmails: (id) => companyApi.post(`/drives/${id}/email-students`),

  // Support Tickets
  getTickets: () => companyApi.get("tickets/my-tickets"),
  raiseTicket: (data) => companyApi.post("tickets/raise", data),
  createTicket: (data) => companyApi.post("tickets/raise", data),

  // Questions Management (keeping legacy name if used)
  uploadQuestionsCSV: (id, formData) =>
    companyApi.post(`/drives/${id}/questions/csv-upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Student Management (keeping legacy name if used)
  uploadStudentsCSV: (id, formData) =>
    companyApi.post(`/drives/${id}/students/csv-upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  duplicateDrive: (id) => companyApi.post(`/drives/${id}/duplicate`),
};

export default companyService;
