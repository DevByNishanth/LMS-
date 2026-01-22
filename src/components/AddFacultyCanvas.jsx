import { X, UploadCloud } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
// mui imports
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// stepper data
const steps = ["Personal Details", "Job Details", "Documents"];

const AddFacultyCanvas = ({ setIsCanvas, isEdit, editData, setIsEdit }) => {

  console.log("isEdit:", isEdit);
  // Auth

  const apiUrl = import.meta.env.VITE_API_URL; // from .env file
  const token = localStorage.getItem("LmsToken");

  // ref's
  const panelRef = useRef();
  const fileInputRef = useRef(null);

  // states

  const [activeTab, setActiveTab] = useState("single");
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [experienceCertificate, setExperienceCertificate] = useState(null);
  const [marksheets, setMarksheets] = useState([]);
  const [degreeCertificate, setDegreeCertificate] = useState(null);
  const [error, setError] = useState("");

  // 🔹 State for form fields
  const [formData, setFormData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    qualification: "",
    workType: "",
    employeeId: "",
    joiningDate: "",
    jobTitle: "",
    designation: "",
    reportingManager: "",
    department: "",
    noticePeriod: "",
  });

  // 🔹 Populate form data when editing
  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        salutation: editData.salutation || "",
        firstName: editData.firstName || "",
        lastName: editData.lastName || "",
        gender: editData.gender || "",
        dob: editData.dob || "",
        email: editData.email || "",
        phone: editData.mobileNumber || "",
        qualification: editData.qualification || "",
        workType: editData.workType || "",
        employeeId: editData.employeeId || "",
        joiningDate: editData.joiningDate || "",
        jobTitle: editData.jobTitle || "",
        designation: editData.designation || "",
        reportingManager: editData.reportingManager || "",
        department: editData.department || "",
        noticePeriod: editData.noticePeriod || "",
      });
    }
  }, [isEdit, editData]);

  const validateFiles = (files, field) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError("Only PDF or DOC/DOCX files are allowed.");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should not exceed 5 MB.");
        return false;
      }
    }

    if (field === "marksheet" && files.length + marksheets.length > 6) {
      setError("You can upload a maximum of 6 marksheets.");
      return false;
    }
    if (
      (field === "degree" && degreeCertificate) ||
      (field === "experience" && experienceCertificate)
    ) {
      setError("Only one file is allowed for this field.");
      return false;
    }

    setError("");
    return true;
  };

  const handleDocumentUpload = (e, field) => {
    const files = Array.from(e.target.files);
    if (!validateFiles(files, field)) return;

    if (field === "experience") setExperienceCertificate(files[0]);
    if (field === "marksheet") setMarksheets((prev) => [...prev, ...files]);
    if (field === "degree") setDegreeCertificate(files[0]);
  };

  const handleRemove = (field, index) => {
    if (field === "experience") setExperienceCertificate(null);
    if (field === "marksheet")
      setMarksheets((prev) => prev.filter((_, i) => i !== index));
    if (field === "degree") setDegreeCertificate(null);
  };

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const isExcel =
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls");
      if (isExcel) {
        setFile(selectedFile);
      } else {
        alert("Please upload an Excel file (.xlsx or .xls).");
      }
    }
  };

  // Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const isExcel =
        droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls");
      if (isExcel) {
        setFile(droppedFile);
      } else {
        alert("Please upload an Excel file (.xlsx or .xls).");
      }
    }
  };

  // Cancel selected file
  const handleCancel = () => {
    setFile(null);
    fileInputRef.current.value = "";
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file before uploading.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${apiUrl}api/faculty/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        setFile(null);
        fileInputRef.current.value = "";
      } else {
        alert("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setIsUploading(false);
    }
  };

  // 🔹 Handle Submit
  // 🔹 Handle Submit - Perfect Add/Edit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // ✅ Map frontend field names to backend field names
      const mappedData = {
        salutation: formData.salutation,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        dateOfBirth: formData.dob,
        email: formData.email,
        mobileNumber: formData.phone,
        qualification: formData.qualification,
        workType: formData.workType,
        employeeId: formData.employeeId,
        joiningDate: formData.joiningDate,
        jobTitle: formData.jobTitle,
        designation: formData.designation,
        reportingManager: formData.reportingManager,
        department: formData.department,
        noticePeriod: formData.noticePeriod,
      };

      // ✅ Append mapped fields to FormData
      Object.entries(mappedData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // ✅ Append documents
      if (experienceCertificate) {
        data.append("experienceCertificate", experienceCertificate);
      }
      if (degreeCertificate) {
        data.append("degreeCertificate", degreeCertificate);
      }
      marksheets.forEach((file, index) => {
        data.append("markSheet", file);
      });

      // ✅ Dynamic API endpoint and method based on edit mode
      let url, method;
      if (isEdit && editData?._id) {
        // EDIT MODE - PUT request
        url = `${apiUrl}api/faculty/faculty/${editData._id}`;
        method = 'PUT';
      } else {
        // ADD MODE - POST request
        url = `${apiUrl}api/faculty/add-faculty`;
        method = 'POST';
      }

      // ✅ Make the API call
      const response = await axios({
        method,
        url,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ Add auth header
        },
      });

      // ✅ Success handling
      if (response.status === 200 || response.status === 201) {

        setIsCanvas(false);
        setIsEdit(false); // Reset edit mode
        // Optional: Reset form or emit event to parent for refresh
        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Error", isEdit ? "updating" : "adding", "faculty:", error);

      // ✅ Better error handling
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert(`Failed to ${isEdit ? "update" : "add"} faculty. Please try again.`);
      }
    }
  };


  // stepper navigation
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-50"></div>

      {/* Canvas */}
      <section
        ref={panelRef}
        className="w-[40%] bg-white h-[100vh] z-[60] fixed right-0 top-0 shadow-xl transition-all duration-300 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200">
          <h1 className="font-medium text-lg text-gray-800">
            {isEdit ? "Edit Faculty Details" : "Add Faculty Details"}

          </h1>
          <div
            onClick={() => { setIsEdit(false); setIsCanvas(false) }}
            className="cursor-pointer rounded-full w-8 h-8 flex justify-center items-center bg-slate-100 hover:bg-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </div>
        </div>

        {/* Tabs */}
        {!isEdit && <div className="flex bg-[#E6E9F5] rounded-full mx-6 mt-2 p-1">
          <button
            onClick={() => setActiveTab("single")}
            className={` w-1/2  py-2 text-md font-medium rounded-full cursor-pointer transition-all duration-200 ${activeTab === "single"
              ? "bg-[#0B56A4] text-white"
              : "text-gray-600"
              }`}
          >
            Single Entry
          </button>

          <button
            onClick={() => setActiveTab("multiple")}
            className={`w-1/2 py-2 text-md font-medium rounded-full cursor-pointer transition-all duration-200 ${activeTab === "multiple"
              ? "bg-[#0B56A4] text-white"
              : "text-gray-600"
              }`}
          >
            Multiple Upload
          </button>

        </div>}



        {/* stepper  */}

        <div className="stepper-container mt-4">
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "single" ? (
            <>
              {/* Single Entry Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1 - Personal Details */}
                {activeStep === 0 && (
                  <>
                    <div className="personal-details-form h-[calc(100vh-280px)] overflow-y-auto p-2 space-y-4">
                      {/* Row 1 */}
                      <div className="container-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Salutation
                          </label>
                          <select
                            name="salutation"
                            value={formData.salutation}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                          >
                            <option value="">Select</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Ms.">Ms.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="Dr.">Dr.</option>
                            <option value="Prof.">Prof.</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                            placeholder="Enter First Name"
                          />
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="container-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                            placeholder="Enter Last Name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="container-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                            placeholder="Enter Email"
                          />
                        </div>
                      </div>

                      {/* Row 4 */}
                      <div className="container-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                            placeholder="Enter Phone Number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Qualification
                          </label>
                          <input
                            type="text"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                            placeholder="Enter Qualification"
                          />
                        </div>
                      </div>

                      {/* Row 5 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Work Type
                        </label>
                        <select
                          name="workType"
                          value={formData.workType}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                        >
                          <option value="">Select Work Type</option>
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Visiting">Visiting</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-end mt-4 absolute bottom-4 right-4">
                      <button
                        onClick={handleNext}
                        className="bg-[#0B56A4] text-white px-4 py-2 rounded-md hover:bg-[#0b55a4dc] cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}

                {/* Step 2 - Job Details */}
                {activeStep === 1 && (
                  <div className="jobdetails-form ">
                    <div className="form-container h-[calc(100vh-280px)] overflow-y-auto p-2 space-y-4">
                      {/* Row 1 */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Employee ID
                          </label>
                          <input
                            type="text"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                            placeholder="Enter Employee ID"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Joining Date
                          </label>
                          <input
                            type="date"
                            name="joiningDate"
                            value={formData.joiningDate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                          />
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title
                          </label>
                          <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                            placeholder="Enter Job Title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Designation
                          </label>
                          <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                            placeholder="Enter Designation"
                          />
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reporting Manager
                          </label>
                          <select
                            name="reportingManager"
                            value={formData.reportingManager}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                          >
                            <option value="">Select Manager</option>
                            <option value="John Doe">John Doe</option>
                            <option value="Jane Smith">Jane Smith</option>
                            <option value="Michael Brown">Michael Brown</option>
                            <option value="Emily Johnson">Emily Johnson</option>
                            <option value="David Wilson">David Wilson</option>
                            <option value="Sarah Miller">Sarah Miller</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                          </label>
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                          >
                            <option value="">Select Department</option>
                            <option value="ECE">ECE</option>
                            <option value="MECH">MECH</option>
                            <option value="AI & ML">AI & ML</option>
                            <option value="EEE">EEE</option>
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="CSBS">CSBS</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 4 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notice Period
                        </label>
                        <select
                          name="noticePeriod"
                          value={formData.noticePeriod}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                        >
                          <option value="">Select Notice Period</option>
                          <option value="One Month">One Month</option>
                          <option value="Three Months">Three Months</option>
                        </select>
                      </div>
                    </div>

                    <div className="button-container flex justify-between gap-4 absolute bottom-4  right-3">
                      <button
                        onClick={handleBack}
                        className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleNext}
                        className="bg-[#0B56A4] text-white px-4 py-2 rounded-md hover:bg-[#0B56A4] cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 - Documents Upload */}
                {activeStep === 2 && (
                  <div className="Documents-form">
                    <div className="form-container h-[calc(100vh-280px)] overflow-y-auto p-2 space-y-4">
                      {/* Experience Certificate */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Experience Certificate
                        </p>
                        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                          <div className="flex flex-col items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400 mb-2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 16v-8m0 0l-3 3m3-3l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-sm text-gray-500">
                              Drag & drop file or{" "}
                              <span className="text-blue-600">Browse</span>
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              handleDocumentUpload(e, "experience")
                            }
                            accept=".pdf,.doc,.docx"
                          />
                        </label>

                        {experienceCertificate && (
                          <div className="flex justify-between items-center text-sm bg-gray-100 border border-gray-200 rounded  px-2 py-1">
                            <span>{experienceCertificate.name}</span>
                            <button
                              className="text-red-500 hover:text-red-700 cursor-pointer text-xs"
                              onClick={() => handleRemove("experience")}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Marksheet */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Marksheet
                        </p>
                        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                          <div className="flex flex-col items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400 mb-2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 16v-8m0 0l-3 3m3-3l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-sm text-gray-500">
                              Drag & drop files or{" "}
                              <span className="text-blue-600">Browse</span>
                            </p>
                          </div>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) =>
                              handleDocumentUpload(e, "marksheet")
                            }
                            accept=".pdf,.doc,.docx"
                          />
                        </label>

                        {marksheets.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {marksheets.map((file, index) => (
                              <li
                                key={index}
                                className=" flex justify-between items-center text-sm bg-gray-100 border border-gray-200 rounded  px-2 py-1"
                              >
                                <span>{file.name}</span>
                                <button
                                  className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                                  onClick={() =>
                                    handleRemove("marksheet", index)
                                  }
                                >
                                  Cancel
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Degree Certificate */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Degree Certificate
                        </p>
                        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                          <div className="flex flex-col items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400 mb-2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 16v-8m0 0l-3 3m3-3l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-sm text-gray-500">
                              Drag & drop file or{" "}
                              <span className="text-blue-600">Browse</span>
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleDocumentUpload(e, "degree")}
                            accept=".pdf,.doc,.docx"
                          />
                        </label>

                        {degreeCertificate && (
                          <div className=" flex justify-between items-center text-sm bg-gray-100 border border-gray-200 rounded  px-2 py-1">
                            <span>{degreeCertificate.name}</span>
                            <button
                              className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                              onClick={() => handleRemove("degree")}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>

                      {error && (
                        <p className="text-red-600 text-sm mt-2">{error}</p>
                      )}
                    </div>

                    <div className="button-container flex justify-end gap-3">
                      <button
                        onClick={handleBack}
                        className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        // onClick={() => alert("Form Submitted!")}
                        className="bg-[#0B56A4] text-white px-4 py-2 rounded-md hover:bg-[#0B56A4] cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                {/* <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCanvas(false)}
                    className="px-4 py-2 bg-[#FAFAFA] text-black rounded-md text-md border border-gray-300 cursor-pointer hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 bg-[#0B56A4] text-white rounded-md text-sm cursor-pointer font-medium px-6"
                  >
                    Save
                  </button>
                </div> */}
              </form>
            </>
          ) : (
            <>
              {/* Multiple Upload */}
              <div
                className="border border-dashed border-gray-400 rounded-md py-10 flex flex-col items-center justify-center text-gray-600 text-sm bg-gray-50"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()} // Prevent default behavior to allow drop
              >
                <UploadCloud className="w-10 h-10 mb-2 text-gray-500" />
                <p>
                  Drag & drop files or{" "}
                  <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Browse
                  </span>
                </p>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                {file && (
                  <div className="mt-4 text-center">
                    <p className="text-gray-700 text-sm">{file.name}</p>
                    <button
                      onClick={handleCancel}
                      className="mt-2 text-red-500 text-xs hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsCanvas(false)}
                  className="px-4 py-2 bg-[#FAFAFA] text-black rounded-md text-md border border-gray-300 cursor-pointer hover:bg-gray-100"
                >
                  Cancel
                </button>
                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={`py-2 px-6 rounded-md text-sm font-medium text-white cursor-pointer ${isUploading
                    ? "bg-gray-400"
                    : "bg-[#0B56A4] hover:bg-[#0a4c91]"
                    }`}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default AddFacultyCanvas;
