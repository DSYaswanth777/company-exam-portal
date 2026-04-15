import React from "react";
import { ClipboardCheck } from "lucide-react";

export default function SubmitExamModal({
  isOpen,
  onClose,
  onSubmit,
  answeredCount,
  totalCount,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] w-full max-w-[540px] p-12 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        {/* Icon Circle */}
        <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center mb-8">
          <ClipboardCheck className="h-10 w-10 text-[#2563EB]" />
        </div>

        {/* Title */}
        <h2 className="text-[32px] font-bold text-[#1E293B] mb-6">
          Submit Assessment?
        </h2>

        {/* Description */}
        <p className="text-slate-500 text-md leading-relaxed mb-10 max-w-[420px]">
          You have answered{" "}
          <span className="text-[#2563EB] font-bold">
            {answeredCount} out of {totalCount}
          </span>{" "}
          questions. Once submitted, you cannot go back to change your answers.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-2 py-4.5 rounded-xl border-2 border-slate-100 text-slate-500 font-bold text-sm uppercase tracking-wider hover:bg-slate-50 transition-colors"
          >
            CANCEL & REVIEW
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-2 py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            CONFIRM SUBMISSION
          </button>
        </div>
      </div>
    </div>
  );
}
