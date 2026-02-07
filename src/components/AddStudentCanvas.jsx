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
  // Authorization
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("single"); // single | multiple

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

  // Populate form data when editing
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

  // Update fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      if (isEdit && editData?._id) {
        // EDIT MODE - PUT request
        const res = await axios.put(
          `${apiUrl}api/students/update/${editData._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        alert("Student updated successfully!");
        handleApicall();
      } else {
        // ADD MODE - POST request
        const res = await axios.post(`${apiUrl}api/students/add`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  console.log("student form data : ", formData);
  return (
    <>
      {/* Background blur */}
      <div className="fixed inset-0 bg-black/20 z-50" onClick={onClose}></div>

      {/* Canvas */}
      <section className="w-[40%] bg-white p-6 absolute right-0 top-0 h-screen z-60 ">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-xl font-medium">
            {isEdit ? "Edit Student Details" : "Add Student Details"}
          </h2>
          <button onClick={onClose}>
            <X size={22} className="text-gray-700 hover:text-black" />
          </button>
        </div>

        {/* Tabs */}
        {!isEdit && (
          <div className="flex bg-gray-100 p-1 rounded-full w-full mb-3">
            <button
              className={`px-6 py-3 rounded-full text-sm w-[50%] font-medium ${
                activeTab === "single"
                  ? "bg-[#0B56A4] text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("single")}
            >
              Single Entry
            </button>

            <button
              className={`px-6 py-2 rounded-full text-sm w-[50%] font-medium ${
                activeTab === "multiple"
                  ? "bg-[#0B56A4] text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("multiple")}
            >
              Multiple Upload
            </button>
          </div>
        )}

        {/* ------------------ SINGLE ENTRY FORM ------------------ */}
        {activeTab === "single" && (
          <>
            <div
              className={`space-y-4 ${isEdit ? "max-h-[calc(100vh-220px)]" : "max-h-[calc(100vh-220px)]"}  overflow-y-auto`}
            >
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-400 px-3 py-2 rounded-lg"
                  placeholder="Enter First Name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-400 px-3 py-2 rounded-lg"
                  placeholder="Enter Last Name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Register Number</label>
                <input
                  type="text"
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-400 px-3 py-2 rounded-lg"
                  placeholder="Enter Register Number"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-400 px-3 py-2 rounded-lg"
                  placeholder="Enter Roll Number"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Select Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-400 px-3 py-2 rounded-lg"
                >
                  <option value="">Select Year</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-400 px-3 py-2 rounded-lg"
                >
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Section</label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-400 px-3 py-2 rounded-lg"
                  placeholder="Enter Section"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-400 px-3 py-2 rounded-lg"
                  placeholder="Enter Email"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-400 px-3 py-2 rounded-lg"
                  placeholder="Enter Mobile Number"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-400 px-3 py-2 rounded-lg"
                  placeholder="Enter Password"
                />
              </div>

              {/* Buttons */}
            </div>
            <div className="flex justify-end gap-3 mt-2 absolute bottom-0 right-2 p-4">
              <button
                className="px-4 py-2 border rounded-lg cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#0B56A4] text-white rounded-lg cursor-pointer"
              >
                Save
              </button>
            </div>
          </>
        )}

        {/* ------------------ MULTIPLE UPLOAD ------------------ */}
        {activeTab === "multiple" && (
          <div className="mt-4">
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-10 text-center">
              <p className="text-gray-500 mb-2">
                Drag & drop files or{" "}
                <span className="text-blue-600 cursor-pointer">Browse</span>
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button className="px-4 py-2 border rounded-lg" onClick={onClose}>
                Cancel
              </button>
              <button className="px-5 py-2 bg-[#0B56A4] text-white rounded-lg">
                Upload
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AddStudentCanvas;
