import React, { useState } from "react";
import {
  X,
  CheckCircle,
  Square,
  CheckSquare,
  Edit3,
  Send,
} from "lucide-react";

const StudentQuestionSubmissionModal = ({
  isOpen,
  onClose,
  questionData,
  onSubmit
}) => {
  const [answerText, setAnswerText] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle option selection for multiple choice
  const handleOptionToggle = (optionIndex) => {
    if (questionData.questionType === "Multiple Choice") {
      // Multiple selection allowed
      setSelectedOptions(prev =>
        prev.includes(optionIndex)
          ? prev.filter(idx => idx !== optionIndex)
          : [...prev, optionIndex]
      );
    } else {
      // Single selection for short answer (though typically not used)
      setSelectedOptions([optionIndex]);
    }
  };

  // Submit answer
  const handleSubmit = async () => {
    if (questionData.questionType === "Short Answer" && !answerText.trim()) {
      alert("Please provide an answer for the short answer question.");
      return;
    }

    if ((questionData.questionType === "Multiple Choice" || questionData.questionType === "Single Choice") && selectedOptions.length === 0) {
      alert("Please select an option before submitting.");
      return;
    }

    const submissionData = {
      questionId: questionData._id,
      questionType: questionData.questionType,
      answerText: answerText.trim(),
      selectedOptions: selectedOptions,
      submittedAt: new Date().toISOString()
    };

    try {
      // Call parent submit function
      if (onSubmit) {
        await onSubmit(submissionData);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[calc(100vh-100px)] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#08384F] flex items-center justify-center text-white">
              <Edit3 size={24} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Submit Answer
              </h2>
              <p className="text-sm text-gray-600">{questionData.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Question Type Badge */}
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {questionData.questionType}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
              {questionData.marks || 10} Points
            </span>
          </div>

          {/* Question Text */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
            <p className="text-gray-700">{questionData.instruction}</p>
          </div>

          {/* Answer Input */}
          {questionData.questionType === "Short Answer" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Your Answer
              </label>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={6}
                placeholder="Type your answer here..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0B56A4] focus:border-transparent resize-none"
              />
            </div>
          )}

          {/* Multiple Choice / Single Choice Options */}
          {(questionData.questionType === "Multiple Choice" || questionData.questionType === "Single Choice") && questionData.options && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Select your answer(s)
              </label>
              <div className="space-y-2">
                {questionData.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${selectedOptions.includes(index)
                      ? "border-[#0B56A4] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <input
                      type={questionData.questionType === "Multiple Choice" ? "checkbox" : "radio"}
                      name="question-option"
                      checked={selectedOptions.includes(index)}
                      onChange={() => handleOptionToggle(index)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      {selectedOptions.includes(index) ? (
                        <CheckSquare size={20} className="text-[#0B56A4] shrink-0" />
                      ) : (
                        <Square size={20} className="text-gray-400 shrink-0" />
                      )}
                      <span className="text-gray-700">{option.text || option}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#08384F] text-white rounded-lg hover:bg-[#0B56A4] transition-colors flex items-center gap-2"
          >
            <Send size={16} />
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentQuestionSubmissionModal;