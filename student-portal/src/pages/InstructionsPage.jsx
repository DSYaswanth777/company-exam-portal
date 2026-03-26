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
    "Remain in full-screen mode at all times. Tabbing out will trigger a warning.",
    "The exam will be recorded via webcam for proctoring purposes.",
    "Ensure a quiet, well-lit environment and a stable internet connection.",
    "Do not switch tabs or minimize the browser window.",
    "Your answers are automatically saved as you go.",
    "You can mark questions for review and navigate freely.",
    "Warning: Excessive violation will result in disqualification.",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#111827]">
              EXAM INSTRUCTIONS
            </h1>
            <p className="text-gray-500 mt-1">
              {driveDetails?.title || "Loading..."}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#f0f4ff] p-8 rounded-xl border border-blue-50/50">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Duration
              </span>
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              {isLoading ? (
                <div className="h-9 w-24 bg-blue-100 animate-pulse rounded"></div>
              ) : (
                `${driveDetails?.exam_duration_minutes || "--"} Mins`
              )}
            </div>
          </div>

          <div className="bg-[#f0f4ff] p-8 rounded-xl border border-blue-50/50">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <HelpCircle className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Questions
              </span>
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              {isLoading ? (
                <div className="h-9 w-16 bg-blue-100 animate-pulse rounded"></div>
              ) : (
                driveDetails?.total_questions || "--"
              )}
            </div>
          </div>

          <div className="bg-[#f0f4ff] p-8 rounded-xl border border-blue-50/50">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Points
              </span>
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              {isLoading ? (
                <div className="h-9 w-16 bg-blue-100 animate-pulse rounded"></div>
              ) : (
                driveDetails?.total_marks || "--"
              )}
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 mb-10">
          <div className="flex items-center gap-3 mb-8">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Rules & Requirements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
            {rules.map((rule, index) => (
              <div key={index} className="flex gap-4">
                <div className="mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-500 shrink-0" />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center">
            <label className="flex items-center gap-4 cursor-pointer mb-10 group max-w-2xl text-center">
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                />
                <div className="h-6 w-6 border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                <CheckCircle className="absolute inset-0 h-6 w-6 text-white scale-0 peer-checked:scale-75 transition-transform duration-200" />
              </div>
              <span className="text-sm text-gray-600 select-none">
                I hereby acknowledge that I have read and understood the exam
                instructions and rules. I agree to abide by the Honor Code and
                maintain academic integrity throughout this assessment.
              </span>
            </label>

            <button
              onClick={handleStartExam}
              disabled={!acknowledged}
              className={`flex items-center gap-2 font-bold py-4 px-12 rounded-xl transition-all shadow-lg ${
                acknowledged
                  ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/30"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Start Exam
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="mt-4 text-xs text-gray-400">
              The timer will begin as soon as you click "Start Exam".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
