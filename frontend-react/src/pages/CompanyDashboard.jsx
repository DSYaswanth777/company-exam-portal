import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanySidebar from "../components/CompanySidebar";
import CompanyHeader from "../components/CompanyHeader";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  Users,
  Clock,
  Zap,
  Plus,
  Calendar,
  HelpCircle,
  Copy,
  Edit,
  MoreVertical,
  TrendingUp,
  FileQuestion,
  UserCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import companyService from "../services/companyService";
import { formatDateIST } from "../utils/timezone";
import { IoIosTrendingUp } from "react-icons/io";
import totalDrivesIcon from "/icons/totalDrives.png";
import drivesLeftIcon from "/icons/drivesLeft.png";
import activeDrivesIcon from "/icons/activeDrives.png";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    type: "warning",
    onConfirm: () => {},
  });

  const [stats, setStats] = useState({
    total_drives: 0,
    total_students: 0,
    active_drives: 0,
    drives_limit: 0,
    company_name: "",
  });

  useEffect(() => {
    loadDrives();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await companyService.getAggregatedStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const loadDrives = async () => {
    setLoading(true);
    try {
      const res = await companyService.getMyDrives();
      setDrives(res.data);
    } catch (err) {
      toast.error("Failed to load drives");
      setDrives([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (driveId, action) => {
    try {
      if (action === "end") {
        await companyService.endExam(driveId);
        toast.success("Exam ended successfully!");
      } else if (action === "start") {
        await companyService.startExam(driveId);
        toast.success("Exam started successfully!");
      }
      loadDrives();
      setModalConfig({ ...modalConfig, isOpen: false });
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handlePublishDrive = async (driveId) => {
    try {
      await companyService.publishDrive(driveId);
      toast.success("Drive published successfully!");
      loadDrives();
    } catch (err) {
      toast.error("Failed to publish drive");
    }
  };

  const handleDuplicateDrive = async (driveId) => {
    try {
      await companyService.duplicateDrive(driveId);
      toast.success("Drive duplicated successfully!");
      loadDrives();
      loadStats();
    } catch (err) {
      toast.error("Failed to duplicate drive");
    }
  };

  const openConfirmation = (drive, action) => {
    const isEnd = action === "end";
    setModalConfig({
      isOpen: true,
      title: isEnd ? "End Examination?" : "Start Examination?",
      message: isEnd
        ? `Are you sure you want to end "${drive.title}"? This will prevent any further student submissions.`
        : `Are you sure you want to start "${drive.title}"? Invitations will be activated for eligible candidates.`,
      confirmLabel: isEnd ? "End Exam" : "Start Exam",
      type: isEnd ? "warning" : "info",
      onConfirm: () => handleAction(drive.id, action),
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      live: "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/20",
      published: "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/20",
      upcoming: "bg-[#DBEAFE] text-[#1D4ED8] border-[#1D4ED8]/20",
      draft: "bg-[#FFEDD5] text-[#EA580C] border-[#EA580C]/20",
      completed: "bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/20",
      ended: "bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/20",
      suspended: "bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/20",
    };

    // Default to draft style if status not found
    const currentStyle = styles[status.toLowerCase()] || styles.draft;

    return (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${currentStyle}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <CompanySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CompanyHeader />
        <main className="flex-1 overflow-auto p-12">
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-[32px] p-8 text-white shadow-xl">
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h1 className="text-[36px] font-[600] tracking-tight mb-2">
                    Welcome back, {stats.company_name || "User"}!
                  </h1>
                  <p className="text-blue-100 text-[18px] font-medium opacity-90">
                    Here's what's happening with your exam portal today
                  </p>
                </div>

                {/* Growth Card */}
                <div className="flex justify-center items-center gap-3">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex items-center gap-6 min-w-[180px]">
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-widest text-blue-100 mb-1">
                        THIS MONTH
                      </p>
                      <span className="text-[30px] font-[600]">+24%</span>
                    </div>
                  </div>
                  <div className="h-16 w-16 bg-white/20 rounded-[18px] flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              {/* Decorative background circle */}
              <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
            </div>

            {/* Overview Section */}
            <section className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-[28px] font-bold text-[#1E293B] tracking-tight mb-1">
                    Overview
                  </h2>
                  <p className="text-[#64748B] text-[15px] font-medium">
                    Track your hiring progress and manage drives
                  </p>
                </div>
                <button
                  onClick={() => navigate("/company-create-drive")}
                  className="flex items-center gap-3 bg-[#3B82F6] text-white px-8 py-4 rounded-[16px] font-bold text-[15px] shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 group"
                >
                  <Plus className="h-5 w-5" />
                  Create New Drive
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    label: "Total Drives",
                    value: stats.total_drives,
                    icon: totalDrivesIcon,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                    count: "20 DRIVES", // Match design image placeholder
                  },
                  {
                    label: "Drives Left",
                    value:
                      stats.drives_limit === null
                        ? "∞"
                        : Math.max(0, stats.drives_limit - stats.total_drives),
                    icon: drivesLeftIcon,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                    count:
                      stats.drives_limit === null
                        ? "UNLIMITED"
                        : `${stats.drives_limit - stats.total_drives} USED`,
                  },
                  {
                    label: "Active Drives",
                    value: stats.active_drives,
                    icon: activeDrivesIcon,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                    count: "2 LIVE",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <img
                        src={stat.icon}
                        alt={stat.label}
                        
                      />

                      <span
                        className={`text-[11px] font-extrabold bg-[#EFF6FF] px-2 py-1 rounded-full uppercase tracking-widest ${stat.color}`}
                      >
                        {stat.count}
                      </span>
                    </div>
                    <div className="ps-2">
                      <h4 className="text-[40px] font-bold text-[#1E293B] tracking-tight leading-none mb-2">
                        {stat.value}
                      </h4>
                      <p className="text-[#1E293B] text-[15px] font-[500]  tracking-wide">
                        {stat.label}
                      </p>
                      <p className="text-[#9CA3AF] text-[12px] font-[500] mt-1">
                        {i === 0
                          ? "Total drives per month"
                          : i === 1
                            ? `Out of your ${stats.drives_limit || 20}-drive quota`
                            : "Currently live & receiving entries"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* My Drives Section */}
            <section className="space-y-10">
              <h2 className="text-[28px] font-bold text-[#1E293B] tracking-tight">
                My Drives
              </h2>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-[400px] bg-white rounded-[24px] border border-slate-100 animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {drives.map((drive) => (
                    <div
                      key={drive.id}
                      className="relative bg-white rounded-[38px] p-10 border border-slate-100 transition-all duration-300 overflow-hidden group shadow-sm hover:shadow-xl flex flex-col h-full"
                    >
                      {/* Left Status Color Bar */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-[6px] border-r-2 ${
                          drive.status === "live"
                            ? "bg-[#16A34A] border-[#15803D]"
                            : drive.status === "upcoming"
                              ? "bg-[#3B82F6] border-[#2563EB]"
                              : drive.status === "draft"
                                ? "bg-[#EA580C] border-[#C2410C]"
                                : "bg-[#DC2626] border-[#B91C1C]"
                        }`}
                      ></div>

                      <div className="flex-1">
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <h3 className="text-[24px] font-bold text-[#1E293B] tracking-tight">
                                {drive.title}
                              </h3>
                              {getStatusBadge(drive.status)}
                            </div>
                            <p className="text-[#64748B] text-[15px] font-medium leading-relaxed max-w-[85%]">
                              {drive.description ||
                                "Core engineering hiring for Q1 2026 batch."}
                            </p>
                          </div>

                          {/* Utility Icons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDuplicateDrive(drive.id)}
                              className="h-10 w-10 bg-slate-50 text-slate-400 rounded-[12px] flex items-center justify-center hover:bg-slate-100 hover:text-[#1E293B] transition-all border border-slate-100 group/btn"
                              title="Duplicate"
                            >
                              <Copy className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                            </button>
                            {(drive.status === "draft" ||
                              drive.status === "upcoming") && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/company-create-drive?edit=${drive.id}`,
                                  )
                                }
                                className="h-10 w-10 bg-slate-50 text-slate-400 rounded-[12px] flex items-center justify-center hover:bg-slate-100 hover:text-[#1E293B] transition-all border border-slate-100 group/btn"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Tag Pills */}
                        <div className="flex gap-3 mb-10">
                          <span className="bg-[#F8FAFC] text-[#64748B] px-4 py-1.5 rounded-[8px] font-extrabold text-[10px] uppercase tracking-widest border border-slate-100 shadow-sm">
                            {drive.category || "TECHNICAL"}
                          </span>
                          <span className="bg-[#F8FAFC] text-[#64748B] px-4 py-1.5 rounded-[8px] font-extrabold text-[10px] uppercase tracking-widest border border-slate-100 shadow-sm">
                            ENGINEERING
                          </span>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-10">
                          {/* Duration */}
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-blue-500 shadow-sm border border-slate-100">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">
                                DURATION
                              </p>
                              <p className="text-[15px] font-bold text-[#1E293B]">
                                {drive.exam_duration_minutes} mins
                              </p>
                            </div>
                          </div>

                          {/* Date & Time */}
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">
                                DATE & TIME
                              </p>
                              <p className="text-[15px] font-bold text-[#1E293B]">
                                {formatDateIST(drive.window_start)}
                              </p>
                            </div>
                          </div>

                          {/* Groups & Students */}
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-purple-500 shadow-sm border border-slate-100">
                              <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">
                                GROUPS & STUDENTS
                              </p>
                              <p className="text-[15px] font-bold text-[#1E293B]">
                                3 Groups / {drive.student_count || 0} Students
                              </p>
                            </div>
                          </div>

                          {/* Questions */}
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-orange-500 shadow-sm border border-slate-100">
                              <FileQuestion className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">
                                NO. OF QUESTIONS
                              </p>
                              <p className="text-[15px] font-bold text-[#1E293B]">
                                {drive.question_count || 0} Questions
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex gap-4 mt-auto">
                        <button
                          onClick={() =>
                            navigate(`/company-send-emails?driveId=${drive.id}`)
                          }
                          className="flex-1 py-2 border border-slate-200 text-[#64748B] rounded-[16px] font-bold text-[13px] hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest shadow-sm"
                        >
                          Emails
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/company-drive-detail?id=${drive.id}`)
                          }
                          className="flex-1 py-2 bg-[#3B82F6] text-white rounded-[16px] font-bold text-[13px] hover:bg-blue-600 transition-all active:scale-95 uppercase tracking-widest shadow-lg shadow-blue-500/20"
                        >
                          {drive.status === "completed" ? "Overview" : "View"}
                        </button>

                        {drive.status === "live" && (
                          <button
                            onClick={() => openConfirmation(drive, "end")}
                            className="flex-1 py-2 bg-[#FFEDD5] text-[#EA580C] rounded-[16px] font-bold text-[13px] border border-[#EA580C]/20 hover:bg-[#FFD8A8] transition-all active:scale-95 uppercase tracking-widest"
                          >
                            End Exam
                          </button>
                        )}

                        {drive.status === "upcoming" && (
                          <button
                            onClick={() => openConfirmation(drive, "start")}
                            className="flex-1 py-2 bg-[#DCFCE7] text-[#16A34A] rounded-[16px] font-bold text-[13px] border border-[#16A34A]/20 hover:bg-[#BBF7D0] transition-all active:scale-95 uppercase tracking-widest"
                          >
                            Start Exam
                          </button>
                        )}

                        {drive.status === "draft" && (
                          <button
                            onClick={() => handlePublishDrive(drive.id)}
                            className="flex-1 py-2 bg-[#FFEDD5] text-[#EA580C] rounded-[16px] font-bold text-[13px] border border-[#EA580C]/20 hover:bg-[#FFD8A8] transition-all active:scale-95 uppercase tracking-widest"
                          >
                            Publish
                          </button>
                        )}

                        {drive.status === "completed" && (
                          <button
                            onClick={() =>
                              navigate(
                                `/company-drive-detail?id=${drive.id}&view=results`,
                              )
                            }
                            className="flex-1 py-2 bg-[#DCFCE7] text-[#16A34A] rounded-[16px] font-bold text-[13px] border border-[#16A34A]/20 hover:bg-[#BBF7D0] transition-all active:scale-95 uppercase tracking-widest"
                          >
                            Results
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        type={modalConfig.type}
      />
    </div>
  );
}
