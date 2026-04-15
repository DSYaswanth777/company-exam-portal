import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Loader2,
  Building2,
  Rocket,
  Users,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import adminService from "../services/adminService";

export default function AdminHeader({
  setActiveTab,
  setCompanySearch,
  setDriveSearch,
  setStudentsSearch,
}) {
  const { user, logout } = useAuth();
  const adminName = user?.claims?.username || "Admin User";

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsLoading(true);
        setShowResults(true);
        try {
          const res = await adminService.search(searchQuery);
          setResults(res.data);
        } catch (err) {
          console.error("Search failed:", err);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications for the badge
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await adminService.getNotifications();
        const data = res.data || [];
        setNotifications(data);

        // Calculate unread count based on is_read flag and localStorage backup
        const readIds = JSON.parse(localStorage.getItem("admin_read_notifications") || "[]");
        const unread = data.filter(n => {
          if (n.is_read !== undefined) return !n.is_read;
          return !readIds.includes(n.id);
        });
        setUnreadCount(unread.length);
      } catch (err) {
        console.error("Failed to fetch notification count:", err);
      }
    };

    fetchNotifications();

    // Optional: Refresh count every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery("");

    if (!setActiveTab) return;

    if (result.type === "company") {
      setActiveTab("companies");
      if (setCompanySearch) setCompanySearch(result.title);
    } else if (result.type === "drive") {
      setActiveTab("active_drives");
      if (setDriveSearch) setDriveSearch(result.title);
    } else if (result.type === "student") {
      setActiveTab("students");
      if (setStudentsSearch) setStudentsSearch(result.title);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "company":
        return <Building2 className="h-4 w-4" />;
      case "drive":
        return <Rocket className="h-4 w-4" />;
      case "student":
        return <Users className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
      {/* Search */}
      <div className="relative w-96" ref={searchRef}>
        <div className="relative group/search">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            ) : (
              <Search className="h-4 w-4 text-slate-400 group-focus-within/search:text-blue-500 transition-colors" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            placeholder="Search for drives, companies or candidates..."
            className="block w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-slate-600 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-[400px] overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-2 space-y-1">
                  {results.map((result, idx) => (
                    <button
                      key={`${result.type}-${result.id}-${idx}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                    >
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                          result.type === "company"
                            ? "bg-blue-50 text-blue-600"
                            : result.type === "drive"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-purple-50 text-purple-600"
                        }`}
                      >
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {result.title}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                          {result.subtitle}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    No results found
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try searching for something else
                  </p>
                </div>
              )}
            </div>
            {results.length > 0 && (
              <div className="p-3 bg-slate-50/50 border-t border-slate-50">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] text-center">
                  Showing {results.length} relevant results
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button
          onClick={() => setActiveTab("notifications")}
          className="relative group p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-300"
        >
          <Bell className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          {unreadCount > 0 && (
            <div className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <span className="text-[10px] font-bold text-white leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            </div>
          )}
        </button>

        <div className="h-10 w-[1px] bg-slate-100 mx-2"></div>

        <div className="relative group">
          <button className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-300">
            <div className="h-10 w-10 bg-white shadow-sm rounded-xl flex items-center justify-center overflow-hidden border border-slate-100">
              <User className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-slate-900 leading-none">
                {adminName}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Super Admin
              </p>
            </div>
          </button>

          {/* Logout Card */}
          <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
            <div className="w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 leading-tight truncate w-32">
                    {adminName}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Administrator
                  </p>
                </div>
              </div>

              <div className="h-[1px] bg-slate-50"></div>

              <button
                onClick={logout}
                className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-300 group/logout"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover/logout:scale-110 transition-transform">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Log Out
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-50 group-hover/logout:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
