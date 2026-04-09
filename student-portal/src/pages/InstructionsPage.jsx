import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  HelpCircle,
  Trophy,
  CheckCircle,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import studentService from "../services/studentService";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

export default function InstructionsPage() {
  const [acknowledged, setAcknowledged] = useState(false);
  const { student, logout } = useAuth();
  const [driveDetails, setDriveDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!student) {
      navigate("/login");
      return;
    }
    loadDriveDetails();
  }, [student, navigate]);

  const loadDriveDetails = async () => {
    try {
      const res = await studentService.getDriveInfo();
      setDriveDetails(res.data);
    } catch (err) {
      console.error("Failed to load drive details:", err);
      toast.error("Failed to load exam details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExam = async () => {
    if (acknowledged) {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        }
      } catch (err) {
        console.warn("Fullscreen request failed:", err);
      }

      if (driveDetails?.status === "live") {
        navigate("/exam");
      } else {
        navigate("/waiting-room");
      }
    }
  };

  const rules = [
    "No external devices or textbooks allowed in the workspace.",
    "Remain in full-screen mode at all times. Tabbing out will trigger an alert.",
    "The exam will be recorded via webcam for proctoring purposes.",
    "Ensure a quiet, well-lit environment and a stable internet connection.",
    "Do not switch tabs or minimize the browser window.",
    "Your answers are automatically saved as you go.",
    "You can mark questions for review and navigate freely.",
    "Alerts: Excessive violations will result in disqualification.",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col py-12 px-4 sm:px-6 lg:px-8 font-['Poppins',_sans-serif]">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Exam Instructions
            </h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">
              {driveDetails?.title || "Loading Assessment..."}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-bold uppercase tracking-wider shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Duration", value: `${driveDetails?.exam_duration_minutes || "--"} Mins`, icon: Clock, color: "text-[#2563EB]", bg: "bg-blue-50" },
            { label: "Questions", value: driveDetails?.total_questions || "--", icon: HelpCircle, color: "text-[#16A34A]", bg: "bg-emerald-50" },
            { label: "Points", value: driveDetails?.total_marks || "--", icon: Trophy, color: "text-[#EAB308]", bg: "bg-yellow-50" },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} p-8 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all duration-300 group`}>
              <div className={`flex items-center gap-3 ${item.color} mb-4`}>
                <item.icon className="h-6 w-6 transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  {item.label}
                </span>
              </div>
              <div className="text-4xl font-bold text-slate-900 tracking-tight">
                {isLoading ? (
                  <div className={`h-10 w-24 ${item.bg === 'bg-blue-50' ? 'bg-blue-100' : item.bg === 'bg-emerald-50' ? 'bg-emerald-100' : 'bg-yellow-100'} animate-pulse rounded-xl`}></div>
                ) : (
                  item.value
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Rules Section */}
        <div className="bg-white p-12 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <ClipboardList className="h-64 w-64 -mr-16 -mt-16 rotate-12" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Rules & Requirements
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mb-16">
              {rules.map((rule, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="mt-1">
                    <div className="h-6 w-6 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                      <CheckCircle className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  <p className="text-slate-600 text-[15px] leading-relaxed font-medium">{rule}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center">
              <label className="flex items-start gap-5 cursor-pointer mb-12 group max-w-3xl text-center bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all">
                <div className="relative mt-1 shrink-0">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                  />
                  <div className="h-7 w-7 border-2 border-slate-300 rounded-xl peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] transition-all shadow-sm"></div>
                  <CheckCircle className="absolute inset-0 h-7 w-7 text-white scale-0 peer-checked:scale-75 transition-transform duration-200" />
                </div>
                <span className="text-[15px] text-slate-600 select-none font-medium leading-relaxed">
                  I hereby acknowledge that I have read and understood the exam
                  instructions and rules. I agree to abide by the Honor Code and
                  maintain academic integrity throughout this assessment.
                </span>
              </label>

              <button
                onClick={handleStartExam}
                disabled={!acknowledged}
                className={`flex items-center gap-3 font-bold py-5 px-16 rounded-[1.25rem] transition-all duration-300 shadow-2xl uppercase tracking-widest text-[15px] ${
                  acknowledged
                    ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/30 scale-100 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                Start Examination
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="mt-6 text-sm text-slate-400 font-medium">
                The timer will begin as soon as you click "Start Examination".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
