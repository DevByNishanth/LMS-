import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const AddSubjectCanvas = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    code: "",
    subject: "",
    department: "",
  });

  const [activeTab, setActiveTab] = useState("single");
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.code || !formData.subject || !formData.department) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}api/subjects`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Subject added successfully!");
        setFormData({ code: "", subject: "", department: "" });
        onClose();
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      alert(error.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Canvas Panel */}
      <section className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-2xl z-[60] flex flex-col transition-transform duration-300 ease-in-out transform translate-x-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-medium text-gray-800 tracking-tight">Add Subject</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6">
          {/* Entry Method Tabs */}
          <div className="flex bg-[#E6E9F5] py-2 px-3 rounded-full">
            <button
              onClick={() => setActiveTab("single")}
              className={`flex-1 py-2 text-md font-medium rounded-full transition-all ${activeTab === "single"
                ? "bg-white text-[#0B56A4]"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Single Entry
            </button>
            <button
              onClick={() => setActiveTab("multiple")}
              className={`flex-1 py-2 text-md font-medium rounded-full transition-all ${activeTab === "multiple"
                ? "bg-white text-[#0B56A4] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Bulk Upload
            </button>
          </div>

          {activeTab === "single" ? (
            <form onSubmit={handleSubmit} id="add-subject-form" className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-0.5">Subject Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. SUB007"
                  className="w-full bg-gray-50 border border-gray-200 mt-2 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-[#000000] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-md font-medium text-[#333333] ml-0.5">Subject Name</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineering"
                  className="w-full bg-gray-50 border border-gray-200 mt-2 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-[#000000] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-md font-medium text-[#333333] ml-0.5">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-[#000000] focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="IT">IT</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="AI & DS">AI & DS</option>
                </select>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-white transition-all group">
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
              <p className="text-sm font-medium text-gray-800">Drop Excel file here</p>
              <p className="text-xs text-gray-500 mt-1">or click to browse your files</p>
              <input type="file" className="hidden" />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white hover:text-gray-800 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-subject-form"
            disabled={loading || activeTab === "multiple"}
            className="flex-1 px-4 py-3 bg-[#0B56A4] text-white rounded-xl text-sm font-semibold hover:bg-[#084282] transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Subject"}
          </button>
        </div>
      </section>
    </>
  );
};

export default AddSubjectCanvas;
