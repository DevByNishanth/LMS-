import React, { useState } from "react";
import {
  X,
  Upload,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileAudio,
  FileVideo,
  File,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const StudentSubmissionModal = ({ isOpen, onClose, assignmentType, assignmentTitle, assignmentId }) => {
  console.log("assignment id : ", assignmentId)
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp'
  ];

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    const errors = [];

    selectedFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size exceeds 5MB limit`);
      } else if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: File type not supported`);
      } else {
        validFiles.push({
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        });
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (fileId) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return <FileText className="w-6 h-6 text-red-500" />;
    if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      return <FileText className="w-6 h-6 text-blue-500" />;
    if (fileType.startsWith('image/')) return <FileImage className="w-6 h-6 text-emerald-800" />;
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

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('Please select at least one file to submit');
      return;
    }

    setIsUploading(true);

    const token = localStorage.getItem("LmsToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    const formData = new FormData();
    files.forEach(f => {
      formData.append('attachments', f.file);
    });

    try {
      await axios.post(
        `${apiUrl}api/submit-assignment/${assignmentId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Assignment submitted successfully!');
      onClose();
      setFiles([]);
      setUploadProgress({});
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#08384F] flex items-center justify-center text-white">
              <Upload size={24} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Submit {assignmentType === 'assignment' ? 'Assignment' : 'Answer'}
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
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg px-8 py-4 text-center hover:border-[#0B56A4] transition-colors">
            <div className="flex flex-col items-center gap-2">
              <Upload size={20} className="text-gray-400" />
              <div>
                <h3 className="font-medium text-sm text-gray-900">Upload your files</h3>
                <p className="text-[12px] text-gray-600 mt-1">
                  PDF, DOC, DOCX, JPG, PNG, GIF, BMP, WebP (Max 5MB each)
                </p>
              </div>
              <label className="bg-[#08384F] text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-[#0B56A4] transition-colors">
                Choose Files
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Selected Files ({files.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
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
                      {file.preview && (
                        <img
                          src={file.preview}
                          alt="preview"
                          className="w-12 h-12 object-cover rounded border border-gray-200"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {uploadProgress[file.id] !== undefined && (
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#0B56A4] h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress[file.id]}%` }}
                          ></div>
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <X size={18} className="text-red-800" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-black-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-black-900">
                <p className="font-medium">Submission Guidelines:</p>
                <ul className="list-disc list-inside mt-1 space-y-1 text-slate-900">
                  <li>Maximum file size: 5MB per file</li>
                  <li>Supported formats: PDF, DOC, DOCX, and image files</li>
                  <li>You can upload multiple files</li>
                  <li>Files will be processed after submission</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Total files: {files.length} | Max size: 5MB each
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={files.length === 0 || isUploading}
              className="px-8 py-2 bg-[#08384F] text-white rounded-lg hover:bg-[#0B56A4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmissionModal;