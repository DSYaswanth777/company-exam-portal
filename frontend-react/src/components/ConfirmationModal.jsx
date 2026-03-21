import React from "react";
import { X, AlertTriangle, CheckCircle, Info } from "lucide-react";

/**
 * ConfirmationModal - A high-fidelity, sleek modal for confirming critical actions.
 * Replaces window.confirm with a premium UI experience.
 */
export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "warning", // 'warning', 'success', 'info'
  isLoading = false,
  customCancelClass = "",
  customConfirmClass = "",
}) {
  if (!isOpen) return null;

  const typeConfigs = {
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
      iconBg: "bg-amber-50",
      buttonBg: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20",
    },
    success: {
      icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
      iconBg: "bg-emerald-50",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
    },
    info: {
      icon: <Info className="h-6 w-6 text-blue-600" />,
      iconBg: "bg-blue-50",
      buttonBg: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
    },
  };

  const config = typeConfigs[type] || typeConfigs.warning;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div
              className={`h-14 w-14 ${config.iconBg} rounded-xl flex items-center justify-center`}
            >
              {config.icon}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
            {title}
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            {message}
          </p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold text-[13px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 ${customCancelClass}`}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-6 py-4 ${config.buttonBg} text-white rounded-xl font-semibold text-[13px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 ${customConfirmClass}`}
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
