import React from "react";
import {
  LayoutDashboard,
  Building2,
  Database,
  Ticket,
  LogOut,
  ChevronRight,
  Rocket,
} from "lucide-react";

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "companies", label: "Company Approvals", icon: Building2 },
    { id: "data_management", label: "Data Management", icon: Database },
    { id: "tickets", label: "Support Tickets", icon: Ticket },
  ];

  return (
    <div className="w-80 bg-[#1e293b] text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <div className=" rounded-xl  flex items-start justify-start shadow-sm">
          <a href="/">
            <img
              src="/adminPanelLogo.png"
              alt="Logo"
              className="h-24 w-auto object-contain"
            />
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 mt-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group cursor-pointer ${
                activeTab === item.id
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
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group cursor-pointer"
        >
          <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-tight">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
