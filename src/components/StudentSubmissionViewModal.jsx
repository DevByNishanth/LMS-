import React from "react";
import {
  X,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileAudio,
  FileVideo,
  File,
  CheckCircle,
  Clock,
  Calendar,
  Eye,
  Download,
} from "lucide-react";

const StudentSubmissionViewModal = ({ isOpen, onClose, submissionData, assignmentTitle }) => {
  // Mock submission data for demonstration
  const mockSubmission = {
    submittedAt: "2024-03-24T15:30:00Z",
    files: [
      {
        id: "file1",
        name: "assignment_solution.pdf",
        size: 2048000,
        type: "application/pdf",
        url: "https://example.com/submissions/assignment_solution.pdf"
      },
      {
        id: "file2", 
        name: "code_implementation.png",
        size: 1024000,
        type: "image/png",
        url: "https://example.com/submissions/code_implementation.png"
      }
    ],
    score: 8,
    feedback: "Good work! Please review the comments in the PDF."
  };

  const currentSubmission = submissionData || mockSubmission;

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return <FileText className="w-6 h-6 text-red-500" />;
    if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') 
      return <FileText className="w-6 h-6 text-blue-500" />;
    if (fileType.startsWith('image/')) return <FileImage className="w-6 h-6 text-green-500" />;
    if (fileType.includes('spreadsheet')) return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
    if (fileType.includes('audio')) return <FileAudio className="w-6 h-6 text-purple-500" />;
    if (fileType.includes('video')) return <FileVideo className="w-6 h-6 text-orange-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#08384F] flex items-center justify-center text-white">
              <Eye size={24} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                View Submission
              </h2>
              <p className="text-sm text-gray-600">{assignmentTitle}</p>
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
        <div className="p-6 space-y-6">
          {/* Submission Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Submission Details:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-blue-700">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Submitted: {formatDate(currentSubmission.submittedAt)}</span>
                  </div>
                  {currentSubmission.score && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>Score: {currentSubmission.score}/10</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Files */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Submitted Files ({currentSubmission.files?.length || 0})</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {currentSubmission.files?.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Eye size={16} className="text-blue-500" />
                    </a>
                    <a
                      href={file.url}
                      download={file.name}
                      className="p-1 hover:bg-green-50 rounded-full transition-colors"
                    >
                      <Download size={16} className="text-green-500" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
         <button className="bg-[#08384F] w-full text-white py-2 rounded-lg">Unsubmit</button>

          {/* No Files Message */}
          {(!currentSubmission.files || currentSubmission.files.length === 0) && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <File size={40} className="mx-auto mb-2 text-gray-300" />
              <p>No files submitted yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmissionViewModal;