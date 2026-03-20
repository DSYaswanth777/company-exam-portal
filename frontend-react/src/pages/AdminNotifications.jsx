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
  Filter
} from "lucide-react";
import adminService from "../services/adminService";
import { toast } from "react-hot-toast";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getNotifications();
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

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "registration":
        return <Building2 className="h-5 w-5 text-blue-600" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Company Notifications
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
            ALL NOTIFICATIONS • {notifications.length} UPDATES
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Filter notifications..."
              className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all w-64 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="grid gap-6">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-pointer flex items-center gap-8"
            >
              <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-slate-50 shadow-inner">
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {notif.company_name || "System Notification"}
                  </h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <Clock className="h-3 w-3" />
                    {getTimeAgo(notif.created_at)}
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {notif.message}
                </p>
              </div>

              <div className="hidden md:block">
                <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-slate-900 hover:shadow-md border border-transparent hover:border-slate-100">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-[2.5rem] bg-slate-50 border border-slate-100 mb-8 animate-bounce duration-[3000ms]">
            <Inbox className="h-12 w-12 text-slate-300" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Your Inbox is Empty
          </h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            There are no new notifications at the moment. We'll let you know when something important happens!
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
