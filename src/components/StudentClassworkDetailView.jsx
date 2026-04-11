import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  Send,
  Link as LinkIcon,
  Video,
  FileText,
  ExternalLink,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Eye,
  CheckSquare,
  Square,
  Edit3,
} from "lucide-react";
import assignmentIcon from "../assets/assignmentWorkIcon.svg";
import StudentSubmissionModal from "./StudentSubmissionModal";
import StudentSubmissionViewModal from "./StudentSubmissionViewModal";
import StudentQuestionSubmissionModal from "./StudentQuestionSubmissionModal";

const StudentClassworkDetailView = ({ selectedAssignment, setIsDetailview }) => {
  const [commentText, setCommentText] = useState("");
  const [firstLetter, setFirstLetter] = useState("");
  const [item, setItem] = useState(selectedAssignment);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isQuestionSubmissionModalOpen, setIsQuestionSubmissionModalOpen] = useState(false);
  const [isSubmissionViewModalOpen, setIsSubmissionViewModalOpen] = useState(false);

  useEffect(() => {
    setItem(selectedAssignment);
  }, [selectedAssignment]);

  useEffect(() => {
    // Mock user data for student
    const mockName = "Student User";
    if (mockName) {
      setFirstLetter(mockName[0]?.toUpperCase());
    }
  }, []);

  // Handle posting comments (mock functionality for now)
  const handlePostComment = () => {
    if (!commentText.trim()) return;

    // Mock comment posting
    const newComment = {
      _id: Date.now().toString(),
      name: "You",
      comment: commentText,
      createdAt: new Date().toISOString(),
    };

    setItem((prev) => ({
      ...prev,
      comments: [...(Array.isArray(prev.comments) ? prev.comments : []), newComment],
    }));
    setCommentText("");
  };

  // Determine type for breadcrumb
  const isQuestion =
    item.itemType === "question" || item.questionType !== undefined;
  const isMaterial = item.itemType === "material" || item.key === "Material";

  return (
    <>
      <div className="breadcrumb-section flex items-center mb-4">
        <span
          onClick={() => {
            setIsDetailview(false);
          }}
          className="text-[#0B56A4] cursor-pointer font-medium"
        >
          {isQuestion
            ? "Questions"
            : isMaterial
              ? "Materials"
              : "Assignments"}
        </span>
        <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
        <span className="font-medium text-gray-600">Detail view</span>
      </div>

      <section className="w-full max-h-[calc(100vh-190px)] overflow-y-auto">
        <div className="rounded-lg border border-gray-200 bg-[#F9F9F9]">
          {/* Header */}
          <div className="flex justify-between items-start p-4 border-b border-gray-200 sticky top-0 z-10 bg-[#F9F9F9] rounded-t-lg">
            <div className="flex gap-3 items-center w-full">
              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-[#08384F] flex items-center justify-center text-white font-semibold">
                <img
                  src={assignmentIcon}
                  alt="assignmentIcon"
                  className="w-6 h-6"
                />
              </div>

              {/* Title */}
              <div className="flex gap-1 justify-between w-full">
                <h2 className="font-medium text-gray-900">
                  {selectedAssignment?.title}{" "}
                  {selectedAssignment.marks && (
                    <span className="text-[#0B56A4] font-semibold ml-1 text-sm">
                      ( {selectedAssignment.marks} Points )
                    </span>
                  )}
                </h2>
                <div className="flex flex-col items-end">
                  <p className="text-xs text-[#646464]">
                    Posted on{" "}
                    <span className="">
                      {selectedAssignment?.createdAt &&
                        new Date(selectedAssignment.createdAt).toLocaleString()}
                    </span>
                  </p>
                  {selectedAssignment.dueDate && (
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">
                        Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-4 pt-2">
            <p className="text-sm text-gray-700 leading-relaxed">
              {selectedAssignment?.instruction}
            </p>

            {/* Attachments Section */}
            <div className="flex flex-wrap gap-3 mt-4">
              {/* Files */}
              {selectedAssignment?.attachments?.map((fileUrl, index) => (
                <a
                  key={index}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <FileText className="w-5 h-5 text-[#0B56A4]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                      {fileUrl
                        .split("/")
                        .pop()
                        .split("-")
                        .slice(2)
                        .join("-") || "Attachment"}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                      File
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                </a>
              ))}

              {/* External Link */}
              {selectedAssignment?.link && (
                <a
                  href={selectedAssignment.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <LinkIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                      {selectedAssignment.link}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                      Link
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                </a>
              )}

              {/* YouTube Link */}
              {selectedAssignment?.youtubeLink && (
                <a
                  href={selectedAssignment.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <Video className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                      YouTube Video
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                      YouTube
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                </a>
              )}
            </div>
          </div>

          {/* Student Actions */}
          <div className="flex justify-end px-4 mb-2 space-x-2">
            {item.itemType === "assignment" && (
              <>
                <button
                  onClick={() => setIsSubmissionViewModalOpen(true)}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye size={16} />
                  View Submission
                </button>
                <button
                  onClick={() => setIsSubmissionModalOpen(true)}
                  className="flex items-center gap-2 bg-[#08384F] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0B56A4]/90"
                >
                  <CheckCircle size={16} />
                  Submit Assignment
                </button>
              </>
            )}
            {item.itemType === "question" && (
              <button
                onClick={() => setIsQuestionSubmissionModalOpen(true)}
                className="flex items-center gap-2 bg-[#08384F] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0B56A4]/90"
              >
                <Edit3 size={16} />
                Submit Answer
              </button>
            )}
          </div>

          {/* Comments */}
          <div className="mt-4 pt-3 border-t border-gray-200 px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <span className="text-black font-medium">
                {item.comments?.length > 0
                  ? `${item.comments.length} Class comments`
                  : "Class comments"}
              </span>
            </div>

            {/* Comments List */}
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
              {item.comments && item.comments.length > 0 ? (
                item.comments.map((comment, idx) => (
                  <div key={comment._id || idx} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs flex-shrink-0">
                      {comment.name ? comment.name[0]?.toUpperCase() : "U"}
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-900">
                          {comment.name || "User"}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(comment.createdAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center italic">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            {/* Add Comment Input */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#08384F] flex items-center justify-center text-white text-xs flex-shrink-0">
                {firstLetter || "U"}
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a class comment..."
                  className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#0B56A4]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePostComment();
                  }}
                />
                <button
                  onClick={handlePostComment}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0B56A4] hover:bg-blue-50 p-1 rounded-full"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Modal */}
      <StudentSubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        assignmentType={item.itemType}
        assignmentTitle={selectedAssignment?.title}
        assignmentId={selectedAssignment?._id}
      />

      {/* Submission View Modal */}
      <StudentSubmissionViewModal
        isOpen={isSubmissionViewModalOpen}
        onClose={() => setIsSubmissionViewModalOpen(false)}
        assignmentId={selectedAssignment?._id}
        assignmentTitle={selectedAssignment?.title}
      />

      {/* Question Submission Modal */}
      <StudentQuestionSubmissionModal
        isOpen={isQuestionSubmissionModalOpen}
        onClose={() => setIsQuestionSubmissionModalOpen(false)}
        questionData={item}
        onSubmit={(submissionData) => {
          // Handle question submission
          console.log("Question submitted:", submissionData);
          // Mock success feedback
          alert("Answer submitted successfully!");
        }}
      />
    </>
  );
};

export default StudentClassworkDetailView;