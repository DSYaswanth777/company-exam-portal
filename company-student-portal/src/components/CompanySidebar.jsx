import React from "react";
import { LogOut, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function CompanySidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { id: "/company-dashboard", label: "Dashboard", icon: "/icons/dashbaordIcon.png" },
    {
      id: "/company-create-drive",
      label: "Create New Drive",
      icon: "/icons/createNewDriveIcon.png",
    },
    { id: "/company-tickets", label: "Support Tickets", icon: "/icons/supportTIcketIcons.png" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeTab = location.pathname;

  return (
    <div className="bg-[#1A1A2E] text-white flex flex-col h-screen sticky top-0 border-r border-white/5 shadow-2xl z-50 w-[280px]">
      {/* Logo */}
      <div className="ps-4 pt-8 pb-2">
        <div className="bg-white rounded-xl  inline-block">
          <img src="/companyDashboardLogo.png" alt="Company Logo" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 ">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id ||
              (item.id === "/company-dashboard" && location.pathname === "/company-drive-detail") ||
              (item.id === "/company-create-drive" && activeTab.includes("edit"));
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group cursor-pointer ${
                  isActive
                    ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {typeof item.icon === "string" ? (
                  <img
                    src={item.icon}
                    alt=""
                    className={`h-6 w-6 object-contain transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:rotate-6 opacity-70"
                    }`}
                  />
                ) : (
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                )}
                <span className={`font-semibold text-[15px] ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-8 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-white transition-all group w-full"
        >
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all">
            <LogOut className="h-5 w-5 rotate-180" />
          </div>
          <span className="font-semibold text-[15px]">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
