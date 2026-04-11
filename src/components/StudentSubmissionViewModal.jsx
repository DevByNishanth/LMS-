import React, { useState, useEffect } from "react";
import axios from "axios";
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

const StudentSubmissionViewModal = ({ isOpen, onClose, assignmentTitle, assignmentId }) => {
  const [submissionData, setSubmissionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && assignmentId) {
      const fetchSubmission = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("LmsToken");
          const apiUrl = import.meta.env.VITE_API_URL;

          const response = await axios.get(`${apiUrl}api/my-submission/${assignmentId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          let data = response.data?.submission || response.data?.data || response.data;
          // Handle array if API returns list of submissions for some reason
          if (Array.isArray(data) && data.length > 0) {
            data = data[0];
          }
          setSubmissionData(data);
        } catch (err) {
          console.error("Error fetching submission details:", err);
          setError(err.response?.data?.message || "Failed to load submission details.")
        } finally {
          setIsLoading(false);
        }
      };

      fetchSubmission();
    }
  }, [isOpen, assignmentId]);

  // Adapt the API response to the format expected by the UI
  const currentSubmission = submissionData ? {
    submittedAt: submissionData.submittedAt || submissionData.createdAt || new Date().toISOString(),
    files: submissionData.files || (submissionData.attachments ? submissionData.attachments.map((url, index) => ({
      id: index,
      name: url.split('/').pop().split('-').slice(2).join('-') || url.split('/').pop() || "Attachment",
      size: 0,
      type: url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? 'image/png' : 'application/pdf', // fallback interpretation
      url: url
    })) : []),
    score: submissionData.score !== undefined ? submissionData.score : (submissionData.marksObtained !== undefined ? submissionData.marksObtained : null),
    feedback: submissionData.feedback || submissionData.comments || null
  } : null;

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


  const cancelFile = async (fileId) => {
    const file = currentSubmission?.files?.find(f => f.id === fileId);
    if (!file || !file.url) return;

    try {
      const token = localStorage.getItem("LmsToken");
      const apiUrl = import.meta.env.VITE_API_URL;

      const fileName = file.url.split('/').pop();
      // const payloadUrl = `${apiUrl}uploads/${fileName}`;
      const payloadUrl = fileName
      console.log("file url to remove : ", payloadUrl)

      await axios.delete(`${apiUrl}api/remove-file/${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          fileUrl: payloadUrl
        }
      });

      setSubmissionData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          attachments: prev.attachments?.filter(url => url !== file.url),
          files: prev.files ? prev.files.filter(f => f.id !== fileId) : undefined
        };
      });

      alert("File removed successfully");
    } catch (error) {
      console.error("Error removing file:", error);
      alert(error.response?.data?.message || "Error removing file. Please try again.");
    }
  };

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
          {/* Loading / Error States */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-[#08384F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {/* Submission Info */}
          {!isLoading && !error && currentSubmission && (
            <>
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
                      {currentSubmission.score !== null && currentSubmission.score !== undefined && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>Score: {currentSubmission.score}</span>
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
                        <div className="close-icon  cursor-pointer" onClick={() => cancelFile(file.id)}><X size={16} className="text-red-500" /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Section (if feedback exists) */}
              {currentSubmission.feedback && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-bold text-gray-800 mb-2">Feedback:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{currentSubmission.feedback}</p>
                </div>
              )}

              {/* Unsubmit Button */}
              {currentSubmission.files && currentSubmission.files.length > 0 && (
                <button className="bg-[#08384F] w-full text-white py-2 rounded-lg hover:bg-[#0B56A4] transition-colors mt-4">Unsubmit</button>
              )}

              {/* No Files Message */}
              {(!currentSubmission.files || currentSubmission.files.length === 0) && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <File size={40} className="mx-auto mb-2 text-gray-300" />
                  <p>No files submitted yet</p>
                </div>
              )}
            </>
          )}

          {/* No Submission State */}
          {!isLoading && !error && !currentSubmission && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <File size={40} className="mx-auto mb-2 text-gray-300" />
              <p>No submission found</p>
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