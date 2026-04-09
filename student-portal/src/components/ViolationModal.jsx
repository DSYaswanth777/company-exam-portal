import React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function ViolationModal({ isOpen, onClose, violationCount }) {
  if (!isOpen) return null;

  const getViolationData = () => {
    switch (violationCount) {
      case 1:
        return {
          title: "First Alert",
          remaining: "2 violations remaining before disqualification.",
          message:
            "System detected a tab switch, full-screen exit, or unauthorized interaction. This is your first alert.",
          buttonText: "Continue Assessment",
          buttonClass: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30",
        };
      case 2:
        return {
          title: "Final Alert",
          remaining: "1 violation remaining before disqualification.",
          message:
            "This is your final alert. Any further violation will lead to immediate disqualification and drive suspension.",
          buttonText: "Return to Exam",
          buttonClass: "bg-red-600 hover:bg-red-700 shadow-red-500/30",
        };
      default:
        return {
          title: "Violation Alert",
          remaining: "Please maintain integrity to avoid disqualification.",
          message:
            "Please maintain full-screen mode and stay on the active exam tab at all times.",
          buttonText: "Continue Assessment",
          buttonClass: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30",
        };
    }
  };

  const data = getViolationData();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-[520px] bg-white rounded-[32px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 md:p-12">
          {/* Header with Icon */}
          <div className="flex items-center gap-6 mb-10">
            <div
              className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${violationCount >= 2 ? "bg-red-50" : "bg-amber-50"}`}
            >
              <AlertCircle
                className={`h-10 w-10 ${violationCount >= 2 ? "text-red-500" : "text-amber-500"}`}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                {data.title}
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
                Security Alert System
              </p>
            </div>
          </div>

          {/* Alert Content */}
          <div className="space-y-8 mb-12">
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              {data.message}
            </p>

            <div className={`flex items-center gap-4 py-4 px-6 bg-white border rounded-2xl transition-colors ${violationCount >= 2 ? 'border-red-100 bg-red-50/30' : 'border-amber-100 bg-amber-50/30'}`}>
              <AlertCircle className={`h-6 w-6 shrink-0 ${violationCount >= 2 ? 'text-red-500' : 'text-amber-500'}`} />
              <p className={`font-bold text-sm leading-tight ${violationCount >= 2 ? 'text-red-600' : 'text-amber-600'}`}>
                {data.remaining}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0 animate-pulse" />
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  <span className="text-slate-900 font-bold">Standard Protocol:</span>{" "}
                  {violationCount >= 2
                    ? "Your activities are strictly being recorded. Please adhere to the honor code to finish your test."
                    : "Please maintain full-screen mode and focus on the current browser tab."}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex">
            <button
              onClick={onClose}
              className={`w-full flex items-center justify-center gap-3 text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-xl hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs ${data.buttonClass}`}
            >
              {data.buttonText}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
