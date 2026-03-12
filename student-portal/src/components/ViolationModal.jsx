import React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function ViolationModal({ isOpen, onClose, violationCount }) {
  if (!isOpen) return null;

  const getViolationData = () => {
    switch (violationCount) {
      case 1:
        return {
          title: "First Warning",
          remaining: "2 violations remaining before disqualification.",
          message:
            "You switched tabs, exited full screen, or right-clicked. This is your first warning.",
          buttonText: "Continue Exam",
          buttonClass: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30",
        };
      case 2:
        return {
          title: "Final Warning",
          remaining: "1 violation remaining before disqualification.",
          message:
            "This is your final warning. Any further violation will result in immediate disqualification.",
          buttonText: "Continue Exam",
          buttonClass: "bg-red-600 hover:bg-red-700 shadow-red-500/30",
        };
      default:
        return {
          title: "Violation Detected",
          remaining: "Please maintain integrity to avoid disqualification.",
          message:
            "Please maintain full-screen mode and stay on the active exam tab.",
          buttonText: "Continue Exam",
          buttonClass: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30",
        };
    }
  };

  const data = getViolationData();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 md:p-12">
          {/* Header with Icon */}
          <div className="flex items-center gap-6 mb-8">
            <div
              className={`h-16 w-16 rounded-xl flex items-center justify-center shrink-0 ${violationCount === 4 ? "bg-red-50" : "bg-orange-50"}`}
            >
              <AlertCircle
                className={`h-10 w-10 ${violationCount === 4 ? "text-red-500" : "text-orange-500"}`}
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 leading-tight">
                {data.title}
              </h2>
              <p className="text-gray-500 font-semibold uppercase tracking-wider text-xs mt-1">
                Violation Detected
              </p>
            </div>
          </div>

          {/* Warning Content */}
          <div className="space-y-6 mb-10">
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              {data.message}
            </p>

            <div className="flex items-center gap-3 py-3 px-4 bg-white border border-gray-100 rounded-xl">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-500 font-bold text-sm">{data.remaining}</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-orange-400">
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                Note:{" "}
                {violationCount === 4
                  ? "Your activities are being recorded. Please adhere to the exam rules."
                  : "Please maintain full-screen mode and stay on the active exam tab."}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`flex items-center gap-2 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg active:scale-[0.98] ${data.buttonClass}`}
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
