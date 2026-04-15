import React, { useState } from "react";
import { CheckCircle2, X, AlertCircle } from "lucide-react";

/**
 * ResolutionModal - A sleek modal for resolving support tickets with notes.
 */
export default function ResolutionModal({
  isOpen,
  onClose,
  onConfirm,
  ticketId,
  isLoading = false,
}) {
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    onConfirm(notes);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <CheckCircle2
                className="h-7 w-7 text-emerald-600"
                strokeWidth={1.5}
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Resolve Ticket #{ticketId}
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Please provide the resolution details. This will be visible to the
              company.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="resolution_notes"
                className="block text-[14px] font-[500] text-slate-700 uppercase tracking-widest mb-3"
              >
                Resolution Notes
              </label>
              <textarea
                id="resolution_notes"
                required
                rows={3}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                placeholder="Ex: The issue was caused by a misconfiguration. It has been resolved and verified."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-8 py-4 bg-white border border-slate-100 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isLoading || !notes.trim()}
                className="flex-[1.5] px-4 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm Resolution
                    <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
