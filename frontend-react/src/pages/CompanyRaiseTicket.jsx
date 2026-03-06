import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LifeBuoy,
  Send,
  CheckCircle,
  Info,
  LayoutDashboard,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import companyService from "../services/companyService";
import CompanySidebar from "../components/CompanySidebar";

/**
 * CompanyRaiseTicket - High-fidelity screen for raising support tickets.
 * Matches the design with custom priority buttons and a clean layout.
 */
export default function CompanyRaiseTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "technical",
    priority: "medium",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.description) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    console.log("Raising ticket with payload:", newTicket);
    try {
      const res = await companyService.createTicket(newTicket);
      console.log("Ticket creation response:", res.data);
      // Assuming response contains id or ticket_id
      const id =
        res.data?.id ||
        res.data?.ticket_id ||
        Math.floor(1000 + Math.random() * 9000);
      setTicketId(`#TKT-${id}`);
      setSubmitted(true);
      toast.success("Support ticket raised successfully");
    } catch (err) {
      console.error(
        "Ticket creation failed:",
        err.response?.data || err.message,
      );
      toast.error(
        `Failed to raise ticket: ${err.response?.data?.detail || "Please try again."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    {
      id: "low",
      label: "LOW",
      activeClass: "border-slate-200 text-slate-400 bg-white",
      selectedClass: "border-blue-200 bg-blue-50 text-blue-600 shadow-sm",
    },
    {
      id: "medium",
      label: "MEDIUM",
      activeClass: "border-slate-200 text-slate-400 bg-white",
      selectedClass: "border-orange-200 bg-orange-50 text-orange-600 shadow-sm",
    },
    {
      id: "high",
      label: "HIGH",
      activeClass: "border-slate-200 text-slate-400 bg-white",
      selectedClass: "border-red-200 bg-red-50 text-red-600 shadow-sm",
    },
  ];

  return (
    <div className="flex h- bg-slate-50 font-['Poppins',_sans-serif]">
      <CompanySidebar />
      <div className="flex-1 flex flex-col overflow-hidden items-center justify-center p-6 bg-[#f8fafc]/50">
        {/* Header Content */}
        <div className="text-center space-y-4 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <LifeBuoy className="h-5 w-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Support Center
            </span>
          </div>
          <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">
            Raise a Ticket
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Encountering issues? Tell us what's happening and we'll help.
          </p>
        </div>

        {/* Success Screen or Form Card */}
        <div className="w-full max-w-3xl bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-200 p-8 animate-in zoom-in-95 duration-500">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Category and Priority Row */}
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[12px] font-bold text-slate-600  uppercase tracking-widest pl-1">
                    Issue Category
                  </label>
                  <div className="relative group">
                    <select
                      className="w-full appearance-none px-6 py-5 bg-[#f8fafc] border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-slate-700 cursor-pointer"
                      value={newTicket.category}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, category: e.target.value })
                      }
                    >
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing Inquiry</option>
                      <option value="drive">Drive Management</option>
                      <option value="general">General Support</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600  group-hover:text-slate-600 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[12px] font-bold text-slate-600  uppercase tracking-widest pl-1">
                    Priority Level
                  </label>
                  <div className="flex gap-3 mt-2">
                    {priorityOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setNewTicket({ ...newTicket, priority: opt.id })
                        }
                        className={`flex-1 py-5 rounded-2xl border-2 text-[10px] font-bold tracking-widest transition-all duration-300 ${
                          newTicket.priority === opt.id
                            ? opt.selectedClass
                            : opt.activeClass
                        } hover:scale-[1.02] active:scale-95`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subject Label */}
              <div className="space-y-4">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest pl-1">
                  Subject Label
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-8 mt-3 py-5 bg-[#f8fafc] border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-500"
                  placeholder="e.g., Cannot upload candidate list for tomorrow's drive"
                  value={newTicket.title}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, title: e.target.value })
                  }
                />
              </div>

              {/* Detailed Description */}
              <div className="space-y-4">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest pl-1">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-8 mt-3 py-6 bg-[#f8fafc] border border-slate-200 rounded-[24px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-500 resize-none leading-relaxed"
                  placeholder="Provide as much detail as possible to help us resolve this quickly..."
                  value={newTicket.description}
                  minLength={10}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/company-tickets")}
                  className="px-8 py-4 border border-slate-200 rounded-2xl text-[16px] font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95 bg-white"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  {loading ? "Submitting..." : "Submit Ticket"}
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="py-6 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
              {/* Success Icon */}
              <div className="w-18 h-18 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle
                  className="h-8 w-8 text-green-500"
                  strokeWidth={1.5}
                />
              </div>

              {/* Success Text */}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Ticket Raised Successfully!
                </h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                  Your support ticket{" "}
                  <span className="text-blue-600 font-bold">{ticketId}</span>{" "}
                  has been registered. Our technical team will review the
                  details and get back to you within the SLA period.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-16 w-full pt-">
                <button
                  onClick={() => navigate("/company-tickets")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <Eye className="h-4 w-4" />
                  VIEW TICKET STATUS
                </button>
                <button
                  onClick={() => navigate("/company-dashboard")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all active:scale-95"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  BACK TO DASHBOARD
                </button>
              </div>

              {/* Footer Info */}
              <div className="pt-4 flex items-center gap-2 text-slate-400">
                <Info className="h-4 w-4" />
                <span className="text-[12px] font-[500] uppercase tracking-[0.1em]">
                  A support ticket has been sent to admin successfully
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
