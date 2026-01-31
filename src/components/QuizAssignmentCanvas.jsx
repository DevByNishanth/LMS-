import { X } from "lucide-react";
import React from "react";

const QuizAssignmentCanvas = ({setIsAssignmentModalOpen}) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"></div>
      <div className="bg-white absolute top-0 right-0 w-[40%] h-full z-60">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-medium">Quiz Assignment</h2>
          <button
            onClick={() => setIsAssignmentModalOpen(false)}
            className="btn-container bg-gray-200 w-8 h-8 flex items-center hover:bg-gray-300 justify-center rounded-full cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </>
  );
};

export default QuizAssignmentCanvas;
