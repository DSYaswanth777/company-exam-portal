import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import companyService from "../services/companyService";
import { getErrorMessage } from "../utils/errorHelpers";
import { formatDateUTC } from "../utils/timezone";
import CompanySidebar from "../components/CompanySidebar";
import CompanyHeader from "../components/CompanyHeader";
import ConfirmationModal from "../components/ConfirmationModal";

import {
  ArrowLeft,
  Settings,
  Users,
  HelpCircle,
  BarChart,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  ShieldCheck,
  Zap,
  MoreVertical,
  Mail,
  User,
  X,
  Activity,
  Award,
  Calendar,
  FileText,
  Rocket,
  RefreshCw,
  LayoutGrid,
  FileQuestion,
  FilePlus,
  Briefcase,
} from "lucide-react";

/**
 * CompanyDriveDetail - Premium management screen for specific assessment drives.
 * Integrated with shared layouts and high-fidelity design.
 */
export default function CompanyDriveDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();

  const driveId = searchParams.get("id");

  const [drive, setDrive] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [examStatus, setExamStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isEndingExam, setIsEndingExam] = useState(false);
  const [isStartingExam, setIsStartingExam] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState("overview");

  // Results state
  const [results, setResults] = useState([]);
  const [minPercentage, setMinPercentage] = useState(0);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  useEffect(() => {
    if (!driveId) {
      navigate("/company-dashboard");
      return;
    }
    loadDriveData();

    // Poll exam status every 30 seconds to check for auto-end
    const intervalId = setInterval(() => {
      loadExamStatus();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [driveId]);

  // Auto-refresh results when on Results tab and exam is ongoing
  useEffect(() => {
    if (
      activeTab === "results" &&
      examStatus?.exam_state === "ongoing" &&
      results.length > 0
    ) {
      const resultsIntervalId = setInterval(() => {
        loadResults();
      }, 15000); // Refresh every 15 seconds

      return () => clearInterval(resultsIntervalId);
    }
  }, [activeTab, examStatus?.exam_state, results.length]);

  const loadDriveData = async () => {
    setIsLoading(true);
    try {
      const [driveRes, questionsRes, studentsRes, examStatusRes] =
        await Promise.all([
          companyService.getDriveDetail(driveId),
          companyService.getDriveQuestions(driveId).catch((err) => {
            console.error("Failed to load questions:", err);
            return { data: [] };
          }),
          companyService.getDriveStudents(driveId).catch((err) => {
            console.error("Failed to load students:", err);
            return { data: [] };
          }),
          companyService.getDriveExamStatus(driveId).catch((err) => {
            console.error("Failed to load exam status:", err);
            return { data: null };
          }),
        ]);

      setDrive(driveRes.data);
      setQuestions(questionsRes.data || []);
      setStudents(studentsRes.data || []);
      setExamStatus(examStatusRes.data || null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadExamStatus = async () => {
    try {
      const res = await companyService.getDriveExamStatus(driveId);
      setExamStatus(res.data);

      // If exam auto-ended, reload drive data to update status
      if (res.data.should_auto_end) {
        toast("Exam has automatically ended after duration elapsed");
        loadDriveData();
      }
    } catch (err) {
      console.error("Failed to load exam status:", err);
    }
  };

  const handlePublishDrive = async () => {
    try {
      await companyService.publishDrive(driveId);
      toast.success("Drive published successfully!");
      loadDriveData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    type: "warning",
    onConfirm: () => {},
  });

  const handleStartExam = async () => {
    setModalConfig({
      isOpen: true,
      title: "Start Examination?",
      message:
        "Are you sure you want to start the exam? This will open the window for candidates to log in.",
      confirmLabel: "Start Exam",
      type: "info",
      onConfirm: async () => {
        setIsStartingExam(true);
        try {
          await companyService.startExam(driveId);
          toast.success("Exam started successfully!");
          await loadDriveData();
          setModalConfig({ ...modalConfig, isOpen: false });
        } catch (err) {
          toast.error(getErrorMessage(err));
        } finally {
          setIsStartingExam(false);
        }
      },
    });
  };

  const handleEndExam = async () => {
    setModalConfig({
      isOpen: true,
      title: "End Examination?",
      message:
        "Are you sure you want to end the exam? This will prevent students from continuing the test.",
      confirmLabel: "End Exam",
      type: "warning",
      onConfirm: async () => {
        setIsEndingExam(true);
        try {
          await companyService.endExam(driveId);
          toast.success("Exam ended successfully!");
          await loadDriveData();
          setModalConfig({ ...modalConfig, isOpen: false });
        } catch (err) {
          toast.error(getErrorMessage(err));
        } finally {
          setIsEndingExam(false);
        }
      },
    });
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    // Simple extension check
    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a valid CSV file. Refer to the template for the correct format.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      if (type === "questions") {
        await companyService.uploadQuestions(driveId, formData);
        toast.success("Questions uploaded successfully!");
      } else if (type === "students") {
        await companyService.uploadStudents(driveId, formData);
        toast.success("Students uploaded successfully!");
      }

      // Wait a moment for backend to process, then reload data
      setTimeout(() => {
        loadDriveData();
        event.target.value = "";
        setIsUploading(false);
      }, 500);
    } catch (err) {
      toast.error(getErrorMessage(err) + ". Please refer to the template for the correct format.");
      event.target.value = "";
      setIsUploading(false);
    }
  };

  const loadResults = async () => {
    setIsLoadingResults(true);
    try {
      const params = minPercentage > 0 ? { min_percentage: minPercentage } : {};
      const res = await companyService.getResults(driveId, params);
      setResults(res.data.results || []);
      toast.success(
        `Loaded ${res.data.filtered_students} of ${res.data.total_students} students`,
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
      console.error("Failed to load results:", err);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const exportResults = async (format) => {
    try {
      const response = await companyService.exportResults(driveId, { format });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `drive_${driveId}_results_${format}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(
        `${
          format.charAt(0).toUpperCase() + format.slice(1)
        } results exported successfully`,
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
      console.error("Failed to export results:", err);
    }
  };

  const getStatusDisplay = (status) => {
    const styles = {
      live: "bg-emerald-50 text-emerald-600 border-emerald-100",
      ongoing: "bg-emerald-600 text-white",
      completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
      ended: "bg-slate-100 text-slate-600 border-slate-200",
      pending: "bg-orange-50 text-orange-600 border-orange-100",
      approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
      submitted: "bg-blue-50 text-blue-600 border-blue-100",
      published: "bg-emerald-50 text-emerald-600 border-emerald-100",
      opened: "bg-cyan-50 text-cyan-600 border-cyan-100",
      draft: "bg-slate-50 text-slate-400 border-slate-100",
    };
    return styles[status] || "bg-blue-50 text-blue-600 border-blue-100";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50 font-['Poppins',_sans-serif]">
        <CompanySidebar />
        <div className="flex-1 flex flex-col">
          {/* <CompanyHeader /> */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
              <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl font-semibold text-slate-900 tracking-tight animate-pulse">
                Syncing Drive Data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-['Poppins',_sans-serif]">
      <CompanySidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <CompanyHeader /> */}

        <main className="flex-1 overflow-auto p-6 md:p-12">
          <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Page header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pt-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/company-dashboard")}
                  className="h-10 w-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h2 className="text-[28px] font-[600] text-[#111827] leading-tight flex items-center gap-3">
                    Drive Configuration
                  </h2>
                  <p className="text-[14px] text-[#686666] font-[400] mt-2">
                    Managing assessment parameters and compliance standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Tabs Design */}
            <div className="flex bg-white border border-slate-200 rounded-2xl p-2 mb-8 overflow-x-auto no-scrollbar w-fit">
              {[
                { id: "overview", label: "OVERVIEW", icon: LayoutGrid },
                {
                  id: "questions",
                  label: "QUESTIONS",
                  icon: FileQuestion,
                  count: questions.length,
                },
                {
                  id: "students",
                  label: "CANDIDATES",
                  icon: Users,
                  count: students.length,
                },
                { id: "results", label: "RESULTS", icon: BarChart },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === "results" && results.length === 0)
                        loadResults();
                    }}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-2xl text-[12px] font-[500] transition-all ${
                      isActive
                        ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span
                        className={`text-[12px] px-2.5 py-1 rounded-md font-bold ml-2 ${
                          isActive
                            ? "bg-white text-[#2563EB] shadow-sm"
                            : "bg-slate-200/80 text-slate-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="pb-20">
              {/* Overview Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Type */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-4">
                      <div className="h-14 w-14 bg-white shadow-[0_4px_12px_rgba(37,99,235,0.12)] rounded-full flex items-center justify-center text-blue-500">
                        <FileText className="h-6 w-6" strokeWidth={2} />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-[13px] font-semibold text-blue-500">
                          Type
                        </p>
                        <p className="text-[13px] font-bold text-[#111827] uppercase">
                          TECHNICAL MCQ
                        </p>
                      </div>
                    </div>

                    {/* Card 2: Duration */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-4">
                      <div className="h-14 w-14 bg-emerald-50 shadow-[0_4px_12px_rgba(16,185,129,0.12)] rounded-full flex items-center justify-center text-[#16A34A]">
                        <Clock className="h-6 w-6" strokeWidth={2} />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-[13px] font-semibold text-[#16A34A]">
                          Duration
                        </p>
                        <p className="text-[13px] font-bold text-[#111827] uppercase">
                          {drive.exam_duration_minutes} MINUTES
                        </p>
                      </div>
                    </div>

                    {/* Card 3: Students */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-4">
                      <div className="h-14 w-14 bg-white shadow-[0_4px_12px_rgba(249,115,22,0.12)] rounded-full flex items-center justify-center text-orange-500">
                        <Users className="h-6 w-6" strokeWidth={2} />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-[13px] font-semibold text-orange-500">
                          Students
                        </p>
                        <p className="text-[13px] font-bold text-[#111827] uppercase">
                          {students.length}
                        </p>
                      </div>
                    </div>

                    {/* Card 4: Questions */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-4">
                      <div className="h-14 w-14 bg-white shadow-[0_4px_12px_rgba(37,99,235,0.12)] rounded-full flex items-center justify-center text-blue-500">
                        <FileQuestion className="h-6 w-6" strokeWidth={2} />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-[13px] font-semibold text-blue-500">
                          Questions
                        </p>
                        <p className="text-[13px] font-bold text-[#111827] uppercase">
                          {questions.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-[#111827]">
                        <Briefcase
                          className="h-[22px] w-[22px]"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="text-[18px] font-[600] text-[#22293A] uppercase tracking-wide">
                        DESCRIPTION
                      </h3>
                    </div>
                    <p className="text-[14px] text-[#9CA3AF] font-[500] ">
                      {drive.description ||
                        "Core engineering hiring for Q1 2026 batch."}
                    </p>
                  </div>

                  {/* Schedule Section */}
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col gap-6">
                      <h3 className="text-[18px] font-[600] text-[#22293A] uppercase tracking-wide">
                      SCHEDULE
                    </h3>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-start gap-4">
                        <Calendar
                          className="h-[20px] w-[20px] text-slate-400 mt-0.5"
                          strokeWidth={2}
                        />
                        <div className="space-y-1.5">
                    <p className="text-[14px] text-[#9CA3AF] font-[500] ">
                            Window Start (UTC)
                          </p>
                          <p className="text-[13px] font-bold text-[#111827]">
                            {formatDateUTC(drive.window_start) ||
                              "FEB 20, 2026, 03:30 PM GMT+5:30"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Calendar
                          className="h-[20px] w-[20px] text-slate-400 mt-0.5"
                          strokeWidth={2}
                        />
                        <div className="space-y-1.5">
                    <p className="text-[14px] text-[#9CA3AF] font-[500] ">
                            Window End (UTC)
                          </p>
                          <p className="text-[13px] font-bold text-[#111827]">
                            {formatDateUTC(drive.window_end) ||
                              "FEB 21, 2026, 11:30 PM GMT+5:30"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Target Groups Section */}
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col gap-5">
                      <h3 className="text-[18px] font-[600] text-[#22293A] uppercase tracking-wide">
                      TARGET GROUPS
                    </h3>
                    <div className="space-y-4">
                      {drive.targets && drive.targets.length > 0 ? (
                        drive.targets.map((target, idx) => (
                          <div
                            key={idx}
                            className="p-6 rounded-2xl border border-slate-200 flex flex-col gap-6"
                          >
                            <div className="flex-1">
                              <p className="text-[14px] font-[600] text-[#111827] mb-5">
                                Group {idx + 1}
                              </p>
                              <div className="flex flex-col md:flex-row gap-8 md:gap-24 lg:gap-32">
                                <div className="flex gap-2 items-center">
                                  <span className="text-[12px] text-[#64748b] font-semibold uppercase tracking-wider">
                                    COLLEGE:
                                  </span>
                                  <span className="text-[13px] font-[700] text-[#111827]">
                                    {target.college_name ||
                                      target.custom_college_name ||
                                      "All Colleges"}
                                  </span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <span className="text-[12px] text-[#64748b] font-semibold uppercase tracking-wider">
                                    GROUP:
                                  </span>
                                  <span className="text-[13px] font-[700] text-[#111827] uppercase">
                                    {target.group_name ||
                                      target.custom_student_group_name ||
                                      "All Groups"}
                                  </span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <span className="text-[12px] text-[#64748b] font-semibold uppercase tracking-wider">
                                    BATCH:
                                  </span>
                                  <span className="text-[13px] font-[700] text-[#111827]">
                                    {target.batch_year || "Any Batch"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 rounded-2xl border border-slate-100 flex items-center justify-center py-10">
                          <p className="text-slate-400 font-medium italic">No target groups configured for this drive.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Exam Status Section */}
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col gap-5">
                      <h3 className="text-[18px] font-[600] text-[#22293A] uppercase tracking-wide">
                      EXAM STATUS
                    </h3>
                    <p className="text-[14px] text-[#9CA3AF] font-[500] ">
                      {examStatus?.exam_state === "ongoing"
                        ? "Exam is currently live and ongoing."
                        : examStatus?.exam_state === "completed"
                          ? "Exam has been completed."
                          : "Exam has not started yet"}
                    </p>

                    {drive.status !== "draft" &&
                      drive.status !== "pending" &&
                      examStatus?.exam_state !== "ongoing" &&
                      examStatus?.exam_state !== "completed" && (
                        <button
                          onClick={handleStartExam}
                          disabled={
                            isStartingExam || drive.status === "suspended"
                          }
                          className={`flex items-center w-fit gap-2 ${drive.status === "suspended" ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-[#3B82F6] text-white hover:bg-blue-700 shadow-sm"} px-6 py-2.5 rounded-lg font-semibold text-[13px] transition-all active:scale-95 group mt-2`}
                        >
                          {isStartingExam ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Rocket className="h-4 w-4" />
                          )}
                          Start Exam Now
                        </button>
                      )}

                    {examStatus?.exam_state === "ongoing" && (
                      <button
                      
                        onClick={handleEndExam}
                        disabled={isEndingExam}
                        className="flex items-center w-fit gap-3 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-[12px] uppercase tracking-widest shadow-xl shadow-red-500/30 hover:bg-red-700 transition-all active:scale-95 group mt-2"
                      >
                        {isEndingExam ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        End Exam early
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Questions Tab Content */}
              {activeTab === "questions" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  {/* Keep input outside so empty state upload button works */}
                  <input
                    type="file"
                    id="questionsFile"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(e, "questions")}
                    className="hidden"
                  />
                  {questions.length > 0 && (
                    <div className="bg-slate-900 rounded-t-xl p-5 mb-0 flex flex-col md:flex-row justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                          <HelpCircle className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
                          QUESTIONS REPOSITORY
                        </h3>
                      </div>
                      <div className="flex gap-4">
                        <a 
                          href="/sample_questions.csv" 
                          download 
                          className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-xl font-semibold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          TEMPLATE
                        </a>
                        <button
                          onClick={() =>
                            document.getElementById("questionsFile").click()
                          }
                          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          IMPORT CSV
                        </button>
                      </div>
                    </div>
                  )}

                  {questions.length === 0 ? (
                    <div className="bg-white rounded-3xl py-20 px-6 text-center border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center">
                      <div className="h-[88px] w-[88px] bg-[#f8fafc] rounded-3xl flex items-center justify-center text-[#2563EB] mb-6">
                        <FileText className="h-8 w-8" strokeWidth={2.5} />
                      </div>
                      <h4 className="text-[22px] font-bold text-[#1e293b] tracking-tight mb-3">
                        No Questions Uploaded
                      </h4>
                      <p className="text-[#64748b] text-[15px] max-w-[420px] leading-relaxed mb-4">
                        You haven't added any questions to this drive yet. Link
                        a question group or import via CSV to begin.
                      </p>
                      <p className="text-amber-600 text-[12px] font-semibold uppercase tracking-wider mb-8 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Warning: This action cannot be undone
                      </p>
                        <div className="flex gap-4">
                        <a 
                          href="/sample_questions.csv" 
                          download 
                          className="bg-white border border-slate-200 text-slate-600 px-8 py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          DOWNLOAD TEMPLATE
                        </a>
                        <button
                          onClick={() =>
                            document.getElementById("questionsFile").click()
                          }
                          className="bg-[#2563EB] text-white px-8 py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                        >
                          BULK IMPORT
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-10 py-4  text-left text-[14px] font-[600] text-[#686666] uppercase tracking-widest w-24">
                              #
                            </th>
                            <th className="px-10 py-4 text-left text-[14px] font-[600] text-[#686666] uppercase tracking-widest">
                              CONTENT
                            </th>
                            <th className="px-10 py-4  text-left text-[14px] font-[600] text-[#686666] uppercase tracking-widest w-32">
                              TYPE
                            </th>
                            <th className="px-10 py-4 text-right text-[14px] font-[600] text-[#686666] uppercase tracking-widest w-32">
                              POINTS
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {questions.map((q, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-slate-50/30 transition-colors group"
                            >
                              <td className="px-10 py-6 font-semibold text-slate-900">
                                Q{String(idx + 1).padStart(2, "0")}
                              </td>
                              <td className="px-10 py-6 font-medium text-slate-600">
                                {q.question_text}
                              </td>
                              <td className="px-10 py-6">
                                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-widest">
                                  MCQ
                                </span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                <span className="text-blue-600 font-semibold text-[10px]">
                                  {q.points} PTS
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Students Tab Content - Simplified for Brevity in rewrite, apply same pattern as Questions */}
              {activeTab === "students" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  {/* Keep input outside so empty state upload button works */}
                  <input
                    type="file"
                    id="studentsFile"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(e, "students")}
                    className="hidden"
                  />
                  {students.length > 0 && (
                    <div className="bg-slate-900 rounded-t-xl p-5 mb-0 flex flex-col md:flex-row justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                          <Users className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
                          STUDENTS REPOSITORY
                        </h3>
                      </div>
                      <div className="flex gap-4">
                        <a 
                          href="/sample_students.csv" 
                          download 
                          className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-xl font-semibold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          TEMPLATE
                        </a>
                        <button
                          onClick={() =>
                            document.getElementById("studentsFile").click()
                          }
                          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          IMPORT CSV
                        </button>
                      </div>
                    </div>
                  )}

                  {students.length === 0 ? (
                    <div className="bg-white rounded-3xl py-20 px-6 text-center border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center">
                      <div className="h-[88px] w-[88px] bg-[#f8fafc] rounded-3xl flex items-center justify-center text-[#2563EB] mb-6">
                        <User className="h-8 w-8" strokeWidth={2.5} />
                      </div>
                      <h4 className="text-[22px] font-bold text-[#1e293b] tracking-tight mb-3">
                        No Candidates Registered
                      </h4>
                      <p className="text-[#64748b] text-[15px] max-w-[420px] leading-relaxed mb-4">
                        You haven't added any students to this drive yet. Link a
                        student group or import via CSV to begin.{" "}
                      </p>
                      <p className="text-amber-600 text-[12px] font-semibold uppercase tracking-wider mb-8 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Warning: This action cannot be undone
                      </p>
                        <div className="flex gap-4">
                        <a 
                          href="/sample_students.csv" 
                          download 
                          className="bg-white border border-slate-200 text-slate-600 px-8 py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          DOWNLOAD TEMPLATE
                        </a>
                        <button
                          onClick={() =>
                            document.getElementById("studentsFile").click()
                          }
                          className="bg-[#2563EB] text-white px-8 py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                        >
                          BULK IMPORT
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F1F5F9] border-b border-slate-100">
                            <th className="px-10 py-4 text-left text-[14px] font-[600] text-[#686666] uppercase tracking-widest">
                              ROLL NUMBER
                            </th>
                            <th className="px-10 py-4 text-left text-[14px] font-[600] text-[#686666] uppercase tracking-widest">
                              CANDIDATE NAME
                            </th>
                            <th className="px-10 py-4 text-left text-[14px] font-[600] text-[#686666] uppercase tracking-widest">
                              EMAIL ADDRESS
                            </th>
                            <th className="px-10 py-4 text-left text-[14px] font-[600] text-[#686666] uppercase tracking-widest">
                                COLLEGE & GROUP
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {students.map((s, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-slate-50/30 transition-colors group"
                            >
                              <td className="px-10 py-6 font-semibold text-slate-600">
                                {s.roll_number}
                              </td>
                              <td className="px-10 py-6 font-semibold text-slate-900 tracking-tight">
                                {s.name || "Alex Rivera"}
                              </td>
                              <td className="px-10 py-6 font-medium text-slate-500">
                                {s.email}
                              </td>
                              <td className="px-10 py-6">
                                <div className="space-y-0.5">
                                  <p className="text-[11px] font-semibold text-slate-900">
                                    {s.college_name || "-"}
                                  </p>
                                  <p className="text-[10px] font-medium text-slate-400">
                                    {s.group_name || "-"}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Results Tab Content */}
              {activeTab === "results" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
                    {/* Filter Results */}
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                      <h4 className="text-[18px] font-[600] text-[#22293A]">
                        Filter Results
                      </h4>
                      <div className="space-y-4">
                        <p className="text-[16px] font-[600] text-[#111827]">
                          Minimum Percentage: {minPercentage}%
                        </p>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={minPercentage}
                          onChange={(e) => setMinPercentage(e.target.value)}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                          style={{
                            background: `linear-gradient(to right, #2563EB ${minPercentage}%, #f1f5f9 ${minPercentage}%)`
                          }}
                        />
                        <button
                          onClick={loadResults}
                          className="bg-[#2563EB] text-white px-6 mt-3 py-3 rounded-xl font-[600] text-[14px] tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                        >
                          Apply Filter & Load Results
                        </button>
                      </div>
                    </div>

                    {/* Export Section */}
                    <div className="bg-white p-6 rounded-lg border border-[#2563EB] shadow-sm space-y-4">
                      <h4 className="text-[18px] font-semibold text-[#111827]">
                        Export Results
                      </h4>
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => exportResults("summary")}
                          className="flex items-center border p-3 px-4 rounded-xl border-[#E2E8F0] gap-1 text-[12px] font-normal text-slate-600 hover:text-[#1565C0] transition-colors"
                        >
                          <Download className="h-4 w-4" /> Export Summary CSV
                        </button>
                        <button
                          onClick={() => exportResults("detailed")}
                          className="flex items-center border p-3 px-4 rounded-xl border-[#E2E8F0] gap-1 text-[12px] font-normal text-slate-600 hover:text-[#1565C0] transition-colors"
                        >
                          <Download className="h-4 w-4" /> Export Detailed CSV (
                          {results.length}/{students.length})
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results Table Section */}
                  <div className="bg-white rounded-[16px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200 mt-6 overflow-hidden">
                    <div className="p-6 border-b border-white">
                      <h3 className="text-[18px] font-[600] text-[#1e293b] uppercase pl-2">
                        RESULTS TABLE
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-[#1e293b]">
                            <th className="px-8 py-5 text-[14px] font-[600] text-white tracking-widest uppercase">
                              NAME
                            </th>
                            <th className="px-8 py-5 text-[14px] font-[600] text-white tracking-widest uppercase">
                              EMAIL
                            </th>
                            <th className="px-8 py-5 text-[14px] font-[600] text-white tracking-widest uppercase text-center">
                              ROLL NUMBER
                            </th>
                            <th className="px-8 py-5 text-[14px] font-[600] text-white tracking-widest uppercase text-center">
                              COLLEGE
                            </th>
                            <th className="px-8 py-5 text-[14px] font-[600] text-white tracking-widest uppercase text-center">
                              PERCENTAGE
                            </th>
                            <th className="px-8 py-5 text-[14px] font-[600] text-white tracking-widest uppercase text-center">
                              STATUS
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {isLoadingResults ? (
                            <tr>
                              <td
                                colSpan="6"
                                className="text-center py-20 animate-pulse font-semibold text-slate-300"
                              >
                                CALCULATING METRICS...
                              </td>
                            </tr>
                          ) : results.length === 0 ? (
                            <tr>
                              <td
                                colSpan="6"
                                className="text-center py-20 italic text-slate-400 font-medium"
                              >
                                <div className="bg-white rounded-3xl py-20 px-6 text-center border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center">
                                  <div className="h-[88px] w-[88px] bg-[#f8fafc] rounded-3xl flex items-center justify-center text-[#2563EB] mb-6">
                                    <FileText
                                      className="h-8 w-8"
                                      strokeWidth={2.5}
                                    />
                                  </div>
                                  <h4 className="text-[22px] font-bold text-[#1e293b] tracking-tight mb-3">
                                    No Results Yet
                                  </h4>
                                  <p className="text-[#64748b] text-[15px] max-w-[420px] leading-relaxed mb-8">
                                    You haven't added any results to this
                                    drive yet.
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            results.map((res, idx) => (
                              <tr
                                key={idx}
                                onClick={() => {
                                  setSelectedStudent(res);
                                  setIsStudentModalOpen(true);
                                }}
                                className="cursor-pointer hover:bg-slate-50 transition-colors"
                              >
                                <td className="px-8 py-6 text-[14px] font-[600] text-[#64748b]">
                                  {res.name || "Taylor"}
                                </td>
                                <td className="px-8 py-6 text-[14px] font-[600] text-[#111827]">
                                  {res.email}
                                </td>
                                <td className="px-8 py-6 text-[14px] font-[600] text-[#111827] text-center w-[160px]">
                                  {res.roll_number}
                                </td>
                                <td className="px-8 py-6 text-[14px] font-[600] text-[#64748b] text-center w-[120px]">
                                  {res.college_name || "-"}
                                </td>
                                <td className="px-8 py-6 text-[14px] font-[600] text-[#111827] text-center w-[140px]">
                                  {res.percentage || 0}%
                                </td>
                                <td className="px-8 py-6 text-center w-[160px]">
                                  <span
                                    className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[12px] font-[600] border border-solid ${
                                      res.is_disqualified
                                        ? "bg-red-50 text-red-600 border-red-100"
                                        : res.exam_submitted_at
                                          ? "bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]"
                                          : res.exam_started_at
                                            ? "bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]"
                                            : "bg-slate-50 text-slate-500 border-slate-200"
                                    }`}
                                  >
                                    {res.is_disqualified
                                      ? "Disqualified"
                                      : res.exam_submitted_at
                                        ? "Completed"
                                        : res.exam_started_at
                                          ? "In Progress"
                                          : "Not Started"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
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

      {/* Student Detail Modal */}
      {isStudentModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-12 font-['Poppins',_sans-serif]">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsStudentModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            {/* Modal Sidebar (Profile) */}
            <div className="w-full md:w-80 bg-slate-900 p-10 flex flex-col items-center text-center">
              <div className="h-32 w-32 bg-white/10 rounded-xl flex items-center justify-center text-white mb-8 border border-white/5">
                <User className="h-14 w-14" />
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
                {selectedStudent.name}
              </h3>
              <p className="text-blue-400 font-semibold text-[10px] uppercase tracking-widest mb-10">
                {selectedStudent.roll_number}
              </p>

              <div className="w-full space-y-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-left">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
                    Direct Contact
                  </p>
                  <p className="text-sm font-medium text-white truncate">
                    {selectedStudent.email}
                  </p>
                  <p className="text-sm font-medium text-slate-400 truncate">
                    {selectedStudent.phone || "No phone provided"}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-left">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
                    Institutional Data
                  </p>
                  <p className="text-sm font-medium text-white">
                    {selectedStudent.college_name || "-"}
                  </p>
                  <p className="text-sm font-medium text-slate-400 uppercase text-[10px]">
                    {selectedStudent.student_group_name || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-10 w-full">
                <button
                  onClick={() => setIsStudentModalOpen(false)}
                  className="w-full py-4 rounded-xl border border-white/10 text-white font-semibold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </div>

            {/* Modal Main Content */}
            <div className="flex-1 p-10 md:p-14 overflow-auto max-h-[80vh] no-scrollbar">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h4 className="text-3xl font-semibold text-slate-900 tracking-tight">
                    Assessment Performance
                  </h4>
                  <p className="text-slate-500 font-medium mt-2">
                    Real-time execution metrics and integrity reporting.
                  </p>
                </div>
                <button
                  onClick={() => setIsStudentModalOpen(false)}
                  className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Performance Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex flex-col justify-center">
                  <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mb-4">
                    Yield Percentage
                  </p>
                  <p className="text-4xl font-semibold text-blue-600 tracking-tight">
                    {selectedStudent.percentage || 0}
                    <span className="text-base text-blue-300 ml-1">%</span>
                  </p>
                </div>
                <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100 flex flex-col justify-center">
                  <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mb-4">
                    Raw Evaluation
                  </p>
                  <p className="text-4xl font-semibold text-emerald-600 tracking-tight">
                    {selectedStudent.score !== null
                      ? selectedStudent.score
                      : "--"}
                    <span className="text-base text-emerald-300 ml-1">
                      / {selectedStudent.total_marks || "--"}
                    </span>
                  </p>
                </div>
                  {selectedStudent.violation_count > 0 && (
                    <div className="bg-red-50/50 p-6 rounded-xl border border-red-100 flex flex-col justify-center">
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-red-400">
                        Anomalies Detected
                      </p>
                      <p className="text-4xl font-semibold tracking-tight text-red-600">
                        Yes
                      </p>
                    </div>
                  )}
              </div>

              {/* Detailed Violations */}
              {selectedStudent.violation_count > 0 &&
                selectedStudent.violation_details && (
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <Activity className="h-5 w-5 text-red-500" />
                      <h5 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">
                        INTEGRITY VIOLATION BREAKDOWN
                      </h5>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(selectedStudent.violation_details).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm"
                          >
                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                              {key.replace("_", " ")}
                            </p>
                            <p className="text-xl font-semibold text-slate-900">
                              {value}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Assessment Timeline */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <h5 className="text-sm font-semibold text-slate-900 uppercase tracking-widest">
                    SESSION LIFECYCLE
                  </h5>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl flex flex-col md:flex-row gap-8 justify-around">
                  <div>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                      Initialization
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedStudent.exam_started_at
                        ? formatDateUTC(selectedStudent.exam_started_at)
                        : "NOT STARTED"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                      Final Submission
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedStudent.exam_submitted_at
                        ? formatDateUTC(selectedStudent.exam_submitted_at)
                        : "PENDING"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Disqualification Status */}
              {selectedStudent.is_disqualified && (
                <div className="p-8 bg-red-600 rounded-xl text-white shadow-xl shadow-red-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="h-6 w-6" />
                    <h5 className="text-lg font-semibold uppercase tracking-widest">
                      SYSTEM DISQUALIFICATION
                    </h5>
                  </div>
                  <p className="text-red-100 font-medium leading-relaxed">
                    {selectedStudent.disqualification_reason ||
                      "Account flagged for irreversible breach of compliance standards."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
