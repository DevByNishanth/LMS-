import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Square,
  CheckSquare,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

const QuizAssignmentCanvas = ({ setIsAssignmentModalOpen, onClose }) => {
  const { classId, sectionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [quizData, setQuizData] = useState({
    title: "",
    instruction: "",
    dueDate: "",
    questions: [
      {
        questionText: "",
        type: "single",
        options: ["", ""],
        correctAnswers: [],
      },
    ],
  });

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prev) => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    const lastQuestion = quizData.questions[quizData.questions.length - 1];
    if (lastQuestion && !lastQuestion.questionText.trim()) return;

    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          type: "single",
          options: ["", ""],
          correctAnswers: [],
        },
      ],
    }));
  };

  const removeQuestion = (qIndex) => {
    if (quizData.questions.length > 1) {
      const newQuestions = quizData.questions.filter((_, i) => i !== qIndex);
      setQuizData({ ...quizData, questions: newQuestions });
    }
  };

  const handleQuestionTextChange = (qIndex, text) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].questionText = text;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleTypeChange = (qIndex, type) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].type = type;
    newQuestions[qIndex].correctAnswers = [];
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, text) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].options[oIndex] = text;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...quizData.questions];
    if (newQuestions[qIndex].options.length < 6) {
      newQuestions[qIndex].options.push("");
      setQuizData({ ...quizData, questions: newQuestions });
    }
  };

  const toggleCorrectAnswer = (qIndex, oIndex) => {
    const newQuestions = [...quizData.questions];
    const question = newQuestions[qIndex];

    if (question.type === "single") {
      question.correctAnswers = [oIndex];
    } else {
      if (question.correctAnswers.includes(oIndex)) {
        question.correctAnswers = question.correctAnswers.filter(
          (i) => i !== oIndex,
        );
      } else {
        question.correctAnswers.push(oIndex);
      }
    }
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const validate = () => {
    const newErrors = {};
    if (!quizData.title.trim()) newErrors.title = "Required";
    if (!quizData.dueDate) newErrors.dueDate = "Required";
    quizData.questions.forEach((q, idx) => {
      if (!q.questionText.trim()) newErrors[`q${idx}`] = "Required";
      if (q.correctAnswers.length === 0)
        newErrors[`q${idx}_ans`] = "Select Answer";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    console.log("run")
    if (!validate()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("LmsToken");
      const payload = {
        title: quizData.title,
        instruction: quizData.instruction,
        dueDate: quizData.dueDate,
        questions: quizData.questions,
        marks: quizData.questions.length,
        subjectId: classId,
        sectionId: sectionId,
        itemType: "quiz",
      };

      await axios.post(`${import.meta.env.VITE_API_URL}api/quiz`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAssignmentModalOpen(false);
      if (onClose) onClose();
    } catch (error) {
      console.error("Creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-end z-[100]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsAssignmentModalOpen(false)}
      ></div>

      <div className="relative w-full md:w-[50%] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-[#08384F]">Quiz Canvas</h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              Total Marks: {quizData.questions.length}
            </p>
          </div>
          <button
            onClick={() => setIsAssignmentModalOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-8 pb-32"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Title
                </label>
                <input
                  name="title"
                  required
                  value={quizData.title}
                  onChange={handleQuizChange}
                  className="w-full border-b-2 border-gray-100 py-2 text-lg font-bold outline-none focus:border-[#08384F] transition-colors"
                  placeholder="e.g. Midterm Mathematics Quiz"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Due Date
                </label>
                <input
                  name="dueDate"
                  required
                  type="date"
                  value={quizData.dueDate}
                  onChange={handleQuizChange}
                  className="w-full border rounded-lg p-2 mt-1 text-sm outline-none focus:ring-1 focus:ring-[#08384F]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {quizData.questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm relative group"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-[#08384F] text-white text-[10px] px-3 py-1 rounded-full font-bold">
                    QUESTION {qIdx + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <select
                      value={q.type}
                      onChange={(e) => handleTypeChange(qIdx, e.target.value)}
                      className="text-xs border rounded-md px-2 py-1 outline-none bg-gray-50 font-bold"
                    >
                      <option value="single">Single Choice</option>
                      <option value="multiple">Multiple Choice</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <textarea
                  value={q.questionText}
                  required
                  onChange={(e) =>
                    handleQuestionTextChange(qIdx, e.target.value)
                  }
                  placeholder="Enter your question here..."
                  className="w-full border-b border-gray-100 py-2 outline-none font-bold text-gray-800 resize-none focus:border-[#08384F] mb-4"
                  rows={2}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-gray-100 transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleCorrectAnswer(qIdx, oIdx)}
                        className="shrink-0"
                      >
                        {q.type === "single" ? (
                          q.correctAnswers.includes(oIdx) ? (
                            <CheckCircle2
                              className="text-green-500"
                              size={22}
                            />
                          ) : (
                            <Circle className="text-gray-200" size={22} />
                          )
                        ) : q.correctAnswers.includes(oIdx) ? (
                          <CheckSquare className="text-blue-500" size={22} />
                        ) : (
                          <Square className="text-gray-200" size={22} />
                        )}
                      </button>
                      <input
                        value={opt}
                        required
                        onChange={(e) =>
                          handleOptionChange(qIdx, oIdx, e.target.value)
                        }
                        placeholder={`Option ${oIdx + 1}`}
                        className="w-full text-sm outline-none border-b border-transparent focus:border-gray-200 py-1"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addOption(qIdx)}
                  className="mt-4 text-[10px] font-black text-blue-600 uppercase hover:underline"
                >
                  + Add Option
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-[#08384F] hover:text-[#08384F] transition-all flex items-center justify-center gap-2 font-bold"
          >
            <Plus size={20} /> Add New Question
          </button>
        </form>

        <div className="absolute bottom-0 w-full p-6 bg-white border-t border-gray-100 flex justify-end gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            onClick={() => setIsAssignmentModalOpen(false)}
            className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-2 bg-[#08384F] text-white rounded-xl font-bold text-sm hover:bg-[#0B56A4] disabled:opacity-50 transition-all"
          >
            {loading ? "Publishing..." : "Publish Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizAssignmentCanvas;
