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
    <div className=" bg-[#1e293b] text-white flex flex-col h-screen sticky top-0 border-r border-white/5 shadow-2xl z-50">
      {/* Logo */}
      <div className="p-6">
        <div className="rounded-xl  flex items-start justify-start shadow-sm mb-4">
          <a href="/">
            <img
              src="/adminPanelLogo.png"
              alt="Logo"
              className="h-24 w-auto object-contain"
            />
          </a>{" "}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 mt-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group cursor-pointer ${
                activeTab === item.id ||
                (item.id === "/company-dashboard" &&
                  location.pathname === "/company-drive-detail") ||
                (item.id === "/company-create-drive" &&
                  activeTab.includes("edit"))
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20 translate-x-2"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon
                className={`h-5 w-5 transition-transform duration-300 ${
                  activeTab === item.id
                    ? "scale-110 rotate-0"
                    : "group-hover:rotate-6"
                }`}
              />
              <span className="font-[500] text-[16px] tracking-tight">
                {item.label}
              </span>
              {activeTab === item.id && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]"></div>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-8 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group cursor-pointer"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-tight">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
