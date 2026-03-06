import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Loader2,
  Rocket,
  Users,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import companyService from "../services/companyService";
import { useNavigate } from "react-router-dom";

export default function CompanyHeader({ onSearchSelect }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const companyName =
    user?.claims?.company_name || user?.claims?.username || "Company User";

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
          const res = await companyService.search(searchQuery);
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

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery("");

    if (result.type === "drive") {
      if (onSearchSelect) {
        onSearchSelect(result.title);
      } else {
        navigate(`/company-drive-detail?id=${result.id}`);
      }
    } else if (result.type === "student" || result.type === "question") {
      if (result.drive_id) {
        navigate(`/company-drive-detail?id=${result.drive_id}`);
      }
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "drive":
        return <Rocket className="h-4 w-4" />;
      case "student":
        return <Users className="h-4 w-4" />;
      case "question":
        return <HelpCircle className="h-4 w-4" />;
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
            placeholder="Search for drives, questions or students..."
            className="block w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-slate-600 placeholder:text-slate-400"
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
                          result.type === "drive"
                            ? "bg-orange-50 text-orange-600"
                            : result.type === "student"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-blue-50 text-blue-600"
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

      {/* Actions */}
      <div className="flex items-center gap-6">
        <div className="h-10 w-[1px] bg-slate-100 mx-2"></div>

        <div className="relative group">
          <button className="flex items-center gap-4 py-2 hover:opacity-80 transition-opacity">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {companyName}
              </p>
              <p className="text-[10px] font-bold text-slate-400 lowercase tracking-wide mt-0.5">
                {user?.email || "admin@company.com"}
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-500/20">
              {companyName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          </button>

          {/* Logout Card */}
          <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
            <div className="w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {companyName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 leading-tight truncate w-32">
                    {companyName}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 lowercase mt-1">
                    {user?.email}
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
