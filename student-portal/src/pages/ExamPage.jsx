import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import ViolationModal from "../components/ViolationModal";
import SubmitExamModal from "../components/SubmitExamModal";
import studentService from "../services/studentService";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import SafeStorage from "../utils/safeStorage";

export default function ExamPage() {
  const { student } = useAuth();
  const navigate = useNavigate();
  const [violationCount, setViolationCount] = useState(0);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState({});
  const [notAnsweredQuestions, setNotAnsweredQuestions] = useState({});
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [visitedQuestions, setVisitedQuestions] = useState({ 1: true });

  useEffect(() => {
    if (!student) {
      navigate("/login");
      return;
    }
    loadExamData();
  }, [student, navigate]);
  console.log(student, "student");
  const loadExamData = async () => {
    setIsLoading(true);
    try {
      // First, start the exam if not already started
      await studentService.startExam().catch(() => null);

      const res = await studentService.getQuestions();
      setExamData(res.data);
      setQuestions(res.data.questions || []);
      // Calculate remaining time
      if (res.data.exam_started_at && res.data.exam_duration_minutes) {
        let startStr = res.data.exam_started_at;
        if (startStr && !startStr.endsWith("Z") && !startStr.includes("+")) {
          startStr += "Z";
        }
        const start = new Date(startStr);
        const durationMs = res.data.exam_duration_minutes * 60 * 1000;
        const end = new Date(start.getTime() + durationMs);
        const now = new Date();
        const diffMs = end.getTime() - now.getTime();

        if (diffMs > 0) {
          const totalSecs = Math.floor(diffMs / 1000);
          setTimeLeft({
            hours: Math.floor(totalSecs / 3600),
            minutes: Math.floor((totalSecs % 3600) / 60),
            seconds: totalSecs % 60,
          });
        } else {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        }
      }

      // Load saved answers
      const savedAnswers = SafeStorage.getItem("exam_answers");
      if (savedAnswers) {
        // Map question IDs back to question numbers if needed,
        // but looking at StudentExam.jsx, it uses 1-based index as key
        // We'll stick to 1-based index for UI consistency with the migrated code
        // But our API needs question_id.

        // Let's re-initialize selectedOptions from savedAnswers if they exist
        // The savedAnswers in ExamPage.jsx (original portal) was { [id]: option }
        // The StudentExam.jsx (refined) used { [questionNumber]: option }
        // We'll try to find the question number for each saved answer
        const initialSelected = {};
        Object.keys(savedAnswers).forEach((qid) => {
          const index = res.data.questions.findIndex((q) => q.id === qid);
          if (index !== -1) {
            initialSelected[index + 1] = savedAnswers[qid];
          }
        });
        setSelectedOptions(initialSelected);
      }
    } catch (err) {
      toast.error("Failed to load exam data");
      navigate("/waiting-room");
    } finally {
      setIsLoading(false);
    }
  };

  // Sync answers with SafeStorage
  useEffect(() => {
    if (questions.length > 0) {
      const answersToSave = {};
      Object.keys(selectedOptions).forEach((num) => {
        const q = questions[parseInt(num) - 1];
        if (q) answersToSave[q.id] = selectedOptions[num];
      });
      if (Object.keys(answersToSave).length > 0) {
        SafeStorage.setItem("exam_answers", answersToSave);
      }
    }
  }, [selectedOptions, questions]);

  const currentQuestion = questions[activeQuestion - 1] || null;

  // Violation Detection Logic
  const handleViolation = useCallback(
    async (type) => {
      // Increment count locally
      const newCount = violationCount + 1;
      setViolationCount(newCount);
      SafeStorage.setItem("violation_count", newCount);

      if (newCount >= 3) {
        try {
          const reason = `Disqualified due to multiple violations. Last action: ${type}`;
          await studentService.recordViolation(reason);
          SafeStorage.removeItem("violation_count");
          SafeStorage.removeItem("exam_answers");
          navigate("/disqualified", { state: { reason } });
        } catch (err) {
          console.error("Failed to record disqualification", err);
          // Still navigate because the backend will block them anyway
          navigate("/disqualified", {
            state: { reason: "Security violation detected." },
          });
        }
      } else {
        setIsViolationModalOpen(true);
      }
    },
    [violationCount, navigate],
  );

  useEffect(() => {
    // Force full screen on mount
    const forceFullScreen = async () => {
      if (!document.fullscreenElement) {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            await document.documentElement.webkitRequestFullscreen();
          }
        } catch (err) {
          console.warn("Forced fullscreen failed:", err);
        }
      }
    };

    forceFullScreen();

    // Violation tracking persistency
    const savedViolations = SafeStorage.getItem("violation_count") || 0;
    setViolationCount(Number(savedViolations));

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("tab_switch");
      }
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation("fullscreen_exit");
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      handleViolation("right_click");
    };

    const handleCopy = (e) => {
      toast.error("Copying is not allowed! This action is recorded.", {
        icon: "⚠️",
      });
    };

    const handlePaste = (e) => {
      toast.error("Pasting is not allowed! This action is recorded.", {
        icon: "⚠️",
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev) return prev;
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Auto submit when time expires
          handleConfirmSubmit();
          clearInterval(timer);
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      clearInterval(timer);
    };
  }, [handleViolation]);

  useEffect(() => {
    setVisitedQuestions((prev) => ({
      ...prev,
      [activeQuestion]: true,
    }));
  }, [activeQuestion]);

  const handleOptionSelect = (optionLetter) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [activeQuestion]: optionLetter,
    }));
  };

  const handleNext = () => {
    if (activeQuestion < questions.length) {
      setActiveQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (activeQuestion > 1) {
      setActiveQuestion((prev) => prev - 1);
    }
  };

  const handleToggleMark = () => {
    setMarkedQuestions((prev) => {
      const next = { ...prev };
      if (next[activeQuestion]) {
        delete next[activeQuestion];
      } else {
        next[activeQuestion] = true;
      }
      return next;
    });
  };

  const handleSubmit = () => {
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (isLoading || questions.length === 0) return;
    try {
      const answers = Object.keys(selectedOptions).map((num) => {
        const qIndex = parseInt(num) - 1;
        return {
          question_id: questions[qIndex].id,
          selected_option: selectedOptions[num],
          marked_for_review: !!markedQuestions[num],
        };
      });

      await studentService.submitExam(answers);
      SafeStorage.removeItem("exam_answers");
      toast.success("Exam submitted successfully!");
      navigate("/result");
    } catch (err) {
      toast.error("Failed to submit exam");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-poppins text-slate-900 overflow-hidden">
      {/* Top Header */}
      <header className="bg-[#2563EB] text-white px-8 py-5 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold tracking-tight">
            {examData?.drive_title || "Assessment..."}
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-blue-100 text-[11px] font-medium">
              {questions.length} Questions · {examData?.total_marks || 0} Marks
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="bg-white px-6 py-2.5 rounded-full flex items-center gap-3 shadow-md">
            <span className="text-[#2563EB] text-xl font-bold tabular-nums">
              {timeLeft ? (
                <>
                  {String(timeLeft.hours).padStart(2, "0")}:
                  {String(timeLeft.minutes).padStart(2, "0")}:
                  {String(timeLeft.seconds).padStart(2, "0")}
                </>
              ) : (
                "--:--:--"
              )}
            </span>
            <Clock className="h-5 w-5 text-[#2563EB]" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex p-6 gap-6 max-w-[1600px] mx-auto w-full overflow-hidden">
        {/* Left Column: Question */}
        <div className="flex-1 space-y-6 flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col min-h-[500px]">
            {/* Question Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-slate-900">
                  Question {activeQuestion}/{questions.length}
                </span>
                <span className="bg-blue-50 text-[#6366f1] px-3 py-1 rounded-md text-xs font-semibold tracking-wider">
                  MCQ
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="px-10 py-4 flex-grow">
              <div className="bg-slate-50 rounded-xl p-6 mb-4">
                <p className="text-slate-700 text-lg leading-relaxed font-medium">
                  {currentQuestion?.question_text}
                </p>
              </div>

              <div className="space-y-4">
                {["a", "b", "c", "d"].map((optionLetter) => {
                  const isSelected =
                    selectedOptions[activeQuestion] === optionLetter;
                  const optionText =
                    currentQuestion?.[`option_${optionLetter}`];
                  if (!optionText) return null;

                  return (
                    <button
                      key={optionLetter}
                      onClick={() => handleOptionSelect(optionLetter)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-6 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/30"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-slate-200 text-slate-500"
                        }`}
                      >
                        {optionLetter.toUpperCase()}
                      </div>
                      <span
                        className={`text-base font-medium transition-colors ${
                          isSelected ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {optionText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Footer */}
            <div className="px-8 py-6 bg-white border-t border-slate-100 flex justify-between items-center">
              <div className="flex gap-4">
                <button
                  onClick={handleToggleMark}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider border transition-colors ${
                    markedQuestions[activeQuestion]
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-orange-200 text-orange-500 hover:bg-orange-50"
                  }`}
                >
                  🚩{" "}
                  {markedQuestions[activeQuestion]
                    ? "Marked"
                    : "Mark for review"}
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={activeQuestion === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={activeQuestion === questions.length}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#2563EB] text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: User & Palette */}
        <aside className="w-[380px] space-y-6 flex flex-col h-full overflow-y-auto pr-1">
          {/* User Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white uppercase">
                  {(student?.name || "S").charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-md font-bold text-slate-900 leading-tight">
                  {student?.name || "Candidate"}
                </h3>
                <p className="text-xs font-[400] text-slate-400 tracking-wider mt-1">
                  {student?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Question Palette */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col flex-grow">
            <div className="mb-6">
              <h2 className="text-[14px] font-[500] text-slate-800 uppercase tracking-widest">
                QUESTION PALETTE
              </h2>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-8">
              {questions.map((_, i) => {
                const num = i + 1;
                const isAnswered = !!selectedOptions[num];
                const isMarked = !!markedQuestions[num];
                const isVisited = !!visitedQuestions[num];
                const isActive = num === activeQuestion;

                let stateClass = "bg-slate-50 text-slate-400 border-slate-100"; // Not Visited (Gray)
                if (isActive) {
                  stateClass = "border-blue-500 text-blue-600 bg-blue-50";
                } else if (isMarked) {
                  stateClass = "border-orange-400 text-orange-500 bg-white";
                } else if (isAnswered) {
                  stateClass =
                    "border-emerald-500 text-emerald-600 bg-emerald-50";
                } else if (isVisited) {
                  stateClass = "border-red-400 text-red-500 bg-red-50";
                }

                return (
                  <button
                    key={num}
                    onClick={() => setActiveQuestion(num)}
                    className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all border-2 ${stateClass}`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-4 mt-auto border-t pt-6">
              {/* First Row: Answered and Not Answered */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-md bg-emerald-500 shrink-0"></div>
                  <span className="text-[12px] font-semibold text-slate-600">
                    Answered ({Object.keys(selectedOptions).length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-md bg-red-500 shrink-0"></div>
                  <span className="text-[12px] font-semibold text-slate-600">
                    Not Answered (
                    {Object.keys(visitedQuestions).length -
                      Object.keys(selectedOptions).length}
                    )
                  </span>
                </div>
              </div>

              {/* Second Row: Not Visited and Marked */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-md bg-slate-200 border border-slate-300 shrink-0"></div>
                  <span className="text-[12px] font-semibold text-slate-600">
                    Not Visited (
                    {questions.length - Object.keys(visitedQuestions).length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-md bg-orange-400 shrink-0"></div>
                  <span className="text-[12px] font-semibold text-slate-600">
                    Marked ({Object.keys(markedQuestions).length})
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-10 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 text-sm uppercase tracking-wider"
            >
              Submit Exam
            </button>
          </div>
        </aside>
      </main>

      {/* Violation Modal */}
      <ViolationModal
        isOpen={isViolationModalOpen}
        onClose={() => setIsViolationModalOpen(false)}
        violationCount={violationCount}
      />
      {/* Submit Exam Modal */}
      <SubmitExamModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleConfirmSubmit}
        answeredCount={Object.keys(selectedOptions).length}
        totalCount={questions.length}
      />
    </div>
  );
}
