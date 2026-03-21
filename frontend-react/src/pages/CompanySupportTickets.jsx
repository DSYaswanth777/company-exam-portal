import React, { useState, useEffect } from "react";
import CompanySidebar from "../components/CompanySidebar";
import CompanyHeader from "../components/CompanyHeader";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import companyService from "../services/companyService";
import { formatDateLocal } from "../utils/timezone";
import { useNavigate } from "react-router-dom";

/**
 * CompanySupportTickets - Refined Support Tickets screen matching Image 2 design.
 */
export default function CompanySupportTickets() {
  const [ticketsList, setTicketsList] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsSearch, setTicketsSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    category: "technical",
    priority: "medium",
    description: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      const res = await companyService.getTickets();
      setTicketsList(res.data || []);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await companyService.createTicket(newTicket);
      toast.success("Ticket raised successfully");
      setShowCreateModal(false);
      setNewTicket({
        title: "",
        category: "technical",
        priority: "medium",
        description: "",
      });
      loadTickets();
    } catch (err) {
      toast.error("Failed to raise ticket");
    }
  };

  const getPriorityDot = (priority) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-orange-400",
      low: "bg-slate-400",
      urgent: "bg-red-700",
    };
    return (
      <div className="flex items-center gap-2">
        <div
          className={`h-1.5 w-1.5 rounded-full ${colors[priority.toLowerCase()] || "bg-slate-400"}`}
        ></div>
        <span className="text-sm font-medium text-slate-600 capitalize">
          {priority}
        </span>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-blue-50 text-blue-600 border-blue-100",
      resolved: "bg-emerald-50 text-emerald-600 border-emerald-100",
      pending: "bg-orange-50 text-orange-600 border-orange-100",
    };
    return (
      <span
        className={`px-4 py-1.5 rounded-xl text-[10px] font-semibold tracking-widest border uppercase ${styles[status] || "bg-slate-50 text-slate-400 border-slate-100"}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-['Poppins',_sans-serif]">
      <CompanySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <CompanyHeader /> */}

        <main className="flex-1 overflow-auto p-6 md:p-12">
          <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-blue-600">
                  <LifeBuoy className="h-5 w-5" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                    Support Center
                  </span>
                </div>
                <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
                  My Support Tickets
                </h2>
              </div>
              <button
                onClick={() => navigate("/company-raise-ticket")}
                className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Raise New Ticket
              </button>
            </header>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="px-8 py-6 text-left text-[14px] font-semibold uppercase tracking-widest">
                      Tkt-ID
                    </th>
                    <th className="px-8 py-6 text-left text-[14px] font-semibold uppercase tracking-widest">
                      Subject
                    </th>
                    <th className="px-8 py-6 text-center text-[14px] font-semibold uppercase tracking-widest">
                      Category
                    </th>
                    <th className="px-8 py-6 text-left text-[14px] font-semibold uppercase tracking-widest">
                      Priority
                    </th>
                    <th className="px-8 py-6 text-center text-[14px] font-semibold uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-8 py-6 text-right text-[14px] font-semibold uppercase tracking-widest">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ticketsLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-10 py-20 text-center animate-pulse font-semibold text-slate-300 uppercase tracking-widest"
                      >
                        Synchronizing Encrypted Tickets...
                      </td>
                    </tr>
                  ) : ticketsList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-10 py-20 text-center font-medium text-slate-400"
                      >
                        No support threads found in your history.
                      </td>
                    </tr>
                  ) : (
                    ticketsList.map((ticket, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-8 py-6 font-semibold text-sm text-blue-600 hover:underline">
                          TKT-{ticket.id}
                        </td>
                        <td className="px-8 py-6 font-semibold text-slate-900 tracking-tight">
                          {ticket.title}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-semibold tracking-widest uppercase">
                            {ticket.category}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          {getPriorityDot(ticket.priority)}
                        </td>
                        <td className="px-8 py-6 text-center">
                          {getStatusBadge(ticket.status)}
                        </td>
                        <td className="px-8 py-6 text-right text-sm font-medium text-slate-400">
                          {formatDateLocal(ticket.updated_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Footer Section */}
              <div className="p-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[12px] font-[600] text-[#9CA3AF] uppercase ">
                  Showing Active Support Thread History
                </p>
                <div className="flex gap-4">
                  <button className="h-10 w-10 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="h-10 w-10 border border-slate-100 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
