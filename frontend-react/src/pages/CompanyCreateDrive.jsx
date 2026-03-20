import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CompanySidebar from "../components/CompanySidebar";
import CompanyHeader from "../components/CompanyHeader";
import {
  Rocket,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowLeft,
  Clock,
  Briefcase,
  Users,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { parseISO, format } from "date-fns";
import companyService from "../services/companyService";
import { getErrorMessage } from "../utils/errorHelpers";
import { convertUTCToInputIST, convertInputISTToUTC } from "../utils/timezone";

/**
 * CompanyCreateDrive - Hyper-fidelity multi-step drive configuration matching Image 4.
 */
export default function CompanyCreateDrive() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const driveId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [studentGroups, setStudentGroups] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technical MCQ",
    exam_duration_minutes: 60,
    window_start: "",
    window_end: "",
    targets: [
      {
        college_id: null,
        custom_college_name: "",
        student_group_id: null,
        custom_student_group_name: "",
        batch_year: "",
      },
    ],
  });

  useEffect(() => {
    loadReferenceData();
    if (driveId) {
      loadDriveData();
    }
  }, [driveId]);

  const loadReferenceData = async () => {
    try {
      const [collegesRes, groupsRes] = await Promise.all([
        companyService.getColleges(),
        companyService.getGroups(),
      ]);
      setColleges(collegesRes.data);
      setStudentGroups(groupsRes.data);
    } catch (err) {
      console.error("Failed to load reference data", err);
    }
  };

  const loadDriveData = async () => {
    setIsLoading(true);
    try {
      const res = await companyService.getDriveDetail(driveId);
      const data = res.data;
      setFormData({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "Technical MCQ",
        exam_duration_minutes: data.exam_duration_minutes || 60,
        window_start: data.window_start
          ? convertUTCToInputIST(data.window_start)
          : "",
        window_end: data.window_end
          ? convertUTCToInputIST(data.window_end)
          : "",
        targets:
          data.targets.length > 0
            ? data.targets.map((t) => ({
                college_id: t.college_id,
                custom_college_name: t.custom_college_name || "",
                student_group_id: t.student_group_id,
                custom_student_group_name: t.custom_student_group_name || "",
                batch_year: t.batch_year || "",
              }))
            : [
                {
                  college_id: null,
                  custom_college_name: "",
                  student_group_id: null,
                  custom_student_group_name: "",
                  batch_year: "",
                },
              ],
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date ? format(date, "yyyy-MM-dd'T'HH:mm") : "",
    }));
  };

  const handleTargetChange = (index, field, value) => {
    const newTargets = [...formData.targets];
    if (field === "college_id") {
      if (value === "custom") {
        newTargets[index].college_id = null;
      } else {
        newTargets[index].college_id = value ? parseInt(value) : null;
        newTargets[index].custom_college_name = "";
      }
    } else if (field === "student_group_id") {
      if (value === "custom") {
        newTargets[index].student_group_id = null;
      } else {
        newTargets[index].student_group_id = value ? parseInt(value) : null;
        newTargets[index].custom_student_group_name = "";
      }
    } else {
      newTargets[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, targets: newTargets }));
  };

  const addTarget = () => {
    setFormData((prev) => ({
      ...prev,
      targets: [
        ...prev.targets,
        {
          college_id: null,
          custom_college_name: "",
          student_group_id: null,
          custom_student_group_name: "",
          batch_year: "",
        },
      ],
    }));
  };

  const removeTarget = (index) => {
    if (formData.targets.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      targets: prev.targets.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        window_start: convertInputISTToUTC(formData.window_start),
        window_end: convertInputISTToUTC(formData.window_end),
      };

      if (driveId) {
        await companyService.updateDrive(driveId, payload);
        toast.success("Drive updated successfully!");
      } else {
        await companyService.createDrive(payload);
        toast.success("Drive created successfully!");
      }
      navigate("/company-dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-['Poppins',_sans-serif] overflow-hidden">
      <CompanySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <CompanyHeader /> */}

        {/* Custom Configure Header */}
        <header className="bg-white px-10 py-8 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/company-dashboard")}
              className="h-12 w-12 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-[22px] font-bold text-[#111827] tracking-tight leading-none mb-1">
                Create New Drive
              </h2>
              <p className="text-[13px] text-[#6B7280] font-medium">
                Set up a new exam drive for students
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2">
            <span className="text-[10px] font-[500] text-slate-400 uppercase tracking-widest">
              Setup Progress
            </span>
            <div className="flex gap-1.5">
              {[1, 1, 1, 0].map((active, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-10 rounded-full ${active ? "bg-blue-600" : "bg-slate-100"}`}
                ></div>
              ))}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-12 bg-[#F8FAFC]">
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto space-y-12 pb-24"
          >
            {/* 01 Basic Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 space-y-10 animate-in slide-in-from-bottom-6 duration-500">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-blue-50   shadow-xl shadow-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 font-[500] text-lg">
                  01
                </div>
                <div>
                  <h3 className="text-2xl font-[500] text-slate-900 tracking-tight">
                    Basic Details
                  </h3>
                  <p className="text-sm font-[500] mt-2 text-slate-400">
                    Primary identification for the examination drive
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[#111827] ml-1">
                    Drive Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Spring 2024 Technical Assessment"
                    className="w-full h-[38px] px-3 py-2 bg-white border border-[#D1D5DB] rounded-[6px] focus:ring-2 focus:ring-blue-600/10 focus:border-[#1565C0] transition-all outline-none font-medium text-[14px] text-[#111827] placeholder:text-[#9CA3AF]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[#111827] ml-1">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full h-[38px] px-3 py-2 bg-white border border-[#D1D5DB] rounded-[6px] focus:ring-2 focus:ring-blue-600/10 focus:border-[#1565C0] transition-all outline-none font-medium text-[14px] text-[#111827] appearance-none"
                    >
                      <option value="Technical MCQ">Technical MCQ</option>
                      <option value="Aptitude MCQ">Aptitude MCQ</option>
                      <option value="HR MCQ">HR MCQ</option>
                      <option value="Coding MCQ">Coding MCQ</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[13px] font-semibold text-[#111827] ml-1">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Brief description of the exam drive"
                    className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-[6px] focus:ring-2 focus:ring-blue-600/10 focus:border-[#1565C0] transition-all outline-none font-medium text-[14px] text-[#111827] placeholder:text-[#9CA3AF] leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 02 Timeline & Duration */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 space-y-10 animate-in slide-in-from-bottom-6 duration-700 delay-100">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-emerald-50   shadow-xl shadow-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 font-[500] text-lg">
                  02
                </div>
                <div>
                  <h3 className="text-2xl font-[500] text-slate-900 tracking-tight">
                    Timeline & Duration
                  </h3>
                  <p className="text-sm font-medium text-slate-400">
                    Set the operational window for this assessment
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[#111827] ml-1">
                    Exam Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="exam_duration_minutes"
                    value={formData.exam_duration_minutes}
                    onChange={handleInputChange}
                    placeholder="e.g. 30"
                    className="w-full h-[38px] px-3 py-2 bg-white border border-[#D1D5DB] rounded-[6px] focus:ring-2 focus:ring-blue-600/10 focus:border-[#1565C0] transition-all outline-none font-medium text-[14px] text-[#111827] placeholder:text-[#9CA3AF]"
                    required
                  />
                </div>
                {/* Window Starts */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-900 ml-1">
                    Window Start (UTC) *
                  </label>
                  <div className="relative group rsuite-datepicker-container">
                    <DatePicker
                      format="MM/dd/yyyy HH:mm"
                      value={
                        formData.window_start
                          ? parseISO(formData.window_start)
                          : null
                      }
                      onChange={(date) =>
                        handleDateChange("window_start", date)
                      }
                      placeholder="mm/dd/yyyy -- : --"
                      className="w-full"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                {/* Window Ends */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-900 ml-1">
                    Window End (UTC) *
                  </label>
                  <div className="relative group rsuite-datepicker-container">
                    <DatePicker
                      format="MM/dd/yyyy HH:mm"
                      value={
                        formData.window_end
                          ? parseISO(formData.window_end)
                          : null
                      }
                      onChange={(date) => handleDateChange("window_end", date)}
                      placeholder="mm/dd/yyyy -- : --"
                      className="w-full"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#FFEB3B]/30 border-l-2 border-[#FFEB3B] rounded-xl p-8 flex items-center gap-6">
                <div className="h-8 w-8 bg-[#FFEB3B] rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-yellow-500/20">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="text-[18px] font-[500] text-slate-800">
                  The exam active window is of 24 hrs and the exam itself will
                  run for {formData.exam_duration_minutes} mins.
                </p>
              </div>
            </div>

            {/* 03 Target Audience */}
            <div className="bg-white rounded-[12px] shadow-sm border border-slate-100 p-8 space-y-6 animate-in slide-in-from-bottom-6 duration-700 delay-200">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-[14px] font-semibold text-[#111827] uppercase tracking-tight">
                  B) Target Students (Group Based)
                </h3>
                <button
                  type="button"
                  onClick={addTarget}
                  className="text-[#1565C0] font-semibold text-[13px] hover:underline transition-all"
                >
                  + Add Another Group
                </button>
              </div>

              <div className="space-y-6">
                {formData.targets.map((target, idx) => (
                  <div
                    key={idx}
                    className="p-8 bg-slate-50 rounded-[24px] border border-slate-100 space-y-6 relative"
                  >
                    {formData.targets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTarget(idx)}
                        className="absolute top-6 right-6 text-[12px] font-[500] text-red-400 uppercase tracking-widest hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label className="text-[12px] font-medium text-slate-500 ml-1">
                          College
                        </label>
                        <div className="relative">
                          <select
                            value={
                              target.college_id ||
                              (target.custom_college_name ? "custom" : "")
                            }
                            onChange={(e) =>
                              handleTargetChange(
                                idx,
                                "college_id",
                                e.target.value,
                              )
                            }
                            className="w-full h-[34px] px-3 py-1 bg-white border border-[#D1D5DB] rounded-[6px] focus:ring-2 focus:ring-blue-600/10 focus:border-[#1565C0] transition-all outline-none font-medium text-[13px] text-[#111827] appearance-none"
                          >
                            <option value="">e.g. MIT</option>
                            {colleges.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                            <option value="custom">+ Other (Custom)</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                        {target.college_id === null &&
                          (!colleges.length ||
                            target.custom_college_name ||
                            target.college_id === null) && (
                            <input
                              type="text"
                              placeholder="Enter custom college name"
                              value={target.custom_college_name}
                              onChange={(e) =>
                                handleTargetChange(
                                  idx,
                                  "custom_college_name",
                                  e.target.value,
                                )
                              }
                              className="w-full mt-2 px-3 py-2 bg-white border border-[#D1D5DB] rounded-[6px] focus:ring-2 focus:ring-blue-600/10 focus:border-[#1565C0] transition-all outline-none font-medium text-[14px] text-slate-900"
                            />
                          )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-slate-500 ml-1">
                          Student Group
                        </label>
                        <div className="relative">
                          <select
                            value={
                              target.student_group_id ||
                              (target.custom_student_group_name ? "custom" : "")
                            }
                            onChange={(e) =>
                              handleTargetChange(
                                idx,
                                "student_group_id",
                                e.target.value,
                              )
                            }
                            className="w-full h-[34px] px-3 py-1 bg-white border border-[#D1D5DB] rounded-[6px] focus:ring-2 focus:ring-blue-600/10 focus:border-[#1565C0] transition-all outline-none font-medium text-[13px] text-[#111827] appearance-none"
                          >
                            <option value="">e.g. Computer Science</option>
                            {studentGroups.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.name}
                              </option>
                            ))}
                            <option value="custom">+ Other (Custom)</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                        {target.student_group_id === null &&
                          (!studentGroups.length ||
                            target.custom_student_group_name ||
                            target.student_group_id === null) && (
                            <input
                              type="text"
                              placeholder="Enter custom department"
                              value={target.custom_student_group_name}
                              onChange={(e) =>
                                handleTargetChange(
                                  idx,
                                  "custom_student_group_name",
                                  e.target.value,
                                )
                              }
                              className="w-full mt-2 px-3 py-2 bg-white border border-[#D1D5DB] rounded-[6px] focus:ring-2 focus:ring-blue-600/10 focus:border-[#1565C0] transition-all outline-none font-medium text-[14px] text-slate-900"
                            />
                          )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-slate-500 ml-1">
                          Batch Year (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 2026"
                          value={target.batch_year}
                          onChange={(e) =>
                            handleTargetChange(
                              idx,
                              "batch_year",
                              e.target.value,
                            )
                          }
                          className="w-full h-[34px] px-3 py-1 bg-white border border-[#D1D5DB] rounded-[6px] focus:ring-2 focus:ring-blue-600/10 focus:border-[#1565C0] transition-all outline-none font-medium text-[13px] text-[#111827] placeholder:text-[#9CA3AF]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/company-dashboard")}
                className="px-6 py-2 h-[38px] border border-slate-300 bg-white text-slate-700 rounded-[6px] font-semibold text-[14px] hover:bg-slate-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 h-[38px] bg-[#1565C0] text-white rounded-[6px] font-semibold text-[14px] shadow-sm hover:bg-blue-700 transition-all active:scale-95"
              >
                {isSubmitting
                  ? "Processing..."
                  : driveId
                    ? "Update Drive"
                    : "Create Drive"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
