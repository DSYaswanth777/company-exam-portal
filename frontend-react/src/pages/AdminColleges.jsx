import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import adminService from "../services/adminService";
import { getErrorMessage } from "../utils/errorHelpers";
import ConfirmationModal from "../components/ConfirmationModal";

import { ChevronLeft, RotateCcw, CheckCircle2 } from "lucide-react";
import { formatDateIST, formatDate } from "../utils/timezone";

export default function AdminColleges({ onBack }) {
  const [pendingColleges, setPendingColleges] = useState([]);
  const [approvedColleges, setApprovedColleges] = useState([]);
  const [pendingGroups, setPendingGroups] = useState([]);
  const [approvedGroups, setApprovedGroups] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [activeToggle, setActiveToggle] = useState("colleges"); // 'colleges' or 'groups'

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="h-12 w-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Reference Data Management
            </h2>
            <p className="text-slate-500 font-[400] text-[14px] mt-1">
              Manage colleges and student groups across the platform.
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm inline-flex gap-2">
        <button
          onClick={() => setActiveToggle("colleges")}
          className={`px-8 py-3 rounded-xl text-[14px] font-[500]  tracking-[0.1em] transition-all cursor-pointer ${
            activeToggle === "colleges"
              ? "bg-blue-50 text-blue-600"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Pending Custom colleges
        </button>
        <button
          onClick={() => setActiveToggle("groups")}
          className={`px-8 py-3 rounded-xl text-[14px] font-[500]  tracking-[0.1em] transition-all cursor-pointer ${
            activeToggle === "groups"
              ? "bg-blue-50 text-blue-600"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Pending Custom Student Groups
        </button>
      </div>

      {collegesLoading ? (
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin h-12 w-12 border-[6px] border-blue-600 border-t-transparent rounded-full shadow-lg shadow-blue-200"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Pending Section */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                Pending Custom{" "}
                {activeToggle === "colleges" ? "Colleges" : "Groups"} (Need
                Approval)
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={
                    activeToggle === "colleges"
                      ? loadPendingColleges
                      : loadPendingGroups
                  }
                  className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                >
                  Refresh
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button className="px-4 py-2  bg-blue-600 text-white rounded-lg font-[500] text-[14px]  tracking-widest shadow- shadow-blue-500/25 hover:bg-blue-700 transition-all active:scale-95 cursor-pointer">
                  Approve All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {(activeToggle === "colleges" ? pendingColleges : pendingGroups)
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
                      <th className="px-10 py-6 text-left text-[14px] font-[500] text-[#9CA3AF] uppercase tracking-[0.1em]">
                        {activeToggle === "colleges" ? "College" : "Group"} Name
                      </th>
                      <th className="px-10 py-6 text-left text-[14px] font-[500] text-[#9CA3AF] uppercase tracking-[0.1em]">
                        Usage Count
                      </th>
                      <th className="px-10 py-6 text-left text-[14px] font-[500] text-[#9CA3AF] uppercase tracking-[0.1em]">
                        First Used
                      </th>
                      <th className="px-10 py-6 text-center text-[14px] font-[500] text-[#9CA3AF] uppercase tracking-[0.1em]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(activeToggle === "colleges"
                      ? pendingColleges
                      : pendingGroups
                    ).map((item, idx) => (
                      <tr
                        key={idx}
                        className="group hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="px-10 py-8 font-semibold text-slate-900 tracking-tight">
                          {item.name || "Unnamed Group"}
                        </td>
                        <td className="px-10 py-8 text-sm font-bold text-slate-500 tracking-tighter">
                          {item.usage_count} drive(s)
                        </td>
                        <td className="px-10 py-8 text-sm font-bold text-slate-400 italic">
                          {formatDate(item.first_used)}
                        </td>
                        <td className="px-10 py-8 text-center">
                          <button
                            onClick={() =>
                              activeToggle === "colleges"
                                ? approveCustomCollege(item.name)
                                : approveCustomGroup(item.name)
                            }
                            className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-semibold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95"
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
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-10 py-4 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                Approved {activeToggle === "colleges" ? "Colleges" : "Groups"}
              </h3>
              <button
                onClick={
                  activeToggle === "colleges" ? loadColleges : loadStudentGroups
                }
                className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors cursor-pointer"
              >
                Refresh
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1e293b] text-white">
                    <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.2em] border-none ">
                      {activeToggle === "colleges" ? "College" : "Group"} Name
                    </th>
                    <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.2em] border-none">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-[14px] font-semibold uppercase tracking-[0.2em] border-none">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(activeToggle === "colleges"
                    ? approvedColleges
                    : approvedGroups
                  ).map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-10 py-8 font-semibold text-slate-900 tracking-tight">
                        {item.name}
                      </td>
                      <td className="px-10 py-8">
                        <span className="px-4 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-600 inline-block min-w-[100px] text-center">
                          Approved
                        </span>
                      </td>
                      <td className="px-10 py-8 text-sm font-bold text-slate-400">
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
