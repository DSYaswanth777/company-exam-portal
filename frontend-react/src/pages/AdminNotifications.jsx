import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Building2, 
  Clock, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  Inbox,
  Search,
  Filter,
  Ticket,
  ChevronDown,
  Trash2,
  Check,
  CheckCheck
} from "lucide-react";
import adminService from "../services/adminService";
import { toast } from "react-hot-toast";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(10);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getNotifications();
      const readIds = JSON.parse(localStorage.getItem("admin_read_notifications") || "[]");
      const data = (res.data || []).map((n) => ({
        ...n,
        is_read: n.is_read !== undefined ? n.is_read : readIds.includes(n.id)
      }));
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return "JUST NOW";
    if (diffInMins < 60) return `${diffInMins} MINS AGO`;
    if (diffInHours < 24) return `${diffInHours} HOURS AGO`;
    return `${diffInDays} DAYS AGO`;
  };

  const getIcon = (type) => {
    // Return themed blue icon container for all as per design
    return (
      <div className="h-10 w-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-sm">
        {type?.toLowerCase() === "registration" ? (
          <Building2 className="h-5 w-5" />
        ) : (
          <Ticket className="h-5 w-5" />
        )}
      </div>
    );
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "ALL") return true;
    if (activeTab === "UNREAD") return !n.is_read;
    if (activeTab === "READ") return n.is_read;
    return true;
  });

  const tabs = ["ALL", "UNREAD", "READ"];

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-[28px] font-black text-slate-900 tracking-tight mb-2">
          Company Notifications
        </h1>
        <p className="text-slate-500 font-[300] text-[14px]">
          Keep track of all interactions and updates from registered companies.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Header Tabs */}
        <div className="px-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                   setActiveTab(tab);
                   setVisibleCount(10);
                }}
                className={`py-5 text-xs font-black tracking-widest transition-all relative ${
                  activeTab === tab 
                    ? "text-[#6366f1]" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#6366f1] rounded-t-full shadow-[0_-2px_8px_rgba(99,102,241,0.4)]"></div>
                )}
              </button>
            ))}
          </div>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={() => {
                    const allIds = notifications.map(n => n.id);
                    localStorage.setItem("admin_read_notifications", JSON.stringify(allIds));
                    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                    setIsMenuOpen(false);
                    toast.success("All marked as read");
                    // Force refresh header count if needed (usually happens on interval)
                  }}
                  className="w-full px-6 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left group"
                >
                  <CheckCheck className="h-4 w-4 text-slate-400 group-hover:text-[#6366f1]" />
                  <span className="text-[14px] font-[500] text-slate-600">Mark all as read</span>
                </button>
                <div className="h-[1px] bg-slate-50 my-2"></div>
                <button 
                   onClick={() => {
                    setIsMenuOpen(false);
                    toast.error("Please select a message to delete");
                  }}
                  className="w-full px-6 py-3 flex items-center gap-4 hover:bg-red-50 transition-colors text-left group"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                  <span className="text-[14px] font-[500] text-red-500">Delete Message</span>
                </button>
                <button 
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 flex items-center gap-4 hover:bg-red-50 transition-colors text-left group"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                  <span className="text-[14px] font-[500] text-red-500">Clear All Messages</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 ">
          {isLoading ? (
            <div className="p-8 space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-6 animate-pulse">
                  <div className="h-10 w-10 bg-slate-100 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-100 rounded-full w-1/4"></div>
                    <div className="h-3 bg-slate-50 rounded-full w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {filteredNotifications.slice(0, visibleCount).map((notif) => (
                <div 
                  key={notif.id}
                  className="px-8 py-7 hover:bg-slate-50/50 transition-all duration-300 flex items-center gap-6 group cursor-pointer"
                >
                  <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 single-line-group">
                      <h3 className="text-[17px] font-[500] text-slate-900 truncate tracking-tight">
                        {notif.is_outgoing ? `To: ${notif.company_name}` : (notif.company_name || "System Message")}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        notif.type?.toLowerCase() === "registration" 
                          ? "bg-blue-50 text-blue-500 border-blue-100" 
                          : "bg-orange-50 text-orange-500 border-orange-100"
                      }`}>
                        {notif.type || "NOTIFICATION"}
                      </span>
                    </div>
                    <p className="text-[14px] text-[#64748B] font-[300]  pr-10">
                      {notif.message}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      {getTimeAgo(notif.created_at)}
                    </span>
                    {!notif.is_read && (
                      <div className="h-2 w-2 bg-[#3b82f6] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-300">
                <Inbox className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Nothing here yet</h3>
              <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium">
                When you receive new updates from companies, they will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Load More Footer */}
        {filteredNotifications.length > visibleCount && (
          <div className="p-6 bg-slate-50/30 border-t border-slate-100 text-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="text-[11px] font-black text-[#6366f1] uppercase tracking-[0.2em] hover:text-[#4f46e5] transition-colors inline-flex items-center gap-2 group"
            >
              LOAD MORE NOTIFICATIONS
              <ChevronDown className="h-3 w-3 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[540px] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              
              <h3 className="text-[24px] font-black text-slate-900 mb-3">
                Clear all Notifications
              </h3>
              <p className="text-slate-500 text-[16px] font-[400] leading-relaxed">
                This action cannot be undone. All your notifications will be permanently removed.
              </p>
            </div>
            
            <div className="bg-[#F8FAFC] px-10 py-6 flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-8 py-2.5 bg-white border border-slate-200 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setNotifications([]);
                  setIsDeleteModalOpen(false);
                  toast.success("All messages cleared");
                }}
                className="px-8 py-2.5 bg-[#ef4444] rounded-xl text-[15px] font-semibold text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
