import React from "react";
import {
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  Circle,
  ListChecks,
  Trophy,
  Calendar,
  Clock,
} from "lucide-react";
import assignmentIcon from "../assets/assignmentWorkIcon.svg";

const QuizDetailView = ({ selectedAssignment, setIsDetailview }) => {
  // Prevent crash if data is not ready
  if (!selectedAssignment) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 font-medium">
        Loading quiz...
      </div>
    );
  }

  const item = selectedAssignment;

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumbs */}
      <div className="flex items-center mb-4 text-sm">
        <span
          onClick={() => setIsDetailview(false)}
          className="text-[#0B56A4] cursor-pointer font-medium hover:underline"
        >
          Quizzes
        </span>

        <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />

        <span className="font-medium text-gray-600">Detail View</span>
      </div>

      <section className="w-full max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="bg-gray-50/80 p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#08384F] flex items-center justify-center text-white shadow-md">
                  <ListChecks size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                    {item.title}
                  </h2>

                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[11px] bg-blue-100 text-[#0B56A4] px-2 py-1 rounded-md font-bold border border-blue-200">
                      <Trophy size={12} />
                      {item.marks || item.questions?.length} TOTAL POINTS
                    </span>

                    <span className="flex items-center gap-1 text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold border border-gray-200">
                      <Calendar size={12} />
                      POSTED: {formatDate(item.createdAt)}
                    </span>

                    {item.dueDate && (
                      <span className="flex items-center gap-1 text-[11px] bg-red-50 text-red-600 px-2 py-1 rounded-md font-bold border border-red-100">
                        <Clock size={12} />
                        DUE: {formatDate(item.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {item.instruction && (
              <div className="mb-8">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Instructions
                </h3>

                <p className="text-sm text-gray-700 leading-relaxed bg-blue-50/30 p-4 rounded-lg border-l-4 border-blue-200">
                  {item.instruction}
                </p>
              </div>
            )}

            {/* Questions */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-[#0B56A4]" />
                Questions ({item.questions?.length || 0})
              </h3>

              <div className="grid gap-6">
                {item.questions?.map((q, qIdx) => (
                  <div
                    key={q._id || qIdx}
                    className="p-5 border border-gray-200 rounded-xl hover:border-[#0B56A4]/30 transition-colors"
                  >
                    {/* Question Header */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-[#0B56A4] bg-blue-50 px-2 py-1 rounded uppercase tracking-tighter">
                        Question {qIdx + 1}
                      </span>

                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {q.type === "multiple"
                          ? "Multiple Answers"
                          : "Single Choice"}
                      </span>
                    </div>

                    {/* Question Text */}
                    <p className="text-base font-semibold text-gray-800 mb-5">
                      {q.questionText}
                    </p>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options?.map((option, oIdx) => {
                        const isCorrect = q.correctAnswers?.includes(oIdx);

                        return (
                          <div
                            key={oIdx}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all
                              ${
                                isCorrect
                                  ? "bg-green-50 border-green-300 ring-1 ring-green-200"
                                  : "bg-white border-gray-100"
                              }
                            `}
                          >
                            <div className="flex-shrink-0">
                              {isCorrect ? (
                                <CheckCircle2
                                  size={18}
                                  className="text-green-600"
                                />
                              ) : (
                                <Circle size={18} className="text-gray-200" />
                              )}
                            </div>

                            <span
                              className={`text-sm ${
                                isCorrect
                                  ? "text-green-800 font-bold"
                                  : "text-gray-600"
                              }`}
                            >
                              {option}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => setIsDetailview(false)}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all"
            >
              Back to List
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuizDetailView;
