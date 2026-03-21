import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import adminService from "../services/adminService";
import { getErrorMessage } from "../utils/errorHelpers";
import ConfirmationModal from "../components/ConfirmationModal";

import { ChevronLeft, RotateCcw, CheckCircle2, Search } from "lucide-react";
import {  formatDate } from "../utils/timezone";

export default function AdminColleges({ onBack }) {
  const [pendingColleges, setPendingColleges] = useState([]);
  const [approvedColleges, setApprovedColleges] = useState([]);
  const [pendingGroups, setPendingGroups] = useState([]);
  const [approvedGroups, setApprovedGroups] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [activeToggle, setActiveToggle] = useState("colleges"); // 'colleges' or 'groups'
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setCollegesLoading(true);
    try {
      await Promise.all([
        loadPendingColleges(),
        loadColleges(),
        loadPendingGroups(),
        loadStudentGroups(),
      ]);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCollegesLoading(false);
    }
  };

  const loadPendingColleges = async () => {
    try {
      console.log("Loading pending colleges...");
      const res = await adminService.getPendingColleges();
      console.log("Pending colleges response:", res.data);
      setPendingColleges(res.data || []);
    } catch (err) {
      console.error("Failed to load pending colleges:", err);
      toast.error(getErrorMessage(err));
    }
  };

  const loadColleges = async () => {
    try {
      const res = await adminService.getColleges();
      setApprovedColleges(res.data || []);
    } catch (err) {
      console.error("Failed to load colleges:", err);
      toast.error(getErrorMessage(err));
    }
  };

  const loadPendingGroups = async () => {
    try {
      const res = await adminService.getPendingGroups();
      setPendingGroups(res.data || []);
    } catch (err) {
      console.error("Failed to load pending groups:", err);
      toast.error(getErrorMessage(err));
    }
  };

  const loadStudentGroups = async () => {
    try {
      const res = await adminService.getGroups();
      setApprovedGroups(res.data || []);
    } catch (err) {
      console.error("Failed to load student groups:", err);
      toast.error(getErrorMessage(err));
    }
  };

  // Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    type: "info",
    onConfirm: () => {},
  });

  const approveCustomCollege = async (collegeName) => {
    let finalName = collegeName;
    const isUnnamed = !finalName || finalName.trim() === "";

    if (isUnnamed) {
      finalName = window.prompt(
        "This college has no name. Please enter a valid name to approve it:",
        "Unnamed College",
      );
      if (!finalName || finalName.trim() === "") return;
    }

    setModalConfig({
      isOpen: true,
      title: "Approve College?",
      message: `Are you sure you want to approve "${finalName}" and add it to the system?`,
      confirmLabel: "Approve",
      type: "info",
      onConfirm: async () => {
        try {
          const res = await adminService.approveCustomCollege({
            name: finalName,
            original_name: collegeName,
          });
          toast.success(
            `College approved! Updated ${res.data?.updated_targets || 0} drive(s)`,
          );
          await Promise.all([loadPendingColleges(), loadColleges()]);
          setModalConfig({ ...modalConfig, isOpen: false });
        } catch (err) {
          toast.error(getErrorMessage(err));
        }
      },
    });
  };

  const approveCustomGroup = async (groupName) => {
    let finalName = groupName;
    const isUnnamed = !finalName || finalName.trim() === "";

    if (isUnnamed) {
      finalName = window.prompt(
        "This group has no name. Please enter a valid name to approve it:",
        "Unnamed Group",
      );
      if (!finalName || finalName.trim() === "") return;
    }

    setModalConfig({
      isOpen: true,
      title: "Approve Group?",
      message: `Are you sure you want to approve "${finalName}" and add it to the system?`,
      confirmLabel: "Approve",
      type: "info",
      onConfirm: async () => {
        try {
          const res = await adminService.approveCustomGroup({
            name: finalName,
            original_name: groupName,
          });
          toast.success(
            `Group approved! Updated ${res.data?.updated_targets || 0} drive(s)`,
          );
          await Promise.all([loadPendingGroups(), loadStudentGroups()]);
          setModalConfig({ ...modalConfig, isOpen: false });
        } catch (err) {
          toast.error(getErrorMessage(err));
        }
      },
    });
  };

  const getStatusBadge = (isApproved) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isApproved
            ? "bg-green-100 text-green-800 border border-green-300"
            : "bg-yellow-100 text-yellow-800 border border-yellow-300"
        }`}
      >
        {isApproved ? "Approved" : "Pending"}
      </span>
    );
  };

  const filteredPendingColleges = pendingColleges.filter((c) => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredPendingGroups = pendingGroups.filter((g) => g.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredApprovedColleges = approvedColleges.filter((c) => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredApprovedGroups = approvedGroups.filter((g) => g.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-[28px] font-[600] text-slate-900 tracking-tight leading-none">
              Reference Data Management
            </h2>
            <p className="text-slate-500 font-[300] text-[14px] mt-2 mb-3">
              Approved and pending companies are listed
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Toggle Selector */}
      <div className="bg-white p-3 rounded-2xl mt-3 border border-slate-200/60 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative flex-1 group max-w-[400px] w-full ml-1 text-slate-500">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Filter by company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 text-[14px] font-[500] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
          />
        </div>
        <div className="flex bg-slate-50/50 p-1.5 rounded-xl border border-slate-100/50 md:mr-1">
          <button
            onClick={() => setActiveToggle("colleges")}
            className={`px-6 py-2.5 rounded-lg text-[14px] font-[600] transition-all cursor-pointer ${
              activeToggle === "colleges"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Pending Custom colleges
          </button>
          <button
            onClick={() => setActiveToggle("groups")}
            className={`px-6 py-2.5 rounded-lg text-[14px] font-[600] transition-all cursor-pointer ${
              activeToggle === "groups"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Pending Custom Student Groups
          </button>
        </div>
      </div>

      {collegesLoading ? (
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin h-12 w-12 border-[6px] border-blue-600 border-t-transparent rounded-full shadow-lg shadow-blue-200"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Section */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
                Pending Custom{" "}
                {activeToggle === "colleges" ? "Colleges" : "Student Groups"} (Need
                Approval)
              </h3>
              <div className="flex gap-6 items-center">
                <button
                  onClick={
                    activeToggle === "colleges"
                      ? loadPendingColleges
                      : loadPendingGroups
                  }
                  className="flex items-center gap-2 text-[14px] font-[600] text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  Refresh
                </button>
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-[14px] shadow-sm shadow-blue-500/25 hover:bg-blue-700 transition-all active:scale-95 cursor-pointer">
                  Approve All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {(activeToggle === "colleges" ? filteredPendingColleges : filteredPendingGroups)
                .length === 0 ? (
                <div className="p-20 text-center">
                  <CheckCircle2 className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold tracking-tight">
                    No pending entries found
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-left text-[13px] font-[600] text-slate-400 uppercase tracking-wider">
                        {activeToggle === "colleges" ? "College Name" : "College Name"}
                      </th>
                      <th className="px-8 py-5 text-left text-[13px] font-[600] text-slate-400 uppercase tracking-wider">
                        Usage Count
                      </th>
                      <th className="px-8 py-5 text-left text-[13px] font-[600] text-slate-400 uppercase tracking-wider">
                        First Used
                      </th>
                      <th className="px-8 py-5 text-center text-[13px] font-[600] text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60">
                    {(activeToggle === "colleges"
                      ? filteredPendingColleges
                      : filteredPendingGroups
                    ).map((item, idx) => (
                      <tr
                        key={idx}
                        className="group hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="px-8 py-6 font-[600] text-[15px] text-slate-700 tracking-tight">
                          {item.name || "Unnamed Group"}
                        </td>
                        <td className="px-8 py-6 text-[14px] font-[500] text-slate-500">
                          {item.usage_count} drive(s)
                        </td>
                        <td className="px-8 py-6 text-[15px] font-[500] text-slate-500">
                          {formatDate(item.first_used)}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button
                            onClick={() =>
                              activeToggle === "colleges"
                                ? approveCustomCollege(item.name)
                                : approveCustomGroup(item.name)
                            }
                            className="px-6 py-2.5 bg-[#22C55E] text-white rounded-lg font-[600] text-[14px] shadow-sm hover:bg-emerald-600 transition-all active:scale-95"
                          >
                            Approve & Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Approved Section */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-[18px] font-bold text-slate-800 tracking-tight uppercase">
                Approved {activeToggle === "colleges" ? "Colleges" : "Student Groups"}
              </h3>
              <button
                onClick={
                  activeToggle === "colleges" ? loadColleges : loadStudentGroups
                }
                className="flex items-center gap-2 text-[14px] font-[600] text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1e293b] text-white">
                    <th className="px-8 py-4 text-left text-[13px] font-[600] tracking-[0.1em] uppercase border-none ">
                      {activeToggle === "colleges" ? "College Name" : "Group Name"}
                    </th>
                    <th className="px-8 py-4 text-left text-[13px] font-[600] tracking-[0.1em] uppercase border-none">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-[13px] font-[600] tracking-[0.1em] uppercase border-none">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60">
                  {(activeToggle === "colleges"
                    ? filteredApprovedColleges
                    : filteredApprovedGroups
                  ).map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-6 font-[500] text-[15px] text-slate-700 tracking-tight">
                        {item.name}
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-1.5 rounded-3xl border border-emerald-100 text-[11px] font-[600] uppercase tracking-wider bg-emerald-50/50 text-[#22C55E] inline-block text-center">
                          APPROVED
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[15px] font-[600] text-slate-700">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        type={modalConfig.type}
      />
    </div>
  );
}
