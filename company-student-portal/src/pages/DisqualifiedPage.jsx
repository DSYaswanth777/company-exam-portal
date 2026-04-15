import { useNavigate, useLocation } from "react-router-dom";
import { Slash, ShieldCheck, History, ArrowRight, Info } from "lucide-react";
import { TbCancel } from "react-icons/tb";

export default function DisqualifiedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reason } = location.state || {
    reason:
      "System detected excessive activity beyond the permitted integrity limit.",
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-poppins">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side: Disqualification Info */}
        <div className="flex-1 p-10 md:p-16 border-b md:border-b-0 md:border-r border-gray-50 flex flex-col items-start text-start justify-center">
          <div className="h-18 w-18 bg-red-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-red-200">
        <TbCancel className="text-white" size={38} />

          </div>

          <h1 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
            You have been
            <br />
            disqualified.
          </h1>

          <div className="flex items-center gap-2 mb-12">
            <div className="h-px w-8 bg-red-200"></div>
            <span className="text-red-500 font-bold uppercase tracking-widest text-xs">
              Violation Detected
            </span>
            <div className="h-px w-8 bg-red-200"></div>
          </div>

          <div className="w-full bg-[#1E293B] rounded-3xl p-8 text-left relative overflow-hidden group">
            {/* Abstract background icon */}
            <div className="absolute top-4 right-4 text-white/5 group-hover:text-white/10 transition-colors">
              <Slash className="h-20 w-20" />
            </div>

            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-4">
              Violation Reason
            </label>
            <p className="text-white text-lg font-bold leading-relaxed relative z-10">
              {reason}
            </p>
          </div>
        </div>

        {/* Right Side: Security Report */}
        <div className="flex-1 p-10 md:p-16 bg-white flex flex-col">
          <h2 className="text-[18px] font-[600] text-gray-900 uppercase tracking-[0.1em] mb-10">
            Session Security Report
          </h2>

          <div className="space-y-6 flex-grow">
            {/* Help Note */}
            <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 flex gap-4 items-start">
              <Info className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-gray-500 text-[14px] leading-relaxed font-[400]">
                If you believe this was a technical error, please contact your
                company.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Integrity Info */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <ShieldCheck className="h-6 w-6 text-red-500 mb-4" />
                <h3 className="text-[16px] font-[600] text-gray-900 uppercase tracking-wider mb-2">
                  Integrity Info
                </h3>
                <p className="text-gray-400 text-[14px] leading-relaxed font-[400">
                  The system monitors tab switching and Screen manipulation.
                </p>
              </div>

              {/* Log Status */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <History className="h-6 w-6 text-blue-500 mb-4" />
                <h3 className="text-[16px] font-[600] text-gray-900 uppercase tracking-wider mb-2">
                  Log Status
                </h3>
                <p className="text-gray-400 text-[14px] leading-relaxed font-[400">
                  Session metrics logged and forwarded to examiners.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate("/login")}
            className="w-full mt-12 bg-[#334155] hover:bg-[#1E293B] text-white font-semibold py-5 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 group active:scale-[0.98]"
          >
            RETURN TO LOGIN
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
