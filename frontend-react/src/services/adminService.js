import api from "../lib/api";

/**
 * Admin Service - Centralized API calls for Admin Portal
 */
const adminService = {
  // Authentication
  login: (username, password) =>
    api.post("/auth/admin/login", { username, password }),

  // Stats and Activity
  getStats: () => api.get("/admin/stats"),
  getActivity: () => api.get("/admin/activity"),

  // Company Management
  getCompanies: (filter = "") =>
    api.get(`/admin/companies?status_filter=${filter}&limit=500`),
  approveCompany: (id, notes = "Approved by admin") =>
    api.put(`/admin/companies/${id}/approve`, { is_approved: true, notes }),
  rejectCompany: (id, reason = "Rejected by admin") =>
    api.put(`/admin/companies/${id}/reject`, { reason }),
  suspendCompany: (id, notes = "Suspended by admin") =>
    api.put(`/admin/companies/${id}/approve`, { is_approved: false, notes }),

  // Student Management
  getAllStudents: () => api.get("/admin/students/all"),

  // Drive Management
  getDrives: (filter = "") =>
    api.get(`/admin/drives?status_filter=${filter}&limit=500`),
  getDriveDetail: (id) => api.get(`/admin/drives/${id}/detail`),
  approveDrive: (id, notes = "Approved by admin") =>
    api.put(`/admin/drives/${id}/approve`, {
      is_approved: true,
      admin_notes: notes,
    }),
  rejectDrive: (id, notes = "Rejected by admin") =>
    api.put(`/admin/drives/${id}/approve`, {
      is_approved: false,
      admin_notes: notes,
    }),
  suspendDrive: (id, reason = "Suspended by admin") =>
    api.put(`/admin/drives/${id}/suspend`, { reason }),
  getDriveExamStatus: (id) => api.get(`/admin/drives/${id}/exam-status`),

  // College & Student Groups
  getPendingColleges: () => api.get("/admin/colleges/pending"),
  getColleges: () => api.get("/admin/colleges"),
  approveCustomCollege: (data) =>
    api.put("/admin/colleges/approve-custom", data),
  getPendingGroups: () => api.get("/admin/student-groups/pending"),
  getGroups: () => api.get("/admin/student-groups"),
  approveCustomGroup: (data) =>
    api.put("/admin/student-groups/approve-custom", data),

  // Support Tickets
  getTickets: (filter = "") =>
    api.get(`/admin/tickets${filter ? `?status=${filter}` : ""}`),
  updateTicketStatus: (id, data) =>
    api.put(`/admin/tickets/${id}/status`, data),

  // Proxy Company Calls (Admin acting as Company)
  getCompanyDrives: (companyId) =>
    api.get("/company/drives", {
      headers: { "X-Company-ID": companyId },
    }),
  getCompanyDriveStudents: (companyId, driveId) =>
    api.get(`/company/drives/${driveId}/students`, {
      headers: { "X-Company-ID": companyId },
    }),

  // Search
  search: (query) => api.get(`/admin/search?q=${query}`),

  // Custom Aggregated Stats (since /admin/stats is missing)
  getAggregatedStats: async () => {
    // Try to get data from endpoints we know exist
    const results = await Promise.allSettled([
      adminService.getCompanies("all"),
      adminService.getDrives("all"),
      adminService.getTickets("open"),
    ]);

    const companiesRes =
      results[0].status === "fulfilled" ? results[0].value : { data: [] };
    const drivesRes =
      results[1].status === "fulfilled" ? results[1].value : { data: [] };
    const ticketsRes =
      results[2].status === "fulfilled" ? results[2].value : { data: [] };

    const companies = companiesRes.data || [];
    const drives = drivesRes.data || [];
    const tickets = ticketsRes.data || [];

    let totalStudents = 0;
    let activeDrivesCount = 0;
    let ongoingExamsCount = 0;

    try {
      // Get real-time status for all approved drives to accurately count active/ongoing
      const approvedDrives = drives.filter((d) => d.is_approved);

      const examStatusPromises = approvedDrives.map((d) =>
        adminService.getDriveExamStatus(d.id).catch(() => null),
      );

      const statuses = await Promise.all(examStatusPromises);

      statuses.forEach((s) => {
        if (s?.data) {
          const status = s.data;
          totalStudents += status.student_count || 0;

          // An exam is "ongoing" only if state is "ongoing" or "live"
          if (["ongoing", "live"].includes(status.exam_state)) {
            ongoingExamsCount++;
          }

          // A drive is "active" if it's approved and hasn't ended/completed
          if (!["ended", "completed", "expired"].includes(status.exam_state)) {
            activeDrivesCount++;
          }
        }
      });
    } catch (e) {
      console.warn("Failed to aggregate student/exam counts from drives", e);
    }

    return {
      data: {
        companies: {
          total: companies.length,
          active: companies.filter((c) => c.status === "approved").length,
          pending: companies.filter((c) => c.status === "pending").length,
        },
        drives: {
          total: drives.length,
          active: activeDrivesCount,
          ongoing: ongoingExamsCount,
          pending: drives.filter(
            (d) => d.status === "submitted" || d.status === "pending",
          ).length,
        },
        students: {
          total: totalStudents,
        },
        tickets: {
          open: tickets.length,
        },
      },
    };
  },

  getAllStudentsAggregated: async () => {
    try {
      const drivesRes = await adminService.getDrives("all");
      const drives = drivesRes.data || [];

      // Get detail for all drives to get student lists
      const driveDetailPromises = drives.map((d) =>
        adminService.getDriveDetail(d.id).catch(() => null),
      );
      const driveDetails = await Promise.all(driveDetailPromises);

      const allStudents = [];
      const seenEmails = new Set();

      driveDetails.forEach((detail) => {
        if (detail?.data?.students) {
          detail.data.students.forEach((s) => {
            if (!seenEmails.has(s.email)) {
              seenEmails.add(s.email);
              allStudents.push({
                id: s.id,
                name: s.name,
                email: s.email,
                university: s.college_name || "N/A",
                status: "verified", // Default to verified if in a drive students list
                performance: "N/A", // Placeholder
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`,
              });
            }
          });
        }
      });

      return { data: allStudents };
    } catch (error) {
      console.error("Failed to aggregate students", error);
      throw error;
    }
  },
};

export default adminService;
