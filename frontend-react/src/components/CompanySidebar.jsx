import React from "react";
import { LayoutDashboard, PlusSquare, Ticket, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function CompanySidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { id: "/company-dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "/company-create-drive",
      label: "Create New Drive",
      icon: PlusSquare,
    },
    { id: "/company-tickets", label: "Support Tickets", icon: Ticket },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeTab = location.pathname;

  return (
    <div className="bg-[#1A1A2E] text-white flex flex-col h-screen sticky top-0 border-r border-white/5 shadow-2xl z-50 w-72">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-[18px] font-bold tracking-tight">Company Exam Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 mt-6">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer ${
                activeTab === item.id ||
                (item.id === "/company-dashboard" &&
                  location.pathname === "/company-drive-detail") ||
                (item.id === "/company-create-drive" &&
                  activeTab.includes("edit"))
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${
                  activeTab === item.id ? "text-white" : "text-slate-400"
                }`}
              />
              <span className="font-medium text-[14px]">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#FF4D4D] text-white font-bold text-[13px] h-[34px] hover:bg-red-600 transition-all active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
