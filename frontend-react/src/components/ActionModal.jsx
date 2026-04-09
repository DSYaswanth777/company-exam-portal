import React from "react";
import { CheckCircle2, XCircle, Ban, AlertCircle } from "lucide-react";

const ActionModal = ({
  isOpen,
  type = "approve",
  companyName = "NexGen Cloud Solutions",
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const configs = {
    approve: {
      title: "Approve Company?",
      description: (
        <>
          Are you sure you want to approve <strong>{companyName}?</strong> This
          will grant them access to create exam drives and manage candidates on
          the platform.
        </>
      ),
      icon: (
        <CheckCircle2 strokeWidth={1.8} className="h-5 w-5 text-blue-500" />
      ),
      iconBg: "bg-blue-50",
      confirmBg: "bg-blue-500 hover:bg-blue-600",
      confirmShadow: "shadow-blue-200",
      confirmLabel: "Approve",
    },
    reject: {
      title: "Reject Company?",
      description: (
        <>
          Are you sure you want to reject <strong>{companyName}?</strong> This
          will decline their registration request. They will not be able to
          access the platform.
        </>
      ),
      icon: <XCircle strokeWidth={1.8} className="h-5 w-5 text-red-500" />,
      iconBg: "bg-red-50",
      confirmBg: "bg-red-500 hover:bg-red-600",
      confirmShadow: "shadow-red-200",
      confirmLabel: "Reject",
    },
    suspend: {
      title: "Suspend Company?",
      description: (
        <>
          Are you sure you want to suspend <strong>{companyName}?</strong> This
          will suspend their access. They will not be able to access the
          platform.
        </>
      ),
      icon: <Ban strokeWidth={1.8} className="h-5 w-5 text-red-500" />,
      iconBg: "bg-red-50",
      confirmBg: "bg-red-500 hover:bg-red-600",
      confirmShadow: "shadow-red-200",
      confirmLabel: "Suspend",
    },
    revoke: {
      title: "Revoke Approve?",
      description: (
        <>
          Are you sure you want to revoke <strong>{companyName}?</strong> This
          will remove their existing access. All active drives for this company
          will be suspended.
        </>
      ),
      icon: (
        <AlertCircle strokeWidth={1.8} className="h-5 w-5 text-orange-500" />
      ),
      iconBg: "bg-orange-50",
      confirmBg: "bg-orange-500 hover:bg-orange-600",
      confirmShadow: "shadow-orange-200",
      confirmLabel: "Revoke",
    },
  };

  const config = configs[type] || configs.approve;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop with premium blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-[440px] bg-white rounded-[32px] overflow-hidden shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] border border-slate-100 animate-in zoom-in-95 duration-300"
      >
        <div className="p-10">
          {/* Icon Header */}
          <div
            className={`flex items-center justify-center rounded-2xl mb-8 ${config.iconBg} w-14 h-14 shadow-sm`}
          >
            {config.icon}
          </div>

          {/* Text Content */}
          <div className="space-y-4 mb-10">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {config.title}
            </h2>
            <p className="text-[15px] text-slate-500 leading-relaxed font-medium">
              {config.description}
            </p>
          </div>

          {/* Premium Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:flex-1 h-14 flex items-center justify-center font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all duration-200 disabled:opacity-50 cursor-pointer text-[15px] uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full sm:flex-1 h-14 flex items-center justify-center font-bold text-white ${config.confirmBg} rounded-2xl transition-all duration-300 shadow-xl ${config.confirmShadow} hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer text-[15px] uppercase tracking-wider gap-2`}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                config.confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
