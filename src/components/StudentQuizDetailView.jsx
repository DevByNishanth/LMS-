import React, { useState } from "react";
import {
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  Circle,
  ListChecks,
  Trophy,
  Calendar,
  Clock,
  Play,
  Timer,
  CheckCircle,
  X,
} from "lucide-react";

const StudentQuizDetailView = ({ selectedAssignment, setIsDetailview }) => {
  // State management
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Prevent crash if data is not ready
  if (!selectedAssignment) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 font-medium">
        Loading quiz...
      </div>
    );
  }

  const item = selectedAssignment;

  // Handle quiz submission
  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    item.questions.forEach((question, qIdx) => {
      const userAnswer = userAnswers[qIdx];
      const correctAnswers = question.correctAnswers;
      
      if (question.type === "single") {
        if (userAnswer === correctAnswers[0]) {
          calculatedScore += 1;
        }
      } else if (question.type === "multiple") {
        const userAnswerSet = new Set(userAnswer || []);
        const correctAnswerSet = new Set(correctAnswers);
        const isCorrect = userAnswerSet.size === correctAnswerSet.size && 
                         [...userAnswerSet].every(answer => correctAnswerSet.has(answer));
        if (isCorrect) {
          calculatedScore += 1;
        }
      }
    });

    setScore(calculatedScore);
    setQuizSubmitted(true);
  };

  // Handle answer selection
  const handleAnswerChange = (qIdx, answerIdx, isMultiple = false) => {
    if (isMultiple) {
      const currentAnswers = userAnswers[qIdx] || [];
      const newAnswers = currentAnswers.includes(answerIdx)
        ? currentAnswers.filter(idx => idx !== answerIdx)
        : [...currentAnswers, answerIdx];
      setUserAnswers(prev => ({ ...prev, [qIdx]: newAnswers }));
    } else {
      setUserAnswers(prev => ({ ...prev, [qIdx]: answerIdx }));
    }
  };

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
        {!isTakingQuiz ? (
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

                <div className="flex flex-col items-end gap-2">
                  {item.instruction && (
                    <p className="text-sm text-gray-600 text-right max-w-md">
                      {item.instruction}
                    </p>
                  )}
                  
                  {!quizSubmitted && (
                    <button
                      onClick={() => setIsTakingQuiz(true)}
                      className="flex items-center gap-3 bg-[#08384F] text-white px-6 py-3 rounded-lg hover:bg-[#0B56A4] transition-colors font-semibold"
                    >
                      <Play size={20} />
                      Start Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Questions Preview */}
            <div className="p-6">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-[#0B56A4]" />
                Questions Preview ({item.questions?.length || 0})
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

                    {/* Options Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options?.map((option, oIdx) => (
                        <div
                          key={oIdx}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white transition-all hover:border-gray-200"
                        >
                          <div className="flex-shrink-0">
                            <Circle size={18} className="text-gray-300" />
                          </div>

                          <span className="text-sm text-gray-600">
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
        ) : (
          // Quiz Taking Interface
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-gray-50/80 p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#08384F] flex items-center justify-center text-white shadow-md">
                    <Timer size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Taking: {item.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Answer all questions and submit when ready
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-gray-600">
                    Questions: {item.questions?.length || 0}
                  </span>
                  <span className="text-sm text-gray-600">
                    Total Points: {item.marks || item.questions?.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {item.questions?.map((q, qIdx) => (
                <div
                  key={q._id || qIdx}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Question {qIdx + 1}: {q.questionText}
                      </h3>
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {q.type === "multiple" ? "Multiple Answers" : "Single Answer"}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {q.options?.map((option, oIdx) => {
                      const isSelected = q.type === "multiple" 
                        ? (userAnswers[qIdx] || []).includes(oIdx)
                        : userAnswers[qIdx] === oIdx;

                      return (
                        <label
                          key={oIdx}
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all
                            ${isSelected 
                              ? "border-[#0B56A4] bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300"
                            }
                          `}
                        >
                          <input
                            type={q.type === "multiple" ? "checkbox" : "radio"}
                            name={`question-${qIdx}`}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(qIdx, oIdx, q.type === "multiple")}
                            className="w-4 h-4 text-[#0B56A4] focus:ring-[#0B56A4]"
                          />
                          <span className="text-sm text-gray-800">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsTakingQuiz(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="px-8 py-3 bg-[#08384F] text-white rounded-lg hover:bg-[#0B56A4] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Results Modal */}
        {quizSubmitted && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Quiz Submitted!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your score: {score} out of {item.questions?.length || 0}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setIsTakingQuiz(false);
                      setUserAnswers({});
                      setScore(0);
                    }}
                    className="flex-1 px-6 py-3 bg-[#08384F] text-white rounded-lg hover:bg-[#0B56A4] transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setUserAnswers({});
                      setScore(0);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentQuizDetailView;