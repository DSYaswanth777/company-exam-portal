import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Trophy } from "lucide-react";
import studentService from "../services/studentService";
import { formatDateUTC } from "../utils/timezone";
import { useAuth } from "../contexts/AuthContext";

export default function ResultPage() {
  const navigate = useNavigate();
  const { student } = useAuth();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!student) {
      navigate("/login");
      return;
    }
    loadResult();
  }, [student, navigate]);

  const loadResult = async () => {
    try {
      const res = await studentService.getResults();
      setResult(res.data);
    } catch (err) {
      console.error("Failed to load result", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-[500px] bg-white rounded-xl shadow-xl p-10 md:p-14 border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        {/* Success Icon */}
        <div className="h-18 w-18 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Text content */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-4 tracking-tight">
          Submission Successful!
        </h1>
        <p className="text-gray-500 text-[16px] font-[400] leading-relaxed  mb-10">
          Your assessment has been securely recorded.{" "}
          <br className="hidden sm:block" /> No further action is needed from
          you.
        </p>

        {/* Info Box */}
        <div className="w-full bg-[#F8FAFC] rounded-xl p-8 mb-10 border border-gray-100/50 space-y-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-400">Student</span>
            <span className="text-gray-700 font-bold truncate max-w-[200px]">
              {student?.name || "..."}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-400">Submitted At</span>
            <span className="text-gray-700 font-bold">
              {result ? formatDateUTC(result.submitted_at) : "..."}
            </span>
          </div>
          {result && (
            <div className="flex justify-between items-center text-sm font-medium pt-4 border-t border-slate-100">
              <span className="text-gray-400">Your Score</span>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-orange-400" />
                <span className="text-blue-600 font-semibold text-lg">
                  {result.score} / {result.total_marks}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-[500] py-4.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30 group"
        >
          Return to Home Page
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-8 text-[14px] text-gray-400 font-[500] tracking-wide">
          You can safely close this window now.
        </p>
      </div>
    </div>
  );
}
