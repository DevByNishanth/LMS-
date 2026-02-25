import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const AddSubjectCanvas = ({
  isOpen,
  onClose,
  editingSubject,
  selectedDept,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    subject: "",
    department: selectedDept,
    type: "Theory",
  });

  const [activeTab, setActiveTab] = useState("single");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (editingSubject) {
      setFormData({
        code: editingSubject.code || "",
        subject: editingSubject.subject || "",
        department: editingSubject.department || "",
        type: editingSubject.type || "Theory",
      });
    } else {
      setFormData({
        code: "",
        subject: "",
        department: selectedDept,
        type: "Theory",
      });
    }
  }, [editingSubject, isOpen, selectedDept]);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExcelTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!validExcelTypes.includes(file.type)) {
        alert("Please select a valid Excel file (.xls or .xlsx)");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadExcel = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", selectedFile);
      const response = await axios.post(
        `${apiUrl}api/subjects/uploadExcel`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("File uploaded successfully!");
        setSelectedFile(null);
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.code ||
      !formData.subject ||
      !formData.department ||
      !formData.type
    ) {
      alert("All fields are required");
      return;
    }
    setLoading(true);
    try {
      let response;
      if (editingSubject) {
        response = await axios.put(
          `${apiUrl}api/subjects/subjects/update/${editingSubject._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        response = await axios.post(`${apiUrl}api/subjects`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (response.status === 200 || response.status === 201) {
        alert(
          editingSubject
            ? "Subject updated successfully!"
            : "Subject added successfully!",
        );
        onClose();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      ></div>

      <section className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-2xl z-[60] flex flex-col transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
            {editingSubject ? "Edit Subject" : "Add Subject"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {!editingSubject && (
            <div className="flex bg-gray-100 p-1.5 rounded-xl">
              <button
                onClick={() => setActiveTab("single")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "single"
                    ? "bg-white text-[#0B56A4] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Single Entry
              </button>
              <button
                onClick={() => setActiveTab("multiple")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "multiple"
                    ? "bg-white text-[#0B56A4] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Bulk Upload
              </button>
            </div>
          )}

          {activeTab === "single" ? (
            <form
              onSubmit={handleSubmit}
              id="add-subject-form"
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-0.5">
                  Subject Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. SUB007"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-0.5">
                  Subject Name
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineering"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-0.5">
                  Subject Type
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#08384F] transition-all outline-none appearance-none"
                  >
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                    <option value="Theory & Lab">Theory & Lab</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-blue-50/50 hover:border-[#0B56A4] transition-all group cursor-pointer"
                >
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8 text-[#0B56A4]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Drop Excel file here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    or click to browse your files
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 p-6 border border-blue-100 rounded-2xl bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-gray-800 truncate max-w-[180px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelFile}
                      className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors text-gray-400 hover:text-rose-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-white hover:text-gray-800 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            type={activeTab === "single" ? "submit" : "button"}
            form={activeTab === "single" ? "add-subject-form" : undefined}
            onClick={activeTab === "multiple" ? handleUploadExcel : undefined}
            disabled={loading || (activeTab === "multiple" && !selectedFile)}
            className="flex-1 px-4 py-3 bg-[#08384F] text-white rounded-xl text-sm font-bold hover:bg-[#0b3a53] transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Processing..."
              : editingSubject
                ? "Update Subject"
                : activeTab === "multiple"
                  ? "Upload Excel"
                  : "Save Subject"}
          </button>
        </div>
      </section>
    </>
  );
};

export default AddSubjectCanvas;
