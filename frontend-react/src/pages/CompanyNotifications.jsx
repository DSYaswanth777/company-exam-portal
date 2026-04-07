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
  CheckCheck,
} from "lucide-react";
import companyService from "../services/companyService";
import { toast } from "react-hot-toast";
import CompanySidebar from "../components/CompanySidebar";
import CompanyHeader from "../components/CompanyHeader";
import { getFullUrl } from "../utils/urlHelper";

const CompanyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(10);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = React.useRef(null);
  const itemMenuRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (itemMenuRef.current && !itemMenuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setIsLoading(true);
    try {
      const res = await companyService.getNotifications();
      setNotifications(res.data || []);
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

  const getIcon = (type, logoUrl) => {
    if (logoUrl) {
      return (
        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 p-1 overflow-hidden shadow-sm">
          <img
            src={getFullUrl(logoUrl)}
            alt="Company Logo"
            className="h-full w-full object-contain"
          />
        </div>
      );
    }

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

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "UNREAD") return !n.is_read;
    if (activeTab === "READ") return n.is_read;
    return true;
  });

  const tabs = ["ALL", "UNREAD", "READ"];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <CompanySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CompanyHeader />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div>
              <h1 className="text-[28px] font-black text-slate-900 tracking-tight mb-2">
                Company Notifications
              </h1>
              <p className="text-slate-500 font-[300] text-[14px]">
                Stay updated with the latest alerts and activities from your
                portal.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
              {/* Header Tabs */}
              <div className="px-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 font-bold">
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
                        onClick={async () => {
                          try {
                            await companyService.markAllNotificationsRead();
                            setNotifications((prev) =>
                              prev.map((n) => ({ ...n, is_read: true })),
                            );
                            setIsMenuOpen(false);
                            toast.success("All marked as read");
                          } catch (err) {
                            toast.error("Failed to mark all as read");
                          }
                        }}
                        className="w-full px-6 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left group"
                      >
                        <CheckCheck className="h-4 w-4 text-slate-400 group-hover:text-[#6366f1]" />
                        <span className="text-[14px] font-[500] text-slate-600">
                          Mark all as read
                        </span>
                      </button>
                      <div className="h-[1px] bg-slate-50 my-2"></div>
                      <button
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full px-6 py-3 flex items-center gap-4 hover:bg-red-50 transition-colors text-left group"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                        <span className="text-[14px] font-[500] text-red-500">
                          Clear All
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="p-8 space-y-6">
                    {[1, 2, 3, 4].map((i) => (
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
                    {filteredNotifications
                      .slice(0, visibleCount)
                      .map((notif) => (
                        <div
                          key={notif.id}
                          onClick={async () => {
                            if (!notif.is_read) {
                              try {
                                await companyService.markNotificationRead(
                                  notif.id,
                                );
                                setNotifications((prev) =>
                                  prev.map((n) =>
                                    n.id === notif.id
                                      ? { ...n, is_read: true }
                                      : n,
                                  ),
                                );
                              } catch (err) {
                                console.error("Failed to mark as read:", err);
                              }
                            }
                          }}
                          className={`px-8 py-7 hover:bg-slate-100/30 transition-all duration-300 flex items-center gap-6 group cursor-pointer relative ${
                            !notif.is_read ? "bg-indigo-50/40" : "bg-white"
                          }`}
                        >
                          <div className="h-10 w-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-sm">
                            <Building2 className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1.5 single-line-group">
                              <h3 className="text-[17px] font-bold text-slate-900 truncate tracking-tight">
                                {notif.title || "System Message"}
                              </h3>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                  notif.type?.toLowerCase() === "registration"
                                    ? "bg-blue-50 text-blue-500 border-blue-100"
                                    : "bg-orange-50 text-orange-500 border-orange-100"
                                }`}
                              >
                                {notif.type || "NOTIFICATION"}
                              </span>
                            </div>
                            <p className="text-[15px] text-slate-400 font-medium leading-relaxed truncate pr-10">
                              {notif.message}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                {getTimeAgo(notif.created_at)}
                              </span>

                              <div
                                className="relative"
                                ref={
                                  openMenuId === notif.id ? itemMenuRef : null
                                }
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(
                                      openMenuId === notif.id ? null : notif.id,
                                    );
                                  }}
                                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>

                                {openMenuId === notif.id && (
                                  <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                          await companyService.markNotificationRead(
                                            notif.id,
                                          );
                                          setNotifications((prev) =>
                                            prev.map((n) =>
                                              n.id === notif.id
                                                ? { ...n, is_read: true }
                                                : n,
                                            ),
                                          );
                                          setOpenMenuId(null);
                                          toast.success(
                                            "Notification marked as read",
                                          );
                                        } catch (err) {
                                          toast.error("Failed to mark as read");
                                        }
                                      }}
                                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left group"
                                    >
                                      <Check className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500" />
                                      <span className="text-[13px] font-medium text-slate-600">
                                        Mark as read
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
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
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                      Nothing here yet
                    </h3>
                    <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium">
                      All your updates and alerts will appear in this space.
                    </p>
                  </div>
                )}
              </div>

              {/* Load More Footer */}
              {filteredNotifications.length > visibleCount && (
                <div className="p-6 bg-slate-50/30 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                    className="text-[11px] font-black text-[#6366f1] uppercase tracking-[0.2em] hover:text-[#4f46e5] transition-colors inline-flex items-center gap-2 group"
                  >
                    LOAD MORE NOTIFICATIONS
                    <ChevronDown className="h-3 w-3 group-hover:translate-y-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
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
                This action cannot be undone. All your notifications will be
                permanently removed.
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

export default CompanyNotifications;
