import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const AddStudentCanvas = ({
  onClose,
  isEdit,
  setIsEdit,
  editData,
  handleApicall,
}) => {
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("single");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    registerNumber: "",
    rollNumber: "",
    department: "",
    year: "",
    section: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        firstName: editData.firstName || "",
        lastName: editData.lastName || "",
        registerNumber: editData.registerNumber || "",
        rollNumber: editData.rollNumber || "",
        department: editData.department || "",
        year: editData.year || "",
        section: editData.section || "",
        email: editData.email || "",
        mobileNumber: editData.mobileNumber || "",
        password: editData.password || "",
      });
    }
  }, [isEdit, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEdit && editData?._id) {
        await axios.put(
          `${apiUrl}api/students/update/${editData._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        alert("Student updated successfully!");
      } else {
        await axios.post(`${apiUrl}api/students/add`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Student added successfully!");
      }
      onClose();
      setIsEdit(false);
      if (handleApicall) handleApicall();
    } catch (err) {
      console.error("Error occurred: ", err);
      alert(`Failed to ${isEdit ? "update" : "add"} student`);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      ></div>

      <section className="w-[40%] bg-white absolute right-0 top-0 h-screen z-[60] flex flex-col shadow-2xl transition-transform duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Edit Student Details" : "Add Student Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {!isEdit && (
          <div className="px-6 mt-4">
            <div className="flex bg-gray-100 p-1 rounded-xl w-full">
              <button
                className={`py-2.5 rounded-lg text-sm w-1/2 font-semibold transition-all ${
                  activeTab === "single"
                    ? "bg-white text-[#0B56A4] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("single")}
              >
                Single Entry
              </button>
              <button
                className={`py-2.5 rounded-lg text-sm w-1/2 font-semibold transition-all ${
                  activeTab === "multiple"
                    ? "bg-white text-[#0B56A4] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("multiple")}
              >
                Multiple Upload
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "single" ? (
            <div className="space-y-5 pb-20">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    placeholder="First Name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Register Number
                </label>
                <input
                  type="text"
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  placeholder="Enter Register Number"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  placeholder="Enter Roll Number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Select Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:bg-white focus:border-[#08384F] transition-all outline-none"
                  >
                    <option value="">Select Year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:bg-white focus:border-[#08384F] transition-all outline-none"
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Section
                </label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  placeholder="Enter Section"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Email ID
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  placeholder="Enter Email"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  placeholder="Enter Mobile Number"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  placeholder="Enter Password"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl p-12 text-center hover:bg-blue-50/50 hover:border-[#0B56A4] transition-all group cursor-pointer">
                <div className="p-4 bg-white rounded-full shadow-sm w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
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
                <p className="text-sm font-bold text-gray-800">
                  Drop Excel/CSV file here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  or click to browse your files
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
          <button
            className="flex-1 px-4 py-3 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600 hover:text-gray-800 transition-all shadow-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={activeTab === "single" ? handleSubmit : undefined}
            className="flex-1 px-4 py-3 bg-[#08384F] text-white rounded-xl text-sm font-bold hover:bg-[#0b3a53] transition-all shadow-md active:scale-95"
          >
            {isEdit
              ? "Update Student"
              : activeTab === "multiple"
                ? "Upload File"
                : "Save Student"}
          </button>
        </div>
      </section>
    </>
  );
};

export default AddStudentCanvas;
