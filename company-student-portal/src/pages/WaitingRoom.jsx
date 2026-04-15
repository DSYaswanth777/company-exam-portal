import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Hourglass,
  User,
  Mail,
  Shield,
  HelpCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import studentService from "../services/studentService";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import EssentialRegulations from "/EssentialRegulations.png";
export default function WaitingRoom() {
  const navigate = useNavigate();
  const { student, logout } = useAuth();
  const [driveInfo, setDriveInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!student) {
      navigate("/login");
      return;
    }
    loadDriveInfo();
    const interval = setInterval(loadDriveInfo, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [student, navigate]);

  const loadDriveInfo = async () => {
    try {
      const res = await studentService.getDriveInfo();
      setDriveInfo(res.data);

      // if (res.data.status === "live") {
      //   navigate("/exam");
      //   return;
      // }

      if (res.data.window_start) {
        let dateStr = res.data.window_start;
        if (dateStr && !dateStr.endsWith("Z") && !dateStr.includes("+")) {
          dateStr += "Z";
        }

        const start = new Date(dateStr);
        const now = new Date();
        const diffMs = start.getTime() - now.getTime();

        if (diffMs > 0) {
          const totalSecs = Math.floor(diffMs / 1000);
          setTimeLeft({
            hours: Math.floor(totalSecs / 3600),
            minutes: Math.floor((totalSecs % 3600) / 60),
            seconds: totalSecs % 60,
          });
        } else {
          if (res.data.actual_window_start || res.data.status === "live") {
            // navigate("/exam"); // DISABLED AUTO-START
          } else {
            // Reset timer if we hit 0 but not live yet
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
          }
        }
      }
    } catch (err) {
      // Don't toast on background refresh errors unless persistent
      console.error("Failed to load drive information", err);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            } else {
              return prev; // Stay at 0
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const regulations = [
    {
      text: "The exam will open in full screen mode. Do not exit full screen.",
      color: "text-gray-600",
    },
    {
      text: "Right-clicking and taking screenshots are restricted.",
      color: "text-gray-600",
    },
    {
      text: "You can mark questions for review and navigate freely.",
      color: "text-gray-600",
    },
    {
      text: "Do not switch tabs or minimize the browser window.",
      color: "text-gray-600",
    },
    {
      text: "Your answers are automatically saved as you go.",
      color: "text-gray-600",
    },
    {
      text: "Alerts: Excessive violations will result in disqualification.",
      color: "text-red-500 font-semibold",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-[600] text-[#111827]">
            {driveInfo?.title || "Assessment..."}
          </h1>
          <p className="text-[#686666] font-[300] text-[16px] mt-1">
            Hello, {student?.name || "Candidate"}. Please review the
            instructions while we prepare your exam window.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-grow space-y-8">
            {/* Waiting Card */}
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="h-20 w-20 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Hourglass className="h-10 w-10 text-orange-400" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {driveInfo?.status === "ended"
                      ? "The exam has ended"
                      : driveInfo?.status === "live"
                        ? "Examination is Live"
                        : "Waiting for Exam Window"}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {driveInfo?.status === "ended"
                      ? "You can no longer start this assessment."
                      : driveInfo?.status === "live"
                        ? "You can now start the examination manually."
                        : "The secure browser link will activate manually when the window opens."}
                  </p>
                </div>
              </div>

              {driveInfo?.status === "live" ? (
                <div className="mt-10 flex justify-center md:justify-start">
                  <button
                    onClick={() => navigate("/instructions")}
                    className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-blue-500/30 group"
                  >
                    Start Exam Now
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : driveInfo?.status === "ended" ? (
                <div className="mt-10 bg-red-50 p-6 rounded-xl border border-red-100 flex items-center gap-4">
                  <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-red-900 font-bold">
                      Registration Closed
                    </h3>
                    <p className="text-red-700 text-sm">
                      This assessment has concluded. Please contact your
                      coordinator for details.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6 mt-10 max-w-2xl mx-auto md:mx-0">
                  <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <div className="text-4xl font-semibold text-gray-900">
                      {timeLeft.hours}
                    </div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider font-semibold mt-1">
                      Hours
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <div className="text-4xl font-semibold text-gray-900">
                      {timeLeft.minutes}
                    </div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider font-semibold mt-1">
                      Minutes
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <div className="text-4xl font-semibold text-gray-900">
                      {timeLeft.seconds}
                    </div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider font-semibold mt-1">
                      Seconds
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Essential Regulations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-white px-8 py-4 border-b border-gray-200 flex items-center gap-3">
                <img src={EssentialRegulations} alt="" />
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                  Essential Regulations
                </h2>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {regulations.map((reg, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                      <p
                        className={`text-[14px] leading-relaxed text-[#686666]  ${reg.color} font-[400]`}
                      >
                        {reg.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-[380px] shrink-0 space-y-8">
            {/* Candidate Info */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                  Candidate Info
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Registered Email
                  </label>
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-700 font-medium text-sm truncate">
                    {student?.email || "..."}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                      Access Drive
                    </label>
                    <div className="bg-gray-50 p-4 rounded-xl text-blue-600 font-bold text-xs uppercase tracking-wider">
                      {driveInfo?.category || "..."}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                      Status
                    </label>
                    <div className="bg-green-50 p-4 rounded-xl text-green-600 font-bold text-[10px] uppercase tracking-wider">
                      {driveInfo?.status || "..."}
                    </div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30 mt-4 group"
                >
                  Logout
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Support Node */}
            <div className="bg-[#F8FAFC] p-8 rounded-xl border border-gray-100 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wide">
                  Support Node
                </h2>
              </div>
              <ul className="space-y-4">
                {[
                  "You're all set! Your exam will begin automatically.",
                  "Please stay on this page and do not refresh, close, or switch tabs.",
                  "Keep watching the screen for the exam start message.",
                  "Ensure your internet connection is stable.",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-xs text-gray-500 leading-relaxed font-medium"
                  >
                    <span className="text-gray-300">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
