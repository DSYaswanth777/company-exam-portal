import React, { useState, useEffect } from "react";
import {
  Send,
  Building2,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  Info,
  ChevronDown,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import adminService from "../services/adminService";
import { toast } from "react-hot-toast";

const AdminDirectMessaging = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    companyId: "",
    messageType: "General Inquiry",
    subject: "",
    message: "",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      const res = await adminService.getCompanies("all");
      setCompanies(res.data || []);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      toast.error("Failed to load companies list");
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyId || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSending(true);
    try {
      // API expects { title, message }
      const payload = {
        title: `[${formData.messageType}] ${formData.subject}`,
        message: formData.message,
      };

      await adminService.notifyCompany(formData.companyId, payload);

      setIsSuccess(true);
      toast.success("Message sent successfully!");

      // Reset form after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          companyId: "",
          messageType: "General Inquiry",
          subject: "",
          message: "",
        });
      }, 3000);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const messageTypes = [
    {
      label: "General Inquiry",
      icon: Info,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Compliance Alert",
      icon: AlertTriangle,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Policy Notice",
      icon: ShieldCheck,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "Other",
      icon: MessageSquare,
      color: "text-slate-500",
      bg: "bg-slate-50",
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-[28px] font-black text-slate-900 tracking-tight mb-2">
          Direct Messaging
        </h1>
        <p className="text-slate-500 font-[300]  text-[14px">
          Send personalized messages or system updates to a specific company
          account.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
        {isSuccess && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100 shadow-inner">
              <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Message Sent!
            </h2>
            <p className="text-slate-500 font-medium">
              Your notification has been delivered to the company dashboard.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Company Selection */}
            <div className="space-y-3">
              <label className="text-[14px] font-[600] text-[#64748B] uppercase  flex items-center gap-2 mb-2">
                Select Company *
              </label>
              <div className="relative group">
                <select
                  value={formData.companyId}
                  onChange={(e) =>
                    setFormData({ ...formData, companyId: e.target.value })
                  }
                  disabled={isLoadingCompanies}
                  className="w-full pl-6 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-bold appearance-none hover:bg-slate-100 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all cursor-pointer disabled:opacity-50"
                  required
                >
                  <option value="" disabled>
                    Choose a company...
                  </option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
              </div>
            </div>

            {/* Message Type Selection */}
            <div className="space-y-3">
              <label className="text-[14px] font-[600] text-[#64748B] uppercase  flex items-center gap-2 mb-2">
                Message Type *
              </label>
              <div className="relative group">
                <select
                  value={formData.messageType}
                  onChange={(e) =>
                    setFormData({ ...formData, messageType: e.target.value })
                  }
                  className="w-full pl-6 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-bold appearance-none hover:bg-slate-100 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all cursor-pointer"
                  required
                >
                  {messageTypes.map((type) => (
                    <option key={type.label} value={type.label}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-3">
            <label className="text-[14px] font-[600] text-[#64748B] uppercase  flex items-center gap-2 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="e.g., Upcoming Maintenance or New Feature Release"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-sm font-bold hover:bg-slate-100 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <label className="text-[14px] font-[600] text-[#64748B] uppercase  flex items-center gap-2 mb-2">
              Message Content *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Type your message here..."
              rows="6"
              className="w-full px-6 py-6 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-medium hover:bg-slate-100 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none leading-relaxed"
              required
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSending}
              className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:translate-y-0"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  SENDING MESSAGE...
                </>
              ) : (
                <>
                  <Send className="h-6 w-6" />
                  SEND MESSAGE
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDirectMessaging;
