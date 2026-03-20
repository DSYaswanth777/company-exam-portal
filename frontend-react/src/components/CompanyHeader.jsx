import React, { useState, useEffect } from "react";
import { Bell, User, LogOut, ChevronDown, Building2, Ticket, Clock, Inbox } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import companyService from "../services/companyService";
import { useNavigate } from "react-router-dom";

export default function CompanyHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  // Real data from profile or fallback to claims
  const companyName = profile?.company_name || user?.claims?.company_name || user?.claims?.username || "";
  const userEmail = profile?.email || user?.email || user?.claims?.email || "";

  useEffect(() => {
    fetchNotifications();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await companyService.getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await companyService.getNotifications();
      const fetchedNotifications = res.data || [];
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
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

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-12 sticky top-0 z-40">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-[24px] font-bold text-[#1E293B] tracking-tight">
          Company Portal
        </h1>
        <p className="text-[#64748B] text-[14px] font-medium mt-1">
          Manage your exam drives and assessments
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-8">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={handleToggleDropdown}
            className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-[#1E293B] transition-all border border-slate-100 relative group"
          >
            <Bell className="h-6 w-6 group-hover:scale-110 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-4 w-[450px] bg-white rounded-[24px] border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-[18px] font-black text-[#1E293B] tracking-tight">Notifications</h3>
                <span className="bg-[#6366f1]/10 text-[#6366f1] text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
                  {unreadCount} UNREAD
                </span>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="p-12 space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-6 animate-pulse">
                        <div className="h-10 w-10 bg-slate-100 rounded-xl"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-slate-100 rounded-full w-1/4"></div>
                          <div className="h-3 bg-slate-50 rounded-full w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-6 py-6 hover:bg-slate-50/50 transition-all duration-300 flex items-center gap-4 group cursor-pointer relative"
                      >
                        <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                          {getIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-[15px] font-bold text-slate-900 truncate tracking-tight">
                              {notification.title || "System Message"}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                              notification.type?.toLowerCase() === "registration" 
                                ? "bg-blue-50 text-blue-500 border-blue-100" 
                                : "bg-orange-50 text-orange-500 border-orange-100"
                            }`}>
                              {notification.type || "NOTIFICATION"}
                            </span>
                          </div>
                          <p className="text-[13px] text-slate-400 font-medium leading-relaxed truncate pr-4">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                             <Clock className="h-3 w-3 text-slate-300" />
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {getTimeAgo(notification.created_at)}
                             </span>
                          </div>
                        </div>

                        {!notification.is_read && (
                          <div className="h-2 w-2 bg-[#3b82f6] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0 ml-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4 text-slate-200">
                      <Inbox className="h-8 w-8" />
                    </div>
                    <h3 className="text-[16px] font-black text-slate-900 mb-1 tracking-tight">Nothing here yet</h3>
                    <p className="text-slate-400 text-[12px] font-medium max-w-[200px] mx-auto">
                      All your updates and alerts will appear in this space.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5 bg-slate-50/50 border-t border-slate-100 text-center">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/company-notifications");
                  }}
                  className="text-[11px] font-black text-[#6366f1] uppercase tracking-[0.2em] hover:text-[#4f46e5] transition-colors flex items-center justify-center gap-2 mx-auto group"
                >
                  VIEW ALL NOTIFICATIONS
                  <ChevronDown className="h-3 w-3 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="text-[15px] font-bold text-[#1E293B] leading-tight">
              {companyName}
            </p>
            <p className="text-[12px] font-medium text-[#64748B] mt-0.5">
              {userEmail}
            </p>
          </div>
          <div className="h-12 w-12 bg-[#3B82F6] rounded-full flex items-center justify-center text-white font-bold text-[16px] shadow-lg shadow-blue-500/20 ring-4 ring-blue-50">
            {companyName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
}
