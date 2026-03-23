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
  Mail,
  Send,
  Eye,
  Edit3,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  RefreshCw,
  ChevronRight,
  Code,
  Zap,
  Layers,
  Users,
} from "lucide-react";

/**
 * CompanySendEmails - Premium interface for configuring and triggering recruitment communications.
 * Fully integrated with the high-fidelity design system.
 */
export default function CompanySendEmails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();

  const driveId = searchParams.get("id");

  const [emailStatus, setEmailStatus] = useState(null);
  const [emailConfig, setEmailConfig] = useState({
    subject_template: "",
    body_template: "",
    use_custom_template: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [drive, setDrive] = useState(null);
  const [examStatus, setExamStatus] = useState(null);
  const [previewText, setPreviewText] = useState("");
console.log(drive)
  const templateVariables = [
    "{{student_name}}",
    "{{roll_number}}",
    "{{drive_title}}",
    "{{company_name}}",
    "{{password}}",
    "{{login_url}}",
    "{{start_time}}",
    "{{duration}}",
  ];

  useEffect(() => {
    if (!driveId) {
      navigate("/company-dashboard");
      return;
    }
    loadData();
  }, [driveId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, configRes, examStatusRes, driveRes] = await Promise.all(
        [
          companyService.getDriveEmailStatus(driveId).catch(() => null),
          companyService.getEmailTemplate().catch(() => ({
            data: {
              subject_template: "Invitation to {{drive_title}}",
              body_template:
                "Dear {{student_name}}, You are invited to participate in {{drive_title}}. Password: {{password}}",
              use_custom_template: true,
            },
          })),
          companyService.getDriveExamStatus(driveId).catch(() => null),
          companyService.getDriveDetail(driveId).catch(() => null),
        ]
      );

      setEmailStatus(statusRes?.data || null);
      setEmailConfig(configRes.data);
      setExamStatus(examStatusRes?.data || null);
      setDrive(driveRes?.data || null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (field, value) => {
    setEmailConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitConfig = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await companyService.updateEmailTemplate(emailConfig);
      toast.success("Design saved successfully!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePreview = () => {
    let preview = emailConfig.body_template;
    const sampleData = {
      "{{student_name}}": "John Doe",
      "{{roll_number}}": "2024001",
      "{{drive_title}}": emailStatus?.drive_title || "Premium Assessment",
      "{{company_name}}": "Partner AI",
      "{{password}}": "temp_xyz_789",
      "{{login_url}}": window.location.origin + "/student-login",
      "{{start_time}}": examStatus?.scheduled_start
        ? formatDateUTC(examStatus.scheduled_start)
        : formatDateUTC(new Date().toISOString()),
      "{{duration}}": "60",
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(key, "g"), value);
    });

    setPreviewText(preview);
    toast("Preview Generated", { position: "bottom-center" });
  };

  // Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    type: "info",
    customCancelClass: "",
    customConfirmClass: "",
    onConfirm: () => {},
  });

  const [broadcastProgress, setBroadcastProgress] = useState(null);

  const fetchProgress = async () => {
    try {
      const res = await companyService.getDriveEmailProgress(driveId);
      setBroadcastProgress(res.data);

      if (res.data.status === "sending") {
        setTimeout(fetchProgress, 1000);
      } else if (res.data.status === "completed") {
        toast.success(
          `Broadcast successful: ${res.data.sent_count} invitations sent!`
        );
        setIsSendingEmails(false);
        setBroadcastProgress(null);
        await loadData();
      } else if (res.data.status === "failed") {
        toast.error("Email broadcast failed partially or completely.");
        setIsSendingEmails(false);
        await loadData();
      }
    } catch (err) {
      console.error("Progress fetch error:", err);
      // Continue polling unless it's a critical error
      setTimeout(fetchProgress, 2000);
    }
  };

  const handleSendEmails = async () => {
    setModalConfig({
      isOpen: true,
      title: "Broadcast Invitations?",
      message:
        "Are you sure you want to broadcast invitations to all registered candidates? This action will trigger secure email protocols for all pending students.",
      confirmLabel: "Execute",
      type: "info",
      customCancelClass: "bg-[#F8FAFC] py-1 px-3 text-[#64748B] border hover:bg-slate-200",
      customConfirmClass: "bg-blue-600 py-1 px-3 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700",
      onConfirm: async () => {
        setIsSendingEmails(true);
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await companyService.sendEmails(driveId);
          toast("Broadcast initiated...", { icon: "🚀" });
          fetchProgress();
        } catch (err) {
          toast.error(getErrorMessage(err));
          setIsSendingEmails(false);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50 font-['Poppins',_sans-serif]">
        <CompanySidebar />
        <div className="flex-1 flex flex-col">
          {/* <CompanyHeader /> */}
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-6">
              <div className="h-20 w-20 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl font-semibold text-slate-900 tracking-tight animate-pulse uppercase">
                Initiating Comms Protocol...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canSendEmails = emailStatus?.can_send_emails || false;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-['Poppins',_sans-serif]">
      <CompanySidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column - Configuration */}
              <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                {/* Test Details Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Layers className="h-5 w-5 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-[500] text-slate-900 tracking-tight uppercase">
                      Test Details
                    </h3>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Test Name
                      </p>
                      <p className="text-lg font-[500] text-slate-900">
                        {emailStatus?.drive_title || "Senior Frontend Engineer"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Candidate Count
                      </p>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-md font-[500]">
                          {emailStatus?.student_count || 0} Students
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Token Status
                      </p>
                      <div
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full  ${
                          canSendEmails
                            ? "text-blue-600 bg-blue-50 border-blue-100"
                            : "text-slate-400 "
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-[11px] font-[500] uppercase tracking-wider">
                          {canSendEmails
                            ? "Tokens Generated"
                            : "Pending Generation"}
                        </span>
                      </div>
                    </div>

                    {/* System Note */}
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                      <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-100 shrink-0">
                       <img src="/icons/studentNoteIcon.png" alt="" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[14px] font-[600] text-blue-700">
                          System Note
                        </h4>
                        <p className="text-[12px] text-blue-700 leading-relaxed font-medium">
                          Unique exam tokens have been generated by the backend
                          algorithm for all candidates. These links are one-time
                          use only.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Configuration Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-3 pb-1 border-b border-slate-50 flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Mail className="h-5 w-5 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-[600] text-slate-900 tracking-tight uppercase">
                      Email Configuration
                    </h3>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Variable Injection */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                      <div className="flex items-center gap-3">
                        <Code className="h-4 w-4 text-blue-600" />
                        <h4 className="text-[14px] font-[600] text-blue-700">
                          Available Variables
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {templateVariables.map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => {
                              // Insert variable into whichever field last had focus?
                              // For now just toast or log
                              toast.info(`Use ${v} in your template`);
                            }}
                            className="px-4 py-2 bg-white border border-slate-200 text-blue-600 rounded-xl text-[11px] font-[500] transition-all hover:border-blue-600 hover:shadow-md cursor-pointer"
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmitConfig} className="space-y-10">
                      <div className="space-y-6">
                        <label className="text-[12px] mb-3 font-[600] text-[#22293A] uppercase  ml-2">
                          Email Subject
                        </label>
                        <input
                          type="text"
                          value={emailConfig.subject_template}
                          onChange={(e) =>
                            handleConfigChange(
                              "subject_template",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Assessment Invitation for {{drive_title}}"
                          className="w-full px-8 py-3 mt-2 bg-[#0F172A] border-none rounded-[20px] focus:outline-none focus:ring-4 focus:ring-blue-600/20 text-white font-[500] text-lg placeholder:text-slate-500"
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[12px] mb-3 font-[600] text-[#22293A] uppercase  ml-2">
                          Email Body
                        </label>
                        <textarea
                          value={emailConfig.body_template}
                          onChange={(e) =>
                            handleConfigChange("body_template", e.target.value)
                          }
                          rows="12"
                          className="w-full px-8 py-8 mt-2 bg-[#0F172A] border-none rounded-[24px] focus:outline-none focus:ring-4 focus:ring-blue-600/20 text-white font-[500] text-md leading-relaxed resize-none placeholder:text-slate-500"
                          placeholder="Craft your secure invitation message here..."
                          required
                        />
                      </div>

                      <div className="flex items-center gap-3 px-2">
                        <input
                          type="checkbox"
                          id="useCustom"
                          checked={emailConfig.use_custom_template}
                          onChange={(e) =>
                            handleConfigChange(
                              "use_custom_template",
                              e.target.checked
                            )
                          }
                          className="h-5 w-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-600"
                        />
                        <label
                          htmlFor="useCustom"
                          className="text-sm font-[500] text-slate-600 cursor-pointer"
                        >
                          Use Custom Template
                        </label>
                      </div>

                      <div className="flex gap-18 pt-6 justify-center px-12">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-slate-900 text-white py-3 rounded-xl tracking-[0.1em] font-[600] text-[13px] uppercase  shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                          {isSubmitting ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <></> 
                          )}
                          Update Template
                        </button>
                        <button
                          type="button"
                          onClick={generatePreview}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl tracking-[0.1em] font-[600] text-[13px] uppercase  shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                          {/* <Eye className="h-4 w-4" /> */}
                          Generate Preview
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right Column - Preview & Actions */}
              <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[16px] font-[600] text-[#686666] uppercase tracking-[0.1em] ml-2">
                    Live Email Preview
                  </h3>
                  <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
                    <div className="flex-1 p-12 space-y-8 text-slate-700 leading-relaxed overflow-auto">
                      {previewText ? (
                        <div className="whitespace-pre-wrap font-medium">
                          {previewText}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-slate-300">
                          <Mail className="h-20 w-20" />
                          <p className="text-sm font-[500] uppercase tracking-widest">
                            Hit "Generate Preview" to visualize your protocol
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Mock Footer as seen in image */}
                    {previewText && (
                      <div className="p-8 border-t border-slate-50 text-[11px] text-slate-400 font-medium space-y-1">
                        <p>
                          -----------------------------------------------------------
                        </p>
                        <p>
                          This is an automated email. Please do not reply to
                          this message.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Stats & Final Actions Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Test Name
                      </p>
                      <p className="text-md font-[500] text-slate-900">
                        {emailStatus?.drive_title || "Senior Frontend Engineer"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Exam Status
                      </p>
                      <div
                        className={`px-4 py-1 rounded-full text-[10px] font-[500] uppercase tracking-widest ${
                          examStatus?.exam_state === "live"
                            ? "bg-emerald-50 text-emerald-600"
                            : examStatus?.exam_state === "completed"
                            ? "bg-slate-50 text-slate-400"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {examStatus?.exam_state || "Not Started"}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Student Count
                      </p>
                      <div className="flex items-center gap-2 text-slate-900 font-[500]">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>{emailStatus?.student_count || 0} Students</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-50">
                    <button
                      onClick={() =>
                        navigate(`/company-drive-detail?id=${driveId}`)
                      }
                      className="flex-1 px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-xl font-[500] text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendEmails}
                      disabled={
               
                        drive?.status !== "upcoming"
                      }
                      className="flex-[2] px-4 py-4 bg-blue-600 text-white rounded-xl font-[500] text-[14px]  shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                  
                      <Send className="h-4 w-4" />
                      {isSendingEmails
                        ? "Broadcasting..."
                        : drive?.status !== "upcoming"
                        ? "Upcoming Drives Only"
                        : "Send to all Candidates"}
                    </button>
                  </div>
                </div>

                {/* Return Dashboard Action */}
                <button
                  onClick={() => navigate("/company-dashboard")}
                  className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-[500] text-[16px] uppercase  flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/30 hover:bg-slate-800 transition-all active:scale-98"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </button>
              </div>
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
        customCancelClass={modalConfig.customCancelClass}
        customConfirmClass={modalConfig.customConfirmClass}
      />
    </div>
  );
}
