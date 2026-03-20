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
      live: "bg-emerald-100 text-emerald-700",
      upcoming: "bg-purple-100 text-purple-700",
      completed: "bg-slate-100 text-slate-600",
      draft: "bg-slate-100 text-slate-400",
      published: "bg-emerald-100 text-emerald-700",
      suspended: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <CompanySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6 md:p-12">
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-[#1A1A2E] rounded-2xl p-8 text-white shadow-lg">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight mb-2">
                    Welcome back, {stats.company_name || "Admin"}!
                  </h1>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-400 text-[13px] font-medium">
                      Subscription Tier:
                    </p>
                    <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-[11px] font-bold uppercase tracking-wider border border-blue-600/30">
                      {stats.plan || "Free"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center min-w-[120px]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Active Drives
                    </p>
                    <span className="text-2xl font-bold text-white">
                      {stats.active_drives}
                    </span>
                  </div>
                </div>
              </div>
              {/* Decorative background circle */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
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
                  className="flex items-center gap-2 bg-[#1565C0] text-white px-6 py-2.5 rounded-lg font-semibold text-[13px] shadow-sm hover:bg-blue-700 transition-all active:scale-95 group"
                >
                  <Plus className="h-4 w-4" />
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
                    className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
                        <img src={stat.icon} alt="" className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-tight">
                          {stat.label}
                        </p>
                        <h4 className="text-[24px] font-bold text-slate-900 tracking-tight">
                          {stat.value}
                        </h4>
                        <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                          {stat.subtitle}
                        </p>
                      </div>
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
                      className="relative bg-white rounded-xl p-6 border border-slate-100 transition-all duration-300 overflow-hidden group shadow-sm hover:shadow-md flex flex-col justify-between h-full"
                    >
                      {/* Left Accent Blue Border */}
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#1565C0] rounded-l-lg"></div>

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
                        <div className="flex gap-2 mb-4">
                          <span className="bg-slate-50 text-slate-500 px-2 py-1 rounded-md font-bold text-[10px] uppercase tracking-tight border border-slate-100">
                            {drive.category || "TECHNICAL"}
                          </span>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-[14px] font-semibold text-slate-900">
                                {drive.exam_duration_minutes} mins
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-[14px] font-semibold text-slate-900">
                                {formatDateIST(drive.window_start)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-[14px] font-semibold text-slate-900">
                                {drive.student_count || 0} Candidates
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-[14px] font-semibold text-slate-900">
                                {drive.question_count || 0} Questions
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <button
                          onClick={() =>
                            navigate(`/company-drive-detail?id=${drive.id}`)
                          }
                          className="px-4 py-1.5 border border-slate-200 text-slate-700 rounded-lg font-semibold text-[13px] hover:bg-slate-50 transition-all active:scale-95"
                        >
                          View Details
                        </button>

                        {(drive.status === "draft" ||
                          drive.status === "pending") && (
                          <button
                            onClick={() => handlePublishDrive(drive.id)}
                            className="px-4 py-1.5 bg-[#1565C0] text-white rounded-lg font-semibold text-[13px] hover:bg-blue-700 transition-all active:scale-95"
                          >
                            Publish
                          </button>
                        )}

                        {drive.status === "live" ||
                        drive.status === "ongoing" ? (
                          <button
                            onClick={() => openConfirmation(drive, "end")}
                            className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg font-semibold text-[13px] hover:bg-red-100 transition-all active:scale-95"
                          >
                            End Exam
                          </button>
                        ) : drive.status !== "completed" &&
                          drive.status !== "draft" &&
                          drive.status !== "pending" ? (
                          <button
                            onClick={() => openConfirmation(drive, "start")}
                            disabled={drive.status === "suspended"}
                            className={`px-4 py-1.5 ${
                              drive.status === "suspended"
                                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
                            } rounded-lg font-semibold text-[13px] transition-all active:scale-95`}
                          >
                            Start Exam
                          </button>
                        ) : null}
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
