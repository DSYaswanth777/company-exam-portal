import studentApi from "../utils/studentApi";

const studentService = {
  // Authentication
  login: (email, access_token) =>
    studentApi.post("/auth/login", { email, access_token }),

  // Drive & Exam Info
  getDriveInfo: () => studentApi.get("/drive-info"),
  getExamDetails: () => studentApi.get("/exam/details"),
  startExam: () => studentApi.post("/exam/start"),
  getQuestions: () => studentApi.get("/exam/questions"),

  // Proctored Actions
  recordViolation: (reason) =>
    studentApi.post("/exam/violation", { disqualification_reason: reason }),

  // Submission
  submitExam: (answers) => studentApi.post("/exam/submit", { answers }),

  // Results
  getResults: () => studentApi.get("/exam/result"),

  // Validation
  validateToken: (token) =>
    studentApi.get("/auth/validate", { params: { token } }),
};

export default studentService;
