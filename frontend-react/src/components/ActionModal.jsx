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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Card */}
      <div
        className="relative w-full bg-white rounded-xl overflow-hidden"
        style={{
          maxWidth: "420px",
          padding: "28px 28px 24px 28px",
          boxShadow: "0 4px 32px 0 rgba(30,40,80,0.10)",
        }}
      >
        {/* Icon */}
        <div
          className={`flex items-center justify-center rounded-xl mb-5 ${config.iconBg}`}
          style={{ width: 44, height: 44 }}
        >
          {config.icon}
        </div>

        {/* Title */}
        <h2
          className="text-slate-900 font-bold mb-2"
          style={{
            fontSize: "18px",
            lineHeight: "1.3",
            letterSpacing: "-0.01em",
          }}
        >
          {config.title}
        </h2>

        {/* Description */}
        <p
          className="text-slate-500 mb-7"
          style={{ fontSize: "14px", lineHeight: "1.6" }}
        >
          {config.description}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            style={{
              borderRadius: "14px",
              padding: "15px 0",
              fontSize: "15px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 font-semibold text-white ${config.confirmBg} transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2`}
            style={{
              borderRadius: "14px",
              padding: "15px 0",
              fontSize: "15px",
              boxShadow: "0 6px 20px 0 rgba(59,130,246,0.35)",
            }}
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              config.confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
