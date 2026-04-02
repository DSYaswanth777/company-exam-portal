import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import adminService from "../services/adminService";
import { getErrorMessage } from "../utils/errorHelpers";
import AdminColleges from "./AdminColleges";
import ActionModal from "../components/ActionModal";
import ResolutionModal from "../components/ResolutionModal";
import { formatDateIST, formatDateLocal, formatDate } from "../utils/timezone";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AdminNotifications from "./AdminNotifications";
import AdminDirectMessaging from "./AdminDirectMessaging";
import {
  Building2,
  Rocket,
  Clock,
  Users,
  TrendingUp,
  MoreHorizontal,
  Timer,
  Search,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Check,
  History,
  ExternalLink,
  Shield,
  Filter,
  MoveRight,
  X,
  Loader2,
  Eye,
  Ban,
  Settings,
} from "lucide-react";
import { TbTargetArrow } from "react-icons/tb";
import { IoIosFlash } from "react-icons/io";
import maintainenceNotice from "/icons/maintainenceNotice.png"
import featureRelease from "/icons/featureRelease.png"
import platformImprovement from "/icons/platformImprovement.png"


export default function AdminDashboard() {
  const { logout } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminActiveTab") || "overview",
  );

  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  // ============= COMPANIES TAB STATES =============
  const [companiesList, setCompaniesList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [companySearch, setCompanySearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modals for companies tab
  const [drivesModal, setDrivesModal] = useState({
    open: false,
    companyId: null,
    companyName: "",
  });
  const [studentsModal, setStudentsModal] = useState({
    open: false,
    driveId: null,
    driveTitle: "",
  });
  const [driveStudentsList, setDriveStudentsList] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [drivesList, setDrivesList] = useState([]);

  // ============= DRIVES TAB STATES =============
  const [allDrivesList, setAllDrivesList] = useState([]);
  const [driveStatusFilter, setDriveStatusFilter] = useState("all");
  const [driveSearch, setDriveSearch] = useState("");
  const [drivesLoading, setDrivesLoading] = useState(false);
  const [driveDetailModal, setDriveDetailModal] = useState({
    open: false,
    data: null,
  });
  const [driveDetailData, setDriveDetailData] = useState(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [dataManagementTab, setDataManagementTab] = useState("groups"); // 'colleges' or 'groups'
  const [examStatuses, setExamStatuses] = useState({}); // Track exam status for each drive
  const [clientTimeRemaining, setClientTimeRemaining] = useState({}); // Client-side countdown

  // ============= STUDENTS TAB STATES =============
  const [allStudentsList, setAllStudentsList] = useState([]);
  const [studentStatusFilter, setStudentStatusFilter] = useState("all");
  const [studentsSearch, setStudentsSearch] = useState("");
  const [studentsLoading, setStudentsLoading] = useState(false);

  // ============= ONGOING EXAMS STATES =============
  const [ongoingExamsList, setOngoingExamsList] = useState([]);
  const [activeCompaniesList, setActiveCompaniesList] = useState([]);
  const [ongoingLoading, setOngoingLoading] = useState(false);
  const [ongoingSearch, setOngoingSearch] = useState("");

  // ============= TICKETS TAB STATES =============
  const [ticketsList, setTicketsList] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsSearch, setTicketsSearch] = useState("");

  // ============= OVERVIEW TAB STATES =============
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // ============= ACTIVITY STATE =============
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  // Real-time countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setClientTimeRemaining((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((driveId) => {
          if (updated[driveId] > 0) {
            updated[driveId] = updated[driveId] - 1;
          }
        });
        return updated;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Modal states for drive actions
  const [approvalModal, setApprovalModal] = useState({
    open: false,
    driveId: null,
    action: null, // 'approve', 'reject', 'suspend'
  });
  const [approvalNotes, setApprovalNotes] = useState("");

  // Action modal state for companies
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: "approve", // 'approve', 'reject', 'suspend', 'revoke'
    company: null,
  });
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [resolutionModal, setResolutionModal] = useState({
    isOpen: false,
    ticketId: null,
  });
  const [planModal, setPlanModal] = useState({
    isOpen: false,
    company: null,
    currentPlan: "free",
    drivesLimit: null,
  });

  // ============= COMPANIES TAB EFFECTS =============
  useEffect(() => {
    if (activeTab === "overview") {
      loadDashboardStats();
      loadRecentActivity();
    }
    if (activeTab === "companies" || activeTab === "active_companies") {
      loadCompanies();
    }
  }, [statusFilter, activeTab]);

  const loadRecentActivity = async () => {
    setActivityLoading(true);
    try {
      // Mock data since API is not implemented
      const dummyActivity = [
        {
          id: 1,
          type: "Company Registered",
          entity: "TCS iON",
          status: "pending",
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          type: "Drive Created",
          entity: "Software Engineer Prep",
          status: "submitted",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 3,
          type: "Ticket Raised",
          entity: "Login issues in portal",
          status: "NEW",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 4,
          type: "Drive Approved",
          entity: "Data Science Internship",
          status: "approved",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setRecentActivity(dummyActivity);
    } catch (err) {
      console.error("Failed to load activity", err);
    } finally {
      setActivityLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    setStatsLoading(true);
    try {
      const res = await adminService.getAggregatedStats();
      setDashboardStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
      setDashboardStats({
        companies: { total: 0, pending: 0 },
        drives: { total: 0, pending: 0 },
        students: { total: 0 },
        tickets: { open: 0 },
      });
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "colleges") {
      // AdminColleges handles its own data loading for now
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "students") {
      loadAllStudents();
    }
  }, [activeTab, studentStatusFilter]);

  const loadAllStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await adminService
        .getAllStudentsAggregated()
        .catch(() => null);
      if (res) {
        setAllStudentsList(res.data);
      } else {
        setAllStudentsList([]);
      }
    } catch (err) {
      console.error("Failed to load students", err);
      setAllStudentsList([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ongoing_exams") {
      loadOngoingExams();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "tickets") {
      loadTickets();
    }
  }, [activeTab]);

  const loadOngoingExams = async () => {
    setOngoingLoading(true);
    try {
      // First ensure we have all drives and statuses
      const drivesRes = await adminService.getDrives("all");
      const drivesData = drivesRes.data || [];
      setAllDrivesList(drivesData);

      // Fetch statuses for approved drives
      const activeDrives = drivesData.filter(
        (d) => d.is_approved && !["rejected", "suspended"].includes(d.status),
      );

      const statusPromises = activeDrives.map(async (drive) => {
        try {
          const statusRes = await adminService.getDriveExamStatus(drive.id);
          return { driveId: drive.id, status: statusRes.data };
        } catch (error) {
          return { driveId: drive.id, status: null };
        }
      });

      const statuses = await Promise.all(statusPromises);
      const statusMap = {};
      const timeMap = {};

      statuses.forEach(({ driveId, status }) => {
        statusMap[driveId] = status;
        if (status && status.time_remaining) {
          timeMap[driveId] = status.time_remaining;
        }
      });

      setExamStatuses(statusMap);
      setClientTimeRemaining(timeMap);

      // Now filter for ongoing
      const ongoing = drivesData.filter(
        (d) =>
          statusMap[d.id]?.exam_state === "ongoing" ||
          statusMap[d.id]?.exam_state === "live",
      );
      setOngoingExamsList(ongoing);
    } catch (err) {
      console.error("Failed to load ongoing exams", err);
      toast.error("Failed to refresh live monitoring");
    } finally {
      setOngoingLoading(false);
    }
  };

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      const res = await adminService.getTickets();
      setTicketsList(res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      await adminService.updateTicketStatus(ticketId, { status: newStatus });
      toast.success(`Ticket marked as ${newStatus.toLowerCase()}`);
      await loadTickets();
      // If we are in detail view, update the selected ticket
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleConfirmResolution = async (notes) => {
    const ticketId = resolutionModal.ticketId;
    if (!ticketId) return;

    setIsActionLoading(true);
    try {
      await adminService.updateTicketStatus(ticketId, {
        status: "resolved",
        resolution_notes: notes,
      });
      toast.success("Ticket resolved successfully");
      setResolutionModal({ isOpen: false, ticketId: null });
      await loadTickets();
      // If we are in detail view, update the selected ticket
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket((prev) => ({
          ...prev,
          status: "resolved",
          resolution_notes: notes,
        }));
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  // ============= DRIVES TAB EFFECTS =============
  useEffect(() => {
    if (
      activeTab === "active_drives" ||
      activeTab === "ongoing_exams" ||
      activeTab === "drive_approvals" ||
      activeTab === "active_companies"
    ) {
      loadAllDrives();
      loadExamStatuses();
    }
  }, [driveStatusFilter, activeTab]);

  // Polling for active drives in drives tab
  useEffect(() => {
    if (activeTab !== "active_drives" && activeTab !== "ongoing_exams") {
      return; // Only poll when on drives monitor tabs
    }

    // Check if there are any active drives before setting up polling
    const hasActiveDrives = allDrivesList.some((d) =>
      ["live", "ongoing", "upcoming", "approved", "submitted"].includes(
        d.status,
      ),
    );

    if (!hasActiveDrives) {
      return; // Don't set up polling if no active drives
    }

    // Refresh exam statuses every 30 seconds for active drives
    const interval = setInterval(() => {
      loadExamStatuses();
    }, 30000);

    return () => clearInterval(interval);
  }, [allDrivesList, activeTab]); // Re-evaluate when drives or tab changes

  const handleConfirmPlan = async () => {
    if (!planModal.company) return;
    setIsActionLoading(true);
    try {
      await adminService.setCompanyPlan(planModal.company.id, {
        plan: planModal.currentPlan,
        drives_limit: planModal.drivesLimit,
      });
      toast.success(`Plan updated to ${planModal.currentPlan}`);
      setPlanModal({ ...planModal, isOpen: false, company: null });
      await loadCompanies();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  const openPlanModal = (company) => {
    setPlanModal({
      isOpen: true,
      company,
      currentPlan: company.plan || "free",
      drivesLimit: company.drives_limit || null,
    });
  };

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const filter =
        activeTab === "active_companies" ? "approved" : statusFilter;
      const res = await adminService.getCompanies(filter);
      setCompaniesList(res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const approveCompany = (company) => {
    setActionModal({
      isOpen: true,
      type: "approve",
      company,
    });
  };

  const rejectCompany = (company) => {
    setActionModal({
      isOpen: true,
      type: "reject",
      company,
    });
  };

  const suspendCompany = (company) => {
    setActionModal({
      isOpen: true,
      type: "suspend",
      company,
    });
  };

  const handleConfirmAction = async () => {
    const { type, company } = actionModal;
    if (!company) return;

    setIsActionLoading(true);
    try {
      if (type === "approve") {
        await adminService.approveCompany(company.id);
        toast.success("Company approved successfully");
      } else if (type === "reject") {
        await adminService.rejectCompany(company.id);
        toast.success("Company rejected successfully");
      } else if (type === "suspend" || type === "revoke") {
        await adminService.suspendCompany(company.id);
        toast.success("Company suspended");
      } else if (type === "unsuspend") {
        await adminService.unsuspendCompany(company.id);
        toast.success("Company unsuspended successfully");
      }
      await loadCompanies();
      setActionModal({ isOpen: false, type: "approve", company: null });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  const unsuspendCompany = (company) => {
    setActionModal({
      isOpen: true,
      type: "unsuspend",
      company,
    });
  };

  const viewCompanyDrives = async (companyId, companyName) => {
    try {
      const res = await adminService.getCompanyDrives(companyId);
      setDrivesList(res.data || []);
      setDrivesModal({ open: true, companyId, companyName });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const viewDriveStudents = async (companyId, driveId, driveTitle) => {
    try {
      const res = await adminService.getCompanyDriveStudents(
        companyId,
        driveId,
      );
      setDriveStudentsList(res.data || []);
      setStudentsModal({ open: true, driveId, driveTitle });
      setStudentSearch("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // ============= DRIVES TAB FUNCTIONS =============
  const loadAllDrives = async () => {
    setDrivesLoading(true);
    try {
      const res = await adminService.getDrives(driveStatusFilter);
      setAllDrivesList(res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDrivesLoading(false);
    }
  };

  const loadExamStatuses = async () => {
    try {
      const res = await adminService.getDrives(driveStatusFilter);
      const drivesData = res.data || [];

      // Only load exam status for approved drives (including completed ones)
      const activeDrives = drivesData.filter(
        (d) => d.is_approved && !["rejected", "suspended"].includes(d.status),
      );

      if (activeDrives.length === 0) {
        return; // Skip if no active drives
      }

      const statusPromises = activeDrives.map(async (drive) => {
        try {
          const statusRes = await adminService.getDriveExamStatus(drive.id);
          return { driveId: drive.id, status: statusRes.data };
        } catch (error) {
          return { driveId: drive.id, status: null };
        }
      });

      const statuses = await Promise.all(statusPromises);
      const statusMap = {};
      const timeMap = {};

      statuses.forEach(({ driveId, status }) => {
        statusMap[driveId] = status;
        // Initialize client-side countdown with server time
        if (status && status.time_remaining) {
          timeMap[driveId] = status.time_remaining;
        }
      });

      setExamStatuses(statusMap);
      setClientTimeRemaining(timeMap);
    } catch (error) {
      console.error("Error loading exam statuses:", error);
    }
  };

  const suspendDrive = async (id, reason = "") => {
    try {
      await adminService.suspendDrive(id, reason);
      toast.success("Drive suspended");
      await loadAllDrives();
      setDriveDetailModal({ ...driveDetailModal, open: false });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const reactivateDrive = async (id) => {
    try {
      await adminService.reactivateDrive(id);
      toast.success("Drive reactivated");
      await loadAllDrives();
      setDriveDetailModal({ ...driveDetailModal, open: false });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const viewDriveDetail = async (driveId) => {
    try {
      const res = await adminService.getDriveDetail(driveId);
      // Backend returns nested structure: {drive, questions, students, stats}
      const detail = res.data;
      const flatData = {
        ...detail.drive,
        questions: detail.questions || [],
        students: detail.students || [],
        targets: detail.drive.targets || [],
        total_points: detail.stats?.total_points || 0,
      };
      setDriveDetailData(flatData);
      setDriveDetailModal({ open: true, data: flatData });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // ============= HELPER FUNCTIONS =============
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      approved: "bg-green-100 text-green-800 border border-green-300",
      rejected: "bg-red-100 text-red-800 border border-red-300",
      suspended: "bg-orange-100 text-orange-800 border border-orange-300",
      submitted: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      draft: "bg-slate-100 text-slate-800 border border-slate-300",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] || styles.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderOverview = () => {
    const stats = [
      {
        label: "Approved Companies",
        value: dashboardStats?.companies?.active || "0",
        change: "+12%",
        icon: Building2,
        color: "text-blue-500",
        bg: "bg-blue-50/50",
        tab: "active_companies",
      },
      {
        label: "Approved Drives",
        value: dashboardStats?.drives?.active || "0",
        change: "+5%",
        icon: Rocket,
        color: "text-orange-500",
        bg: "bg-orange-50/50",
        tab: "active_drives",
      },
      {
        label: "Live Exams",
        value: dashboardStats?.drives?.ongoing || "0",
        change: "+18%",
        icon: Timer,
        color: "text-emerald-500",
        bg: "bg-emerald-50/50",
        tab: "ongoing_exams",
      },
      {
        label: "Registered Students",
        value: dashboardStats?.students?.total || "0",
        change: "+22%",
        icon: Users,
        color: "text-purple-500",
        bg: "bg-purple-50/50",
        tab: "students",
      },
    ];

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header>
          <h2 className="text-[28px] font-[600] text-slate-900 tracking-tight leading-none mb-3">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 text-[18px] font-[300]">
            Welcome back, here is what's happening today.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              onClick={() => stat.tab && setActiveTab(stat.tab)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 group cursor-pointer gap-4 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div
                  className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-[12px] font-bold tracking-tight">
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-[14px] font-[500] text-slate-500 mb-2 leading-none">
                  {stat.label}
                </p>
                <p className="text-[32px] font-bold text-slate-900 tracking-tight leading-none">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Company Tiers & Expiry */}
        <div className="mt-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-[20px] font-bold text-slate-900 tracking-tight">
                Company Status Overview
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Monitor registration tiers and subscription validity.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab("active_companies")}
              className="text-blue-600 font-bold text-[12px] uppercase tracking-wider hover:text-blue-700 transition-colors flex items-center gap-2"
            >
              View All Companies
              <MoveRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {companiesList.slice(0, 3).map((company) => (
              <div key={company.id} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                    {company.logo_url ? (
                      <img src={company.logo_url} alt="" className="h-8 w-8 object-contain" />
                    ) : (
                      <Building2 className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    company.plan === "premium" ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}>
                    {company.plan || "Free"} Tier
                  </div>
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-slate-900 leading-tight">
                    {company.name}
                  </h4>
                  <p className="text-slate-500 text-[12px] mt-1">
                    Registered: {formatDate(company.created_at)}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1">
                      Subscription Expiry
                    </p>
                    <p className="text-[13px] font-semibold text-slate-700">
                      {company.expiry_date ? formatDate(company.expiry_date) : "N/A"}
                    </p>
                  </div>
                  <button 
                    onClick={() => openPlanModal(company)}
                    className="p-2.5 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-100"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {companiesList.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No registered companies found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Cards */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mt-8">
          <div className="flex items-center gap-3 mb-5">
            <IoIosFlash className="text-blue-500 text-xl" />
            <h3 className="text-[16px] font-[600] uppercase tracking-[0.1em] text-slate-700">
              Priority Administrative Actions
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                label: "Target Students",
                icon: TbTargetArrow,
                bg: "bg-blue-50",
                color: "text-blue-600",
                tab: "students",
              },
              {
                label: "Verify Companies",
                icon: ShieldCheck,
                bg: "bg-emerald-50",
                color: "text-emerald-600",
                tab: "companies",
              },
              {
                label: "Drives Monitor",
                icon: Rocket,
                bg: "bg-orange-50",
                color: "text-orange-600",
                tab: "active_drives",
              },
              {
                label: "Total Companies",
                icon: Building2,
                bg: "bg-purple-50",
                color: "text-purple-600",
                tab: "active_companies", // For now, reuse companies
              },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.tab && setActiveTab(action.tab)}
                className="flex items-center justify-between p-5 bg-white border border-slate-200/60 hover:border-slate-300 rounded-xl group transition-all duration-300 shadow-sm active:scale-95"
              >
                <div className="flex items-center gap-4 text-center">
                  <div
                    className={`h-10 w-10 rounded-lg ${action.bg} ${action.color} flex items-center justify-center transition-transform group-hover:scale-110`}
                  >
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[14px] font-[500] text-slate-700 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                    {action.label}
                  </span>
                </div>
                <MoveRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCompanies = () => {
    const filteredCompanies = companiesList.filter(
      (c) =>
        c.company_name?.toLowerCase().includes(companySearch.toLowerCase()) ||
        c.username?.toLowerCase().includes(companySearch.toLowerCase()) ||
        c.email?.toLowerCase().includes(companySearch.toLowerCase()),
    );

    const pendingCount = companiesList.filter(
      (c) => c.status === "pending",
    ).length;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header with Badges */}
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("overview")}
              className="h-12 w-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 font-medium tracking-tight">
                Company Approvals
              </h2>
              <p className="text-slate-400 font- mt-1">
                Review and manage portal access for new company registrations
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-6 shadow-sm">
              <div className="text-center px-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                  Pending
                </p>
                <p className="text-2xl font-semibold text-blue-600">
                  {pendingCount}
                </p>
              </div>
              <div className="h-10 w-[1px] bg-slate-100"></div>
              <div className="text-center px-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                  Total
                </p>
                <p className="text-2xl font-semibold text-blue-600">
                  {companiesList.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Filter by company..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-14 pr-6 text-sm font text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="flex bg-slate-50 p-1.5 rounded-[22px] gap-1">
            {["all", "pending", "approved", "rejected", "suspended"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all ${
                    statusFilter === status
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {status}(
                  {
                    companiesList.filter((c) =>
                      status === "all" ? true : c.status === status,
                    ).length
                  }
                  )
                </button>
              ),
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <div className="animate-spin h-12 w-12 border-[6px] border-blue-600 border-t-transparent rounded-full shadow-lg shadow-blue-200"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-20 text-center shadow-sm">
            <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-medium text-slate-900 tracking-tight">
              No companies found
            </h3>
            <p className="text-slate-400 mt-2">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1e293b] text-white">
                    <th className="px-8 py-5 text-left text-[12px] font-[600] uppercase tracking-widest border-none rounded-tl-sm">
                      COMPANY DETAILS
                    </th>
                    <th className="px-8 py-5 text-left text-[12px] font-[600] uppercase tracking-widest border-none">
                      ADMIN EMAIL
                    </th>
                    <th className="px-8 py-5 text-left text-[12px] font-[600] uppercase tracking-widest border-none">
                      REGISTRATION DATE
                    </th>
                    <th className="px-8 py-5 text-center text-[12px] font-[600] uppercase tracking-widest border-none">
                      CURRENT STATUS
                    </th>
                    <th className="px-8 py-5 text-center text-[12px] font-[600] uppercase tracking-widest border-none rounded-tr-sm">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCompanies.map((company) => (
                    <tr
                      key={company.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div>
                          <p className="font-[600] text-[16px] text-[#1e293b] tracking-tight">
                            {company.company_name}
                          </p>
                          <p className="text-[13px] font-[500] text-[#64748b] mt-1">
                            ID: #
                            {company.id
                              ? String(company.id).slice(-5).padStart(5, '0')
                              : "10054"}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[15px] font-[500] text-[#64748b]">
                          {company.email}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[15px] font-[500] text-[#64748b]">
                          {formatDate(company.created_at) || "2025-10-24"}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[12px] font-[600] border ${
                            company.status === "approved"
                              ? "bg-[#d1fae5] text-[#10b981] border-[#d1fae5]"
                              : company.status === "pending"
                                ? "bg-[#fef3c7] text-[#d97706] border-[#fef3c7]" /* f59e0b vs d97706 */
                                : "bg-[#fee2e2] text-[#ef4444] border-[#fee2e2]"
                          }`}
                        >
                          {company.status ? company.status.charAt(0).toUpperCase() + company.status.slice(1) : "Pending"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          {company.status === "pending" && (
                            <>
                              <button
                                onClick={() => rejectCompany(company)}
                                className="h-9 w-9 flex items-center justify-center bg-[#fee2e2] text-[#ef4444] hover:bg-red-200 rounded-lg transition-all"
                                title="Reject"
                              >
                                <X className="h-4 w-4" strokeWidth={3} />
                              </button>
                              <button
                                onClick={() => approveCompany(company)}
                                className="h-9 w-9 flex items-center justify-center bg-[#d1fae5] text-[#10b981] hover:bg-green-200 rounded-lg transition-all"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" strokeWidth={3} />
                              </button>
                            </>
                          )}
                          {company.status === "approved" && (
                            <>
                              <button
                                onClick={() => suspendCompany(company)}
                                className="h-9 w-9 flex items-center justify-center bg-[#fee2e2] text-[#ef4444] hover:bg-red-200 rounded-lg transition-all"
                                title="Suspend/Block"
                              >
                                <Ban className="h-4 w-4" strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() =>
                                  viewCompanyDrives(
                                    company.id,
                                    company.company_name,
                                  )
                                }
                                className="h-9 w-9 flex items-center justify-center bg-[#fef3c7] text-[#d97706] hover:bg-yellow-200 rounded-lg transition-all"
                                title="View Drives"
                              >
                                <Eye className="h-4 w-4" strokeWidth={2.5} />
                              </button>
                            </>
                          )}
                           {company.status === "rejected" && (
                            <>
                             <button
                               onClick={() => unsuspendCompany(company)}
                               className="h-9 w-9 flex items-center justify-center bg-[#d1fae5] text-[#10b981] hover:bg-green-200 rounded-lg transition-all"
                               title="Unsuspend / Re-approve"
                             >
                               <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
                             </button>
                             <button
                                 onClick={() =>
                                   viewCompanyDrives(
                                     company.id,
                                     company.company_name,
                                   )
                                 }
                                 className="h-9 w-9 flex items-center justify-center bg-[#fef3c7] text-[#d97706] hover:bg-yellow-200 rounded-lg transition-all"
                                 title="View Drives"
                               >
                                 <Eye className="h-4 w-4" strokeWidth={2.5} />
                               </button>
                            </>
                           )}
                           {company.status === "suspended" && (
                            <>
                             <button
                               onClick={() => unsuspendCompany(company)}
                               className="h-9 w-9 flex items-center justify-center bg-[#d1fae5] text-[#10b981] hover:bg-green-200 rounded-lg transition-all"
                               title="Unsuspend"
                             >
                               <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
                             </button>
                             <button
                                 onClick={() =>
                                   viewCompanyDrives(
                                     company.id,
                                     company.company_name,
                                   )
                                 }
                                 className="h-9 w-9 flex items-center justify-center bg-[#fef3c7] text-[#d97706] hover:bg-yellow-200 rounded-lg transition-all"
                                 title="View Drives"
                               >
                                 <Eye className="h-4 w-4" strokeWidth={2.5} />
                               </button>
                            </>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Confirmation Modal */}
        <ActionModal
          isOpen={actionModal.isOpen}
          type={actionModal.type}
          companyName={actionModal.company?.company_name || ""}
          isLoading={isActionLoading}
          onClose={() =>
            setActionModal({ ...actionModal, isOpen: false, company: null })
          }
          onConfirm={handleConfirmAction}
        />
      </div>
    );
  };

  const renderStudentsDB = () => {
    const filteredStudents = allStudentsList.filter(
      (s) =>
        s.name.toLowerCase().includes(studentsSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentsSearch.toLowerCase()),
    );

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("overview")}
              className="h-12 w-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
                Total Candidates Database
              </h2>
              <p className="text-slate-500 font-[400] mt-2 text-[14px]">
                Manage and verify profiles for all candidates registered across
                ExamPortal.
              </p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/100?u=${i}`}
                className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                alt="user"
              />
            ))}
            <div className="h-10 w-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-semibold text-white shadow-sm">
              +{allStudentsList.length}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-[22px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Filter by name or email..."
              value={studentsSearch}
              onChange={(e) => setStudentsSearch(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-14 pr-6 text-sm font-bold text-slate-600 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="flex bg-slate-50 p-1.5 rounded-[12px] gap-1">
            {["all", "verified", "pending", "blacklisted"].map((status) => (
              <button
                key={status}
                onClick={() => setStudentStatusFilter(status)}
                className={`px-6 py-2.5 rounded-[18px] text-xs font-semibold uppercase tracking-widest transition-all ${
                  studentStatusFilter === status
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {status === "all"
                  ? `All Students(${allStudentsList.length})`
                  : `${status.charAt(0).toUpperCase() + status.slice(1)}(${
                      allStudentsList.filter((s) => s.status === status).length
                    })`}
              </button>
            ))}
          </div>
        </div>

        {studentsLoading ? (
          <div className="flex items-center justify-center py-40">
            <div className="animate-spin h-12 w-12 border-[6px] border-blue-600 border-t-transparent rounded-full shadow-lg shadow-blue-200"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1e293b] text-white">
                  <th className="px-6 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em] first:rounded-tl-[0px]">
                    Candidate Profile
                  </th>
                  <th className="px-6 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                    University/Institute
                  </th>
                  <th className="px-6 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-[14px] font-semibold uppercase tracking-[0.1em]">
                    Performance Index
                  </th>
                  <th className="px-6 py-4 text-right text-[14px] font-semibold uppercase tracking-[0.1em] last:rounded-tr-xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={student.image}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-100 shadow-sm"
                          alt=""
                        />
                        <div>
                          <p className="font-semibold text-slate-900 text-[16px] tracking-tight">
                            {student.name}
                          </p>
                          <p className="text-xs font-bold text-slate-400 italic lowercase">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[16px] font-semibold text-slate-700">
                        {student.university}
                      </p>
                    </td>
                    <td className="px-8 py-4">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider ${
                          student.status === "verified"
                            ? "bg-emerald-50 text-emerald-600"
                            : student.status === "pending"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-red-50 text-red-600"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p
                        className={`text-[16px] font-semibold tracking-tight ${student.status === "blacklisted" ? "text-red-600" : "text-slate-900"}`}
                      >
                        {student.performance}
                      </p>
                    </td>
                    <td className="px-2 py-4 text-right">
                      <button className="text-[14px] font-semibold text-blue-600 uppercase tracking-[0.2em] hover:text-blue-700 transition-colors">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderOngoingExams = () => {
    // Filter by search
    const filteredExams = ongoingExamsList.filter(
      (drive) =>
        drive.title?.toLowerCase().includes(ongoingSearch.toLowerCase()) ||
        drive.company_name
          ?.toLowerCase()
          .includes(ongoingSearch.toLowerCase()) ||
        drive.id?.toString().includes(ongoingSearch),
    );

    // Calculate total active candidates
    const totalActiveCandidates = filteredExams.reduce((acc, drive) => {
      return acc + (examStatuses[drive.id]?.student_count || 0);
    }, 0);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-5">
            <button
              onClick={() => setActiveTab("overview")}
              className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm mt-1 group"
            >
              <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h2 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none">
                Ongoing Exams
              </h2>
              <p className="text-slate-500 font-medium text-[15px] mt-2 max-w-xl">
                Real-time supervision and system health for active test
                sessions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-rose-50 rounded-full border border-rose-100/50">
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-600">
              Live Monitoring
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="relative flex-1 group max-w-md w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Filter by name or email..."
              value={ongoingSearch}
              onChange={(e) => setOngoingSearch(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-6 text-[14px] font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-blue-50/50 text-blue-600 rounded-xl border border-blue-100/50">
            <Users className="h-4.5 w-4.5" />
            <span className="text-[14px] font-bold tracking-tight">
              {totalActiveCandidates.toLocaleString()} Active Candidates
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
          {filteredExams.map((drive) => {
            const status = examStatuses[drive.id];
            const timeLeft = clientTimeRemaining[drive.id] || 0;
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);

            return (
              <div
                key={drive.id}
                className="bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
              >
                {/* LIVE Badge */}
                <div className="absolute top-9 right-9 flex items-center gap-2 px-4 py-2 bg-[#ecfdf5] text-[#059669] rounded-[12px] border border-emerald-100/30">
                  <span className="text-[12px] font-black uppercase tracking-[0.15em]">
                    Live
                  </span>
                </div>

                <div className="space-y-10">
                  {/* Nested Header section */}
                  <div className="bg-[#f8fafc] rounded-[24px] p-6 w-fit max-w-[80%] border border-slate-100/50">
                    <p className="text-[13px] font-bold text-[#2563eb] uppercase tracking-widest mb-2.5">
                      EX-{drive.id?.toString().padStart(4, "0") || "9801"}
                    </p>
                    <h3 className="text-[24px] font-bold text-[#1e293b] leading-[1.2]">
                      {drive.title || "Software Engineering 101"}
                    </h3>
                    <p className="text-[16px] font-medium text-[#64748b] mt-4">
                      {drive.company_name || "Global Tech"}
                    </p>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-8 pt-2">
                    <div className="space-y-2">
                      <p className="text-[14px] font-[500] text-[#94a3b8] uppercase tracking-[0.1em]">
                        Candidates
                      </p>
                      <p className="text-[18px] font-[600] text-[#1e293b] tracking-tight">
                        {status?.student_count || "0"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[14px] font-[500] text-[#94a3b8] uppercase tracking-[0.1em]">
                        Time Left
                      </p>
                      <p className="text-[18px] font-[600] text-[#1e293b] tracking-tight">
                        {hours}h {minutes}m
                      </p>
                    </div>
                    <div className="space-y-2 text-right">
                      <p className="text-[14px] font-[500] text-[#94a3b8] uppercase tracking-[0.1em]">
                        Sys Health
                      </p>
                      <p className="text-[16px] font-[600] text-[#10b981] uppercase tracking-tight">
                        Optimal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredExams.length === 0 && !ongoingLoading && (
            <div className="col-span-full py-32 text-center bg-slate-50/40 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="flex flex-col items-center gap-5">
                <div className="h-20 w-20 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Timer className="h-10 w-10 text-slate-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-slate-900 font-bold text-[20px]">
                    {ongoingSearch
                      ? "No matching exams found"
                      : "No live drives at this moment"}
                  </p>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    {ongoingSearch
                      ? "Try adjusting your search terms or filters."
                      : "Newly approved drives scheduled for today will appear here when they start."}
                  </p>
                </div>
                {ongoingSearch && (
                  <button
                    onClick={() => setOngoingSearch("")}
                    className="mt-2 text-blue-600 font-bold text-sm uppercase tracking-widest hover:text-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}

          {ongoingLoading && (
            <div className="col-span-full py-40 text-center">
              <div className="animate-spin h-10 w-10 border-[5px] border-blue-600 border-t-transparent rounded-full mx-auto shadow-sm"></div>
              <p className="text-slate-500 font-bold text-sm mt-6 uppercase tracking-widest animate-pulse">
                Updating live sessions...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActiveDrivesTable = () => {
    // Derive counts for filters
    const allCount = allDrivesList.length;
    const activeCount = allDrivesList.filter(
      (d) =>
        ["live", "ongoing", "approved"].includes(d.status) || d.is_approved,
    ).length;
    const completedCount = allDrivesList.filter(
      (d) => d.status === "completed",
    ).length;

    const filters = [
      { id: "all", label: "All", count: allCount },
      { id: "active", label: "Active", count: activeCount },
      { id: "completed", label: "Completed", count: completedCount },
    ];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <button
              onClick={() => setActiveTab("overview")}
              className="h-10 w-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm mt-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-2xl font-[600] text-slate-800 tracking-tight">
                Drive Monitoring
              </h2>
              <p className="text-slate-400 font-[300] text-[14px] mt-1 pr-10">
                Real-time oversight of all examination drives.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[12px] font-bold text-slate-600">
              Today
            </div>
            <button
              onClick={() => loadAllDrives()}
              className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 text-[12px] font-bold text-white transition-all shadow-md shadow-blue-200 hover:bg-blue-700 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Refresh Status
            </button>
          </div>
        </div>

        <div className="bg-white/50 p-4 shadow-md rounded-xl border border-slate-300/50 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative flex-1 group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Filter by company.."
              value={driveSearch}
              onChange={(e) => setDriveSearch(e.target.value)}
              className="w-full bg-slate-200/50 border-none rounded-xl py-3 pl-11 pr-6 text-[13px] font-medium text-slate-600 placeholder:text-slate-600 placeholder:font-[400] focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="flex items-center p-1.5 bg-slate-100/50 rounded-xl border border-slate-200/50 overflow-hidden">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setDriveStatusFilter(f.id)}
                className={`px-6 py-2 rounded-lg text-[13px] font-bold transition-all ${
                  driveStatusFilter === f.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f.label}({f.count})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {allDrivesList
            .filter((d) => {
              // Status filter
              if (driveStatusFilter === "active") {
                return (
                  ["live", "ongoing", "upcoming", "approved", "submitted"].includes(d.status) ||
                  (d.is_approved && d.status !== "draft")
                );
              }
              if (driveStatusFilter === "completed") {
                return d.status === "completed";
              }
              return true; // "all"
            })
            .filter((d) => {
              // Search filter
              if (driveSearch) {
                return (
                  d.title?.toLowerCase().includes(driveSearch.toLowerCase()) ||
                  d.company_name
                    ?.toLowerCase()
                    .includes(driveSearch.toLowerCase())
                );
              }
              return true;
            })
            .map((drive) => {
              const isLive =
                ["live", "ongoing"].includes(drive.status) ||
                examStatuses[drive.id]?.exam_state === "ongoing";
              const isCompleted = drive.status === "ended";
              const isPending = ["pending", "submitted", "draft"].includes(
                drive.status,
              );

              return (
                <div
                  key={drive.id}
                  className="bg-white rounded-2xl border border-slate-100/80 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 group relative flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    {/* Status Badge */}
                    <div>
                      {isLive ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100">
                          <IoIosFlash className="h-3 w-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Live
                          </span>
                        </div>
                      ) : isCompleted ? (
                        <div className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-100">
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Completed
                          </span>
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-orange-50 text-orange-500 rounded-full border border-orange-100">
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Upcoming
                          </span>
                        </div>
                      )}
                    </div>
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[17px] font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                      {drive.title || "Campus Recruitment 2026"}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-slate-500">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span className="text-[14px] font-[500]">{drive.company_name || "Unknown Company"}</span>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3 text-slate-500">
                        <Users className="h-4 w-4 text-[#22293A]" />
                        <span className="text-[14px] text-[#22293A]">
                          {examStatuses[drive.id]?.student_count || "N/A"}{" "}
                          Candidates
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        <Clock className="h-4 w-4 text-[#22293A]" />
                        <span className="text-[14px] text-[#22293A]">
                          {formatDateIST(drive.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <button
                      onClick={() => viewDriveDetail(drive.id)}
                      className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-slate-300 rounded-3xl text-[16px] font-[500] text-slate-800 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 select-none group/btn"
                    >
                      Drive Info
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}

          {allDrivesList.length === 0 && !drivesLoading && (
            <div className="col-span-full py-24 text-center bg-slate-50/30 rounded-2xl border-2 border-dashed border-slate-100">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                  <Rocket className="h-8 w-8 text-slate-200" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-lg">
                    No drives found
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Adjust your filters or check back later.
                  </p>
                </div>
              </div>
            </div>
          )}

          {drivesLoading && (
            <div className="col-span-full py-24 text-center">
              <div className="animate-spin h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-400 font-medium mt-4">
                Loading drive data...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActiveCompaniesTotal = () => {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end ">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("overview")}
              className="h-12 w-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-3xl font-semibold  text-slate-900 tracking-tight">
                Active Companies
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Detailed overview of all organizations registered on ExamPortal.
              </p>
            </div>
          </div>
          <div className="bg-emerald-50 px-5 py-3.5 rounded-xl flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">
              {dashboardStats?.companies?.active || 0} Total
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Search companies by name or email..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-14 pr-6 text-sm font-bold text-slate-600 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1e293b] text-white">
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em] first:rounded-tl-xl">
                  Organization
                </th>
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Admin/CEO
                </th>
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Sector
                </th>
                <th className="px-8 py-4 text-center text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Drives
                </th>
                <th className="px-8 py-4 text-right text-[14px] font-semibold uppercase tracking-[0.1em] last:rounded-tr-xl">
                  Tier
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {companiesList
                ?.filter(
                  (c) =>
                    c.company_name
                      ?.toLowerCase()
                      .includes(companySearch.toLowerCase()) ||
                    c.email
                      ?.toLowerCase()
                      .includes(companySearch.toLowerCase()),
                )
                .map((company) => (
                  <tr
                    key={company.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-semibold text-lg">
                          {company.company_name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-base tracking-tight">
                            {company.company_name}
                          </p>
                          <p className="text-[14px]  text-slate-700 uppercase tracking-widest mt-1">
                            #{company.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-[16px] text-slate-500">
                        {company.email}
                      </p>
                    </td>
                    <td className="px-8 py-4">
                      <span className="bg-slate-50 text-slate-400 px-4 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-widest border border-slate-100">
                        GENERAL
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <p className="text-[16px] font-semibold text-slate-900">
                        {
                          allDrivesList.filter(
                            (d) => d.company_id === company.id,
                          ).length
                        }
                      </p>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-widest border ${
                            company.plan === "premium"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                          }`}
                        >
                          {company.plan || "FREE"}
                        </span>
                        <button
                          onClick={() => openPlanModal(company)}
                          className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-100"
                          title="Set Plan"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTickets = () => {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("overview")}
              className="h-12 w-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-[600] text-slate-900 tracking-tight">
                Support Tickets
              </h2>
              <p className="text-slate-500 font-[400] mt-1 text-[14px]">
                Manage and resolve company support requests
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-100 rounded-xl text-xs font-semibold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button
              onClick={loadTickets}
              disabled={ticketsLoading}
              className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              <RotateCcw
                className={`h-4 w-4 ${ticketsLoading ? "animate-spin" : ""}`}
              />
              {ticketsLoading ? "Syncing..." : "Sync Data"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            {
              label: "Total Tickets",
              value: ticketsList.length.toLocaleString(),
              color: "text-slate-900",
            },
            {
              label: "New Requests",
              value: ticketsList
                .filter((t) => t.status === "open")
                .length.toLocaleString(),
              color: "text-blue-600",
            },
            {
              label: "Pending",
              value: ticketsList
                .filter((t) => t.status === "open")
                .length.toLocaleString(),
              color: "text-orange-600",
            },
            {
              label: "Resolved/Closed",
              value: ticketsList
                .filter((t) => ["resolved", "closed"].includes(t.status))
                .length.toLocaleString(),
              color: "text-emerald-600",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm transition-all hover:shadow-md"
            >
              <p className={`text-[14px] font-semibold ${stat.color}  mb-3`}>
                {stat.label}
              </p>
              <p className={`text-3xl font-semibold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1e293b] text-white">
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em] first:rounded-tl-xl">
                  Ticket ID
                </th>
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Company
                </th>
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Type
                </th>
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Priority
                </th>
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Status
                </th>

                <th className="px-8 py-4 text-right text-[14px] font-semibold uppercase tracking-[0.1em] last:rounded-tr-xl">
                  Last Update
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ticketsList.map((ticket, idx) => (
                <tr
                  key={idx}
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setActiveTab("ticket_detail");
                  }}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-4 font-[400] text-slate-900 text-[14px]">
                    {ticket.id}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3 font-[400] text-slate-700 text-[14px]">
                      <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                      {ticket.company_name || `Company #${ticket.company_id}`}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-[14px] font-[400] text-slate-500">
                    {ticket.category}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full font-[400] ${
                          ticket.priority?.toLowerCase() === "high"
                            ? "bg-red-500"
                            : ticket.priority?.toLowerCase() === "medium"
                              ? "bg-orange-500"
                              : "bg-slate-400"
                        }`}
                      ></div>
                      <span className="text-[14px] font-[400] text-slate-700 capitalize">
                        {ticket.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-[400] uppercase tracking-widest border ${
                        ticket.status === "NEW"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : ticket.status === "open"
                            ? "bg-slate-100  text-orange-600 border-slate-300"
                            : "bg-slate-100 text-emerald-600 border-slate-300"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td className="px-8 py-4 text-right text-[14px] font-[400] text-slate-400">
                    {formatDate(ticket.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-10 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center mt-auto">
            <p className="text-[12px] font-[400] text-slate-600 uppercase tracking-[0.2em]">
              Showing {ticketsList.length} tickets
            </p>
            <div className="flex gap-2">
              <button className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTicketDetail = () => {
    if (!selectedTicket) return setActiveTab("tickets");

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex justify-between items-start">
          <div>
            <button
              onClick={() => setActiveTab("tickets")}
              className="flex items-center gap-2 text-[14px] font-[500] hover:text-blue-600 transition-all mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Tickets
            </button>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm font-semibold text-slate-400">
                Ticket #{selectedTicket.id}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${
                  selectedTicket.status === "NEW"
                    ? "bg-blue-50 text-blue-600"
                    : selectedTicket.status === "PENDING"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {selectedTicket.status}
              </span>
            </div>
            <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">
              {selectedTicket.subject}
            </h2>
          </div>
          <div className="bg-white border border-slate-100 px-6 py-4 rounded-3xl shadow-sm text-right">
            <p className="text-[12px] font-[600] text-slate-400 uppercase tracking-widest mb-1">
              Raised On
            </p>
            <p className="text-[14px] font-[400] text-slate-900 tracking-tight">
              {formatDate(selectedTicket.created_at)}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl border border-slate-100 p-10 shadow-sm space-y-10">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">
                    Issue Description
                  </h3>
                </div>
                <div className="bg-slate-50/50 p-8 rounded-3xl border-l-4 border-blue-600 italic text-slate-600 font-bold leading-relaxed text-lg whitespace-pre-wrap">
                  "{selectedTicket.description}"
                </div>
              </div>

              <div className="flex justify-between items-center pt-10 border-t border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-base tracking-tight uppercase">
                      {selectedTicket.company_name ||
                        `Company #${selectedTicket.company_id}`}
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Support Request
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  {selectedTicket.status === "NEW" && (
                    <button
                      onClick={() =>
                        handleUpdateTicketStatus(selectedTicket.id, "PENDING")
                      }
                      className="px-8 py-4 bg-orange-500 text-white rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
                    >
                      MARK AS PENDING
                    </button>
                  )}
                  {!["resolved", "closed"].includes(selectedTicket.status) && (
                    <button
                      onClick={() =>
                        setResolutionModal({
                          isOpen: true,
                          ticketId: selectedTicket.id,
                        })
                      }
                      className="px-6 py-3 bg-[#22293A] text-white rounded-xl text-[14px] font-[500] uppercase tracking-[0.1em] hover:bg-[#22293A]/80 transition-all shadow-lg flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      MARK AS COMPLETE
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#312E81] rounded-xl p-10 relative overflow-hidden group">
              <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-4 max-w-lg">
                  <h3 className="text-2xl font-[500] text-white tracking-tight">
                    SLA Guarantee
                  </h3>
                  <p className="text-slate-300 font-[400] leading-relaxed">
                    As a High priority ticket, our technical team is committed
                    to a 2-hour response time or immediate mitigation for
                    critical blockers.
                  </p>
                </div>
                <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-12 w-12 text-slate-400/20" />
                </div>
              </div>
              <Shield className="absolute -right-10 -bottom-10 h-64 w-64 text-white/[0.03] rotate-12" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
              <h3 className="text-[14px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-8">
                Internal Metadata
              </h3>
              <div className="space-y-8">
                <div>
                  <p className="text-[12px] font-[600] text-slate-400 uppercase tracking-widest mb-1.5">
                    Issue Category
                  </p>
                  <p className="text-[14px] font-[500] text-slate-900 tracking-tight">
                    {selectedTicket.category}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-[600] text-slate-400 uppercase tracking-widest mb-1.5">
                    Priority
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        selectedTicket.priority?.toLowerCase() === "high"
                          ? "bg-red-500"
                          : selectedTicket.priority?.toLowerCase() === "medium"
                            ? "bg-orange-500"
                            : "bg-slate-400"
                      }`}
                    ></div>
                    <p className="text-sm font-semibold text-slate-900 tracking-tight">
                      {selectedTicket.priority}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-[500] text-slate-400 uppercase tracking-widest mb-1.5">
                    Last Updated
                  </p>
                  <p className="text-sm font-semibold text-slate-900 tracking-tight">
                    {formatDate(selectedTicket.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
              <h3 className="text-[12px] font-[500] text-slate-400 uppercase tracking-[0.2em] mb-8">
                Ticket Logs
              </h3>
              <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                <div className="flex gap-4 relative">
                  <div className="h-4 w-4 rounded-full bg-emerald-500 border-4 border-white z-10 shadow-sm mt-1"></div>
                  <div>
                    <p className="text-[12px] font-[500] text-slate-900 uppercase tracking-[0.1em] mb-1">
                      Ticket Created
                    </p>
                    <p className="text-[12px] font-[400] text-slate-400 uppercase tracking-[0.1em]">
                      {formatDate(selectedTicket.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 relative">
                  <div className="h-4 w-4 rounded-full bg-blue-500 border-4 border-white z-10 shadow-sm mt-1"></div>
                  <div>
                    <p className="text-[12px] font-[500] text-slate-900 uppercase tracking-[0.1em] mb-1">
                      Last Status Change
                    </p>
                    <p className="text-[12px] font-[400] text-blue-600 uppercase tracking-[0.1em]">
                      {selectedTicket.status}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {formatDate(selectedTicket.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlans = () => {
    const filteredCompanies = companiesList.filter(
      (c) =>
        c.company_name?.toLowerCase().includes(companySearch.toLowerCase()) ||
        c.email?.toLowerCase().includes(companySearch.toLowerCase()),
    );

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("overview")}
              className="h-12 w-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
                Plan Management
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Manage subscription tiers and drive limits for companies.
              </p>
            </div>
          </div>
        </header>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Filter by company..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-14 pr-6 text-sm font-bold text-slate-600 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1e293b] text-white">
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Company
                </th>
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Current Plan
                </th>
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Drive Limit
                </th>
                <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Status
                </th>
                <th className="px-8 py-4 text-right text-[14px] font-semibold uppercase tracking-[0.1em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCompanies.map((company) => (
                <tr
                  key={company.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-4">
                    <p className="font-semibold text-slate-900">
                      {company.company_name}
                    </p>
                    <p className="text-xs text-slate-400">{company.email}</p>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase">
                      {company.plan || "Free"}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-sm font-medium text-slate-600">
                      {company.drives_limit === null
                        ? "Unlimited"
                        : company.drives_limit}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        company.status === "approved"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => openPlanModal(company)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                    >
                      Change Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDataManagement = () => {
    return <AdminColleges onBack={() => setActiveTab("overview")} />;
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          setActiveTab={setActiveTab}
          setCompanySearch={setCompanySearch}
          setDriveSearch={setDriveSearch}
          setStudentsSearch={setStudentsSearch}
        />
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {activeTab === "overview" && (statsLoading ? (
            <div className="flex items-center justify-center py-40">
              <div className="animate-spin h-12 w-12 border-[6px] border-blue-600 border-t-transparent rounded-full shadow-lg shadow-blue-200"></div>
            </div>
          ) : renderOverview())}
          {activeTab === "companies" && renderCompanies()}
          {activeTab === "students" && renderStudentsDB()}
          {activeTab === "ongoing_exams" && renderOngoingExams()}
          {(activeTab === "active_drives" || activeTab === "drives") &&
            renderActiveDrivesTable()}
          {activeTab === "data_management" && renderDataManagement()}
          {activeTab === "active_companies" && renderActiveCompaniesTotal()}
          {activeTab === "plans" && renderPlans()}
          {activeTab === "tickets" && renderTickets()}
          {activeTab === "ticket_detail" && renderTicketDetail()}
          {activeTab === "colleges" && renderDataManagement()}
          {activeTab === "notifications" && <AdminNotifications />}
          {activeTab === "send_message" && <AdminDirectMessaging />}
        </main>
      </div>

      {/* Plan Management Modal */}
      {planModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Manage Company Plan
                </h3>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                  {planModal.company?.company_name}
                </p>
              </div>
              <button
                onClick={() => setPlanModal({ ...planModal, isOpen: false })}
                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-slate-400 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Plan Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Subscription Tier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["free", "basic", "pro", "premium", "custom"].map((plan) => (
                    <button
                      key={plan}
                      onClick={() =>
                        setPlanModal({ ...planModal, currentPlan: plan })
                      }
                      className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all uppercase tracking-wider ${
                        planModal.currentPlan === plan
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                          : "bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600"
                      }`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drive Limit - only show or enable for custom maybe? Postman says provide drives_limit for custom */}
              <div className="space-y-4">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Drive Limit
                  </label>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    {planModal.drivesLimit === null
                      ? "Unlimited"
                      : `${planModal.drivesLimit} Drives`}
                  </span>
                </div>
                <div className="relative group">
                  <input
                    type="number"
                    placeholder="Enter limit (leave empty for unlimited)"
                    value={
                      planModal.drivesLimit === null
                        ? ""
                        : planModal.drivesLimit
                    }
                    onChange={(e) =>
                      setPlanModal({
                        ...planModal,
                        drivesLimit:
                          e.target.value === ""
                            ? null
                            : parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 flex px-6 text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 italic ml-1">
                  * Basic: 3, Pro: 10, Premium: Unlimited recommended.
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex gap-4">
              <button
                onClick={() => setPlanModal({ ...planModal, isOpen: false })}
                className="flex-1 py-4 px-6 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPlan}
                disabled={isActionLoading}
                className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isActionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Plan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODALS ============= */}

      {/* Drives Modal (Companies Tab) */}
      {drivesModal.open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="p-8 pb-6 bg-white sticky top-0 z-10 flex justify-between items-start border-b border-slate-50">
              <div className="flex gap-5 items-center">
                <div className="p-4 bg-[#eef2ff] rounded-2xl flex-shrink-0">
                  <Building2 className="w-8 h-8 text-[#4f46e5]" />
                </div>
                <div>
                  <h3 className="text-[22px] font-bold text-[#1e293b] leading-tight mb-2">
                    {drivesModal.companyName}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-[500] text-[#94a3b8]">
                      #{drivesModal.companyId ? String(drivesModal.companyId).slice(-5).padStart(5, '0') : "10055"}
                    </span>
                    {(() => {
                      const cStatus = companiesList.find(c => c.id === drivesModal.companyId)?.status || "approved";
                      const isAppr = cStatus === "approved";
                      const isRej = cStatus === "rejected";
                      return (
                        <span className={`px-2.5 py-1 rounded-full text-[12px] font-[600] flex items-center gap-1.5 ${
                          isAppr ? 'bg-[#d1fae5] text-[#10b981]' :
                          isRej ? 'bg-[#fee2e2] text-[#ef4444]' : 'bg-[#fef3c7] text-[#d97706]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isAppr ? 'bg-[#10b981]' :
                            isRej ? 'bg-[#ef4444]' : 'bg-[#d97706]'
                          }`}></span> {cStatus.charAt(0).toUpperCase() + cStatus.slice(1)}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDrivesModal({ ...drivesModal, open: false })}
                className="h-10 w-10 flex items-center justify-center bg-[#fee2e2] text-[#ef4444] rounded-full hover:bg-red-200 transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="px-8 mt-6 flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-[13px] font-[800] text-[#94a3b8] uppercase tracking-widest">EXAM DRIVES</span>
              <span className="text-[#64748b] font-[700] text-[13px]">{drivesList.length} drive{drivesList.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="px-8 pb-10">
              {drivesList.length === 0 ? (
                <p className="text-[#64748b] font-medium text-center py-10">
                  No drives found for this company
                </p>
              ) : (
                <div className="rounded-b-[20px] rounded-t-[20px] overflow-hidden mt-6 border border-slate-200 shadow-sm">
                  <table className="w-full">
                    <thead className="bg-[#0f172a]">
                      <tr>
                        <th className="px-8 py-5 text-left text-[10px] font-[700] text-white uppercase tracking-[0.2em]">
                          TITLE 
                        </th>
                        <th className="px-8 py-5 text-left text-[10px] font-[700] text-white uppercase tracking-[0.2em]">
                          TYPE 
                        </th>
                        <th className="px-8 py-5 text-left text-[10px] font-[700] text-white uppercase tracking-[0.2em]">
                          DURATION 
                        </th>
                        <th className="px-8 py-5 text-center text-[10px] font-[700] text-white uppercase tracking-[0.2em]">
                          STATUS 
                        </th>
                        <th className="px-8 py-5 text-center text-[10px] font-[700] text-white uppercase tracking-[0.2em]">
                          QUESTIONS 
                        </th>
                        <th className="px-8 py-5 text-center text-[10px] font-[700] text-white uppercase tracking-[0.2em]">
                          STUDENTS 
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {drivesList.map((drive) => (
                        <tr
                          key={drive.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-8 py-3">
                            <p className="font-[700] text-[15px] text-[#1e293b] truncate max-w-[200px]">
                              {drive.title}
                            </p>
                          </td>
                          <td className="px-8 py-3 text-left text-[15px] font-[500] text-[#64748b]">
                            {drive.category || "Technical MCQ"}
                          </td>
                          <td className="px-8 py-3 text-left text-[15px] font-[500] text-[#64748b] whitespace-nowrap">
                            {drive.exam_duration_minutes} mins
                          </td>
                          <td className="px-8 py-3 text-center">
                            <span className={`px-4 py-1.5 rounded-full border text-[13px] font-[600] inline-block ${
                              ['submitted', 'approved', 'live', 'ongoing'].includes(drive.status) ? 'bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]' :
                              ['completed', 'published'].includes(drive.status) ? 'bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0]' :
                              'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                              {['live', 'ongoing'].includes(drive.status) ? 'Scheduled' : 'Scheduled'}
                            </span>
                          </td>
                          <td className="px-8 py-3">
                            <div className="flex items-center justify-center gap-2 text-[15px] font-[700] text-[#1e293b]">
                              <span className="text-[#f59e0b]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-question"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="17" r="1"/><path d="M12 13a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/></svg>
                              </span> {drive.question_count || 60}
                            </div>
                          </td>
                          <td className="px-8 py-3">
                            <div className="flex items-center justify-center gap-2 text-[15px] font-[700] text-[#1e293b] cursor-pointer"
                                 onClick={() => {
                                   setDrivesModal({...drivesModal, open: false});
                                   setTimeout(() => viewDriveStudents(drivesModal.companyId, drive.id, drive.title), 100);
                                 }}>
                              <span className="text-[#3b82f6]">
                                <Users className="w-[18px] h-[18px]" strokeWidth={2.5} />
                              </span> {drive.student_count || 52}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Students Modal */}
      {studentsModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-100 dark:bg-slate-700 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {studentsModal.driveTitle} - Students
              </h3>
              <button
                onClick={() =>
                  setStudentsModal({ ...studentsModal, open: false })
                }
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-semibold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {driveStudentsList.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No students found for this drive
                </p>
              ) : (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-50 dark:bg-slate-700 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Total Students
                      </h4>
                      <p className="text-3xl font-semibold text-red-600 dark:text-red-400">
                        {driveStudentsList.length}
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Unique Emails
                      </h4>
                      <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
                        {new Set(driveStudentsList.map((s) => s.email)).size}
                      </p>
                    </div>
                  </div>

                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Search by name, email, or roll number..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />

                  {/* Students Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#1e293b] text-white">
                        <tr>
                          <th className="px-8 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-[0.1em]">
                            Roll Number
                          </th>
                          <th className="px-8 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-[0.1em]">
                            Name
                          </th>
                          <th className="px-8 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-[0.1em]">
                            Email
                          </th>
                          <th className="px-8 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-[0.1em]">
                            College
                          </th>
                          <th className="px-8 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-[0.1em]">
                            Group
                          </th>
                          <th className="px-8 py-4 text-left text-[14px] font-semibold text-white uppercase tracking-[0.1em]">
                            Batch Year
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {driveStudentsList
                          .filter(
                            (student) =>
                              student.name
                                .toLowerCase()
                                .includes(studentSearch.toLowerCase()) ||
                              student.email
                                .toLowerCase()
                                .includes(studentSearch.toLowerCase()) ||
                              student.roll_number
                                .toLowerCase()
                                .includes(studentSearch.toLowerCase()),
                          )
                          .map((student, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                            >
                              <td className="px-8 py-4 text-gray-900 dark:text-white text-[16px]">
                                {student.roll_number}
                              </td>
                              <td className="px-8 py-4 font-semibold text-gray-900 dark:text-white text-[16px]">
                                {student.name}
                              </td>
                              <td className="px-8 py-4 text-gray-700 dark:text-gray-300 text-[16px]">
                                {student.email}
                              </td>
                              <td className="px-8 py-4 text-gray-700 dark:text-gray-300 text-[16px]">
                                {student.college_name || "N/A"}
                              </td>
                              <td className="px-8 py-4 text-gray-700 dark:text-gray-300 text-[16px]">
                                {student.student_group_name || "N/A"}
                              </td>
                              <td className="px-8 py-4 text-gray-700 dark:text-gray-300 text-[16px]">
                                {student.batch_year || "N/A"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {driveStudentsList.filter(
                    (student) =>
                      student.name
                        .toLowerCase()
                        .includes(studentSearch.toLowerCase()) ||
                      student.email
                        .toLowerCase()
                        .includes(studentSearch.toLowerCase()) ||
                      student.roll_number
                        .toLowerCase()
                        .includes(studentSearch.toLowerCase()),
                  ).length === 0 &&
                    studentSearch.trim() !== "" && (
                      <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                        No students match your search
                      </p>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Drive Detail Modal */}
      {driveDetailModal.open && driveDetailData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-100 dark:bg-slate-700 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Drive Details
              </h3>
              <button
                onClick={() => {
                  setDriveDetailModal({ ...driveDetailModal, open: false });
                  setShowAllQuestions(false);
                  setShowAllStudents(false);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-semibold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {driveDetailData.title}
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Company
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {driveDetailData.company_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Description
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {driveDetailData.description || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Exam Duration
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {driveDetailData.exam_duration_minutes ||
                        driveDetailData.duration_minutes}{" "}
                      minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </p>
                    <p>{getStatusBadge(driveDetailData.status)}</p>
                  </div>
                </div>

                {/* Window and Actual Times */}
                <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 dark:bg-slate-700 rounded-lg border-2 border-blue-300">
                  <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      📅 Scheduled Window{" "}
                      <span className="text-xs font-normal text-blue-600">
                        (UTC)
                      </span>
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium">
                      Start:{" "}
                      {driveDetailData.window_start
                        ? formatDateIST(driveDetailData.window_start)
                        : "Not set"}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      End:{" "}
                      {driveDetailData.window_end
                        ? formatDateIST(driveDetailData.window_end)
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                      ✅ Actual Window{" "}
                      <span className="text-xs font-normal text-green-600">
                        (Live - UTC)
                      </span>
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium">
                      Start:{" "}
                      {driveDetailData.actual_window_start
                        ? formatDateIST(driveDetailData.actual_window_start)
                        : "⏳ Not started"}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      End:{" "}
                      {driveDetailData.actual_window_end
                        ? formatDateIST(driveDetailData.actual_window_end)
                        : "⏳ Not ended"}
                    </p>
                    {driveDetailData.actual_window_start &&
                      driveDetailData.actual_window_end && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 italic">
                          Duration:{" "}
                          {(() => {
                            const start = new Date(
                              driveDetailData.actual_window_start,
                            );
                            const end = new Date(
                              driveDetailData.actual_window_end,
                            );
                            const diffMs = end - start;
                            const diffHours = Math.floor(diffMs / 3600000);
                            const diffMins = Math.floor(
                              (diffMs % 3600000) / 60000,
                            );
                            return `${diffHours}h ${diffMins}m`;
                          })()}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="mb-6">
                <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Statistics
                </h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Questions
                    </p>
                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                      {driveDetailData.questions?.length || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Students
                    </p>
                    <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                      {driveDetailData.students?.length || 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Points
                    </p>
                    <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                      {driveDetailData.total_points || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Targets Section */}
              {driveDetailData.targets &&
                driveDetailData.targets.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Target Groups
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {driveDetailData.targets.map((target, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {target.college_name} - {target.student_group_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Questions Section */}
              {driveDetailData.questions &&
                driveDetailData.questions.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Questions ({driveDetailData.questions.length})
                    </h5>
                    <div className="max-h-64 overflow-y-auto bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                      {driveDetailData.questions
                        .slice(0, showAllQuestions ? undefined : 10)
                        .map((q, idx) => (
                          <div
                            key={idx}
                            className="mb-3 pb-3 border-b border-gray-200 dark:border-slate-600 last:border-b-0"
                          >
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {idx + 1}. {q.question_text}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Points: {q.points}
                            </p>
                          </div>
                        ))}
                    </div>
                    {driveDetailData.questions.length > 10 && (
                      <button
                        onClick={() => setShowAllQuestions(!showAllQuestions)}
                        className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-semibold transition"
                      >
                        {showAllQuestions
                          ? "Show Less"
                          : `Show ${
                              driveDetailData.questions.length - 10
                            } More Questions`}
                      </button>
                    )}
                  </div>
                )}

              {/* Students Section */}
              {driveDetailData.students &&
                driveDetailData.students.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Students ({driveDetailData.students.length})
                    </h5>
                    <div className="max-h-64 overflow-y-auto bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                      {driveDetailData.students
                        .slice(0, showAllStudents ? undefined : 20)
                        .map((s, idx) => (
                          <div
                            key={idx}
                            className="mb-2 pb-2 border-b border-gray-200 dark:border-slate-600 last:border-b-0 text-sm"
                          >
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {s.name} ({s.roll_number})
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {s.email}
                            </p>
                          </div>
                        ))}
                    </div>
                    {driveDetailData.students.length > 20 && (
                      <button
                        onClick={() => setShowAllStudents(!showAllStudents)}
                        className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg font-semibold transition"
                      >
                        {showAllStudents
                          ? "Show Less"
                          : `Show ${
                              driveDetailData.students.length - 20
                            } More Students`}
                      </button>
                    )}
                  </div>
                )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                {driveDetailData.status === "approved" && (
                  <button
                    onClick={() =>
                      setApprovalModal({
                        open: true,
                        driveId: driveDetailData.id,
                        action: "suspend",
                      })
                    }
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition"
                  >
                    Suspend
                  </button>
                )}
                {driveDetailData.status === "suspended" && (
                  <button
                    onClick={() => reactivateDrive(driveDetailData.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                  >
                    Reactivate
                  </button>
                )}
                <button
                  onClick={() => {
                    setDriveDetailModal({ ...driveDetailModal, open: false });
                    setShowAllQuestions(false);
                    setShowAllStudents(false);
                  }}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {approvalModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full">
            <div className="bg-gray-100 dark:bg-slate-700 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-600">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {approvalModal.action === "approve" && "Approve Drive"}
                {approvalModal.action === "reject" && "Reject Drive"}
                {approvalModal.action === "suspend" && "Suspend Drive"}
              </h3>
              <button
                onClick={() => {
                  setApprovalModal({ ...approvalModal, open: false });
                  setApprovalNotes("");
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-semibold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <label className="block mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {approvalModal.action === "approve" &&
                    "Approval notes (optional):"}
                  {approvalModal.action === "reject" &&
                    "Reason for rejection (required):"}
                  {approvalModal.action === "suspend" &&
                    "Reason for suspension (optional):"}
                </p>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Enter your message..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (
                      approvalModal.action === "reject" &&
                      !approvalNotes.trim()
                    ) {
                      toast.error("Rejection reason is required");
                      return;
                    }
                    if (approvalModal.action === "approve") {
                      approveDrive(approvalModal.driveId, approvalNotes);
                    } else if (approvalModal.action === "reject") {
                      rejectDrive(approvalModal.driveId, approvalNotes);
                    } else if (approvalModal.action === "suspend") {
                      suspendDrive(approvalModal.driveId, approvalNotes);
                    }
                    setApprovalModal({ ...approvalModal, open: false });
                    setApprovalNotes("");
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setApprovalModal({ ...approvalModal, open: false });
                    setApprovalNotes("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ResolutionModal
        isOpen={resolutionModal.isOpen}
        ticketId={resolutionModal.ticketId}
        onClose={() => setResolutionModal({ isOpen: false, ticketId: null })}
        onConfirm={handleConfirmResolution}
        isLoading={isActionLoading}
      />
    </div>
  );
}
