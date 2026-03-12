import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanySidebar from "../components/CompanySidebar";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  Users,
  Clock,
  Zap,
  Plus,
  Calendar,
  HelpCircle,
  Copy,
} from "lucide-react";
import { toast } from "react-hot-toast";
import companyService from "../services/companyService";
import { formatDateIST } from "../utils/timezone";
import { IoIosTrendingUp } from "react-icons/io";
import totalDrives from "/icons/totalDrives.png";
import drivesLeft from "/icons/drivesLeft.png";
import activeDrives from "/icons/activeDrives.png";

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
      live: "bg-emerald-100 text-emerald-600",
      upcoming: "bg-purple-100 text-purple-600",
      completed: "bg-slate-100 text-slate-400",
      draft: "bg-blue-100 text-blue-500",
      published: "bg-emerald-100 text-emerald-600",
      suspended: "bg-red-100 text-red-600",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-['Poppins',_sans-serif]">
      <CompanySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6 md:p-12">
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/20">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight mb-4">
                    Welcome back, {stats.company_name || "Admin"}!
                  </h1>
                  <div className="flex items-center gap-3">
                    <p className="text-blue-100 text-md font-[500] ">
                      Subscription Tier:
                    </p>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs  font-[500] uppercase tracking-widest text-white border border-white/20">
                      {stats.plan || "Free"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 px-10 border border-white/10">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200 mb-1">
                      Dashboard Health
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-semibold">
                        {stats.active_drives > 0 ? "Active" : "Stable"}
                      </span>
                    </div>
                  </div>
                  <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                    <IoIosTrendingUp
                      className="h-8 w-8 text-white"
                      stroke="20"
                    />
                  </div>
                </div>
              </div>
              {/* Decorative background circle */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            {/* Overview Section */}
            <section className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                  <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">
                    Overview
                  </h2>
                  <p className="text-slate-500 font-[500">
                    Track your hiring progress and manage drives
                  </p>
                </div>
                <button
                  onClick={() => navigate("/company-create-drive")}
                  className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-[12px] uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 group"
                >
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                  Create New Drive
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    label: "Total Drives",
                    value: stats.total_drives,
                    icon: totalDrives,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                    subtitle: "Lifetime created",
                  },
                  {
                    label: "Drives Remaining",
                    value:
                      stats.drives_limit === null
                        ? "∞"
                        : Math.max(0, stats.drives_limit - stats.total_drives),
                    icon: drivesLeft,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    subtitle:
                      stats.drives_limit === null
                        ? "Unlimited access"
                        : `${stats.drives_limit} total limit`,
                  },
                  {
                    label: "Active Exams",
                    value: stats.active_drives,
                    icon: activeDrives,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                    subtitle: "Ongoing live sessions",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <img src={stat.icon} alt="" />
                    </div>
                    <div className="ms-2">
                      <h4 className="text-[32px] font-semibold text-slate-900 tracking-tighter ">
                        {stat.value}
                      </h4>
                      <p className="text-slate-900 font-[500] text-[14px] tracking]">
                        {stat.label}
                      </p>
                      <p className="text-slate-400 text-[12px] font-[400]  tracking-[0.1em] mt-1">
                        {stat.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* My Drives Section */}
            <section className="space-y-10">
              <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
                My Drives
              </h2>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-[] bg-white rounded-xl border border-slate-100 animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 ">
                  {drives.map((drive) => (
                    <div
                      key={drive.id}
                      className={`relative bg-white rounded-[2.5rem] p-7 border border-slate-100 transition-all duration-500 overflow-hidden group shadow-sm hover:shadow-2xl flex flex-col justify-between h-full`}
                    >
                      {/* Left Accent Blue Border */}
                      <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#3B82F6] rounded-l-full"></div>

                      <div>
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-[20px]  font-[500] text-[#1E293B] tracking-tight">
                                {drive.title}
                              </h3>

                              {getStatusBadge(drive.status)}
                            </div>
                            <p className="text-[#64748B] text-md font-medium leading-relaxed line-clamp-2">
                              {drive.description || "Hiring drive"}
                              {drive.targets?.[0]?.batch_year &&
                                ` for ${drive.targets[0].batch_year} batch`}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDuplicateDrive(drive.id)}
                            className="h-12 w-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 hover:text-[#1E293B] transition-all border border-slate-100 cursor-pointer group"
                            title="Duplicate Drive"
                          >
                            <Copy className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-3 mb-4">
                          <span className="bg-[#F8FAFC] text-[#64748B] px-2 py-2 rounded-xl  font-[500] text-[10px] uppercase tracking-widest border border-slate-100/50">
                            {drive.category || "TECHNICAL"}
                          </span>
                          <span className="bg-[#F8FAFC] text-[#64748B] px-2 py-2 rounded-xl  font-[500] text-[10px] uppercase tracking-widest border border-slate-100/50">
                            ENGINEERING
                          </span>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-1 mb-8">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-[#EFF6FF] text-[#3B82F6] rounded-xl flex items-center justify-center shadow-sm border border-blue-50">
                              <Clock className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[12px]  font-[500] text-[#94A3B8] uppercase tracking-[0.15em] mb-1">
                                Duration
                              </p>
                              <p className="text-[14px] font-[600] text-[#1E293B]">
                                {drive.exam_duration_minutes} mins
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 bg-[#F0FDF4] text-[#10B981] rounded-xl flex items-center justify-center shadow-sm border border-green-50">
                              <Calendar className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[12px]  font-[500] text-[#94A3B8] uppercase tracking-[0.15em] mb-1">
                                Date & Time
                              </p>
                              <p className="text-[14px] font-[600] text-[#1E293B]">
                                {formatDateIST(drive.window_start)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 bg-[#F5F3FF] text-[#8B5CF6] rounded-xl flex items-center justify-center shadow-sm border border-purple-50">
                              <Users className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[12px]  font-[500] text-[#94A3B8] uppercase tracking-[0.15em] mb-1">
                                Groups & Students
                              </p>
                              <p className="text-[14px] font-[600] text-[#1E293B]">
                                {drive.targets?.length || 0} Groups /{" "}
                                {drive.student_count || 0} Students
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 bg-[#FFF7ED] text-[#F97316] rounded-xl flex items-center justify-center shadow-sm border border-orange-50">
                              <HelpCircle className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[12px]  font-[500] text-[#94A3B8] uppercase tracking-[0.15em] mb-1">
                                No. of Questions
                              </p>
                              <p className="text-[14px] font-[600] text-[#1E293B]">
                                {drive.question_count || 0} Questions
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-5 mt-auto">
                        {(drive.status === "draft" ||
                          drive.status === "pending") && (
                          <div className="flex-1 flex gap-2">
                            <button
                              onClick={() =>
                                navigate(`/company-create-drive?id=${drive.id}`)
                              }
                              className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-xl  font-[500] text-[12px] uppercase tracking-[0.1em] hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handlePublishDrive(drive.id)}
                              className="flex-1 bg-blue-600 text-white py-2 rounded-xl  font-[500] text-[12px] uppercase tracking-[0.1em] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center"
                            >
                              Publish
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() =>
                            navigate(`/company-drive-detail?id=${drive.id}`)
                          }
                          className="flex-1 bg-[#2563EB] text-white py-2 rounded-xl  font-[500] text-[12px] uppercase tracking-[0.1em] shadow-xl shadow-blue-500/25 hover:bg-[#1D4ED8] transition-all active:scale-95 flex items-center justify-center"
                        >
                          View
                        </button>

                        {drive.status === "live" ||
                        drive.status === "ongoing" ? (
                          <button
                            onClick={() => openConfirmation(drive, "end")}
                            className="flex-1 bg-[#FEF2F2] border-2 border-[#FEE2E2] text-[#DC2626] py-2 rounded-xl  font-[500] text-[12px] uppercase tracking-[0.1em] hover:bg-[#FEE2E2] transition-all active:scale-95 flex items-center justify-center"
                          >
                            End Exam
                          </button>
                        ) : drive.status !== "completed" &&
                          drive.status !== "draft" &&
                          drive.status !== "pending" ? (
                          <button
                            onClick={() => openConfirmation(drive, "start")}
                            disabled={drive.status === "suspended"}
                            className={`flex-1 ${
                              drive.status === "suspended"
                                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                : "bg-[#F0FDF4] border-2 border-[#DCFCE7] text-[#16A34A] hover:bg-[#DCFCE7]"
                            } py-2 rounded-xl  font-[500] text-[12px] uppercase tracking-[0.1em] transition-all active:scale-95 flex items-center justify-center`}
                          >
                            Start Exam
                          </button>
                        ) : null}

                        <button
                          onClick={() =>
                            navigate(`/company-send-emails?id=${drive.id}`)
                          }
                          disabled={
                            drive.status === "suspended" ||
                            drive.status === "completed"
                          }
                          className={`px-10 ${
                            drive.status === "suspended" ||
                            drive.status === "completed"
                              ? "bg-slate-50 text-slate-200 border-slate-100 cursor-not-allowed"
                              : "bg-[#F8FAFC] text-[#64748B] border-slate-200/60 hover:bg-slate-100 hover:text-[#0F172A]"
                          } border py-2 rounded-xl  font-[500] text-[12px] uppercase tracking-[0.1em] transition-all flex items-center justify-center`}
                        >
                          Emails
                        </button>
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
