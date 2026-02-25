import { X, UploadCloud } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = ["Personal Details", "Job Details", "Documents"];

const designations = [
  "Professor",
  "Assistant Professor",
  "Associate Professor",
  "HOD",
  "Dean",
  "Faculty",
  "Professor of Practice",
  "Lab Technician",
  "Department Secretary",
  "Senior Lab Technician",
  "admin",
];

const AddFacultyCanvas = ({ setIsCanvas, isEdit, editData, setIsEdit }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");

  const panelRef = useRef();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("single");
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [experienceCertificate, setExperienceCertificate] = useState(null);
  const [marksheets, setMarksheets] = useState([]);
  const [degreeCertificate, setDegreeCertificate] = useState(null);
  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleCancel = () => {
    setFile(null);
    fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file before uploading.");
      return;
    }

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch(`${apiUrl}api/faculty/upload`, {
        method: "POST",
        body: formDataUpload,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
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

      Object.entries(mappedData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (experienceCertificate)
        data.append("experienceCertificate", experienceCertificate);
      if (degreeCertificate)
        data.append("degreeCertificate", degreeCertificate);
      marksheets.forEach((file) => data.append("markSheet", file));

      let url, method;
      if (isEdit && editData?._id) {
        url = `${apiUrl}api/faculty/faculty/${editData._id}`;
        method = "PUT";
      } else {
        url = `${apiUrl}api/faculty/add-faculty`;
        method = "POST";
      }

      const response = await axios({
        method,
        url,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setIsCanvas(false);
        setIsEdit(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Error:", error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert(`Failed to save faculty. Please try again.`);
      }
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"></div>
      <section
        ref={panelRef}
        className="w-[40%] bg-white h-screen z-[60] fixed right-0 top-0 shadow-2xl transition-all duration-300 ease-in-out overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h1 className="font-semibold text-xl text-gray-800">
            {isEdit ? "Edit Faculty Details" : "Add Faculty Details"}
          </h1>
          <button
            onClick={() => {
              setIsEdit(false);
              setIsCanvas(false);
            }}
            className="rounded-full w-9 h-9 flex justify-center items-center bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {!isEdit && (
          <div className="px-6 mt-4">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("single")}
                className={`w-1/2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === "single"
                    ? "bg-white text-[#0B56A4] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Single Entry
              </button>
              <button
                onClick={() => setActiveTab("multiple")}
                className={`w-1/2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === "multiple"
                    ? "bg-white text-[#0B56A4] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Multiple Upload
              </button>
            </div>
          </div>
        )}

        {activeTab === "single" && (
          <div className="px-6 py-4">
            <Box sx={{ width: "100%", mb: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </div>
        )}

        <div className="px-6 pb-24">
          {activeTab === "single" ? (
            <form onSubmit={handleSubmit}>
              {activeStep === 0 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Salutation
                      </label>
                      <select
                        name="salutation"
                        value={formData.salutation}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                      >
                        <option value="">Select</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                        placeholder="First Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                        placeholder="Last Name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] transition-all outline-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                        placeholder="Enter Email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                        placeholder="Phone Number"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Qualification
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                        placeholder="e.g. PhD, M.Tech"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Work Type
                    </label>
                    <select
                      name="workType"
                      value={formData.workType}
                      onChange={handleChange}
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] transition-all outline-none"
                    >
                      <option value="">Select Work Type</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Visiting">Visiting</option>
                    </select>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                        placeholder="Emp ID"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Joining Date
                      </label>
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Job Title
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                        placeholder="Job Title"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Designation
                      </label>
                      <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] transition-all outline-none"
                      >
                        <option value="">Select Designation</option>
                        {designations.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Reporting Manager
                      </label>
                      <select
                        name="reportingManager"
                        value={formData.reportingManager}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] transition-all outline-none"
                      >
                        <option value="">Select Manager</option>
                        <option value="John Doe">John Doe</option>
                        <option value="Jane Smith">Jane Smith</option>
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
                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] transition-all outline-none"
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

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Notice Period
                    </label>
                    <select
                      name="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={handleChange}
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#08384F] transition-all outline-none"
                    >
                      <option value="">Select Notice Period</option>
                      <option value="One Month">One Month</option>
                      <option value="Three Months">Three Months</option>
                    </select>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Experience Certificate
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 cursor-pointer hover:bg-blue-50/50 hover:border-[#0B56A4] transition-all group">
                      <div className="flex flex-col items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-gray-400 group-hover:scale-110 transition-transform mb-2" />
                        <p className="text-xs text-gray-500 font-medium">
                          PDF or DOCX (Max 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload(e, "experience")}
                        accept=".pdf,.doc,.docx"
                      />
                    </label>
                    {experienceCertificate && (
                      <div className="flex justify-between items-center text-xs bg-blue-50 border border-blue-100 rounded-lg p-2 font-semibold text-blue-700">
                        <span className="truncate max-w-[200px]">
                          {experienceCertificate.name}
                        </span>
                        <button
                          onClick={() => handleRemove("experience")}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Marksheets (Max 6)
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 cursor-pointer hover:bg-blue-50/50 hover:border-[#0B56A4] transition-all group">
                      <div className="flex flex-col items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-gray-400 group-hover:scale-110 transition-transform mb-2" />
                        <p className="text-xs text-gray-500 font-medium">
                          Upload Academic Records
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleDocumentUpload(e, "marksheet")}
                        accept=".pdf,.doc,.docx"
                      />
                    </label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {marksheets.map((file, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 font-medium text-gray-600"
                        >
                          <span className="truncate max-w-[200px]">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleRemove("marksheet", index)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Degree Certificate
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 cursor-pointer hover:bg-blue-50/50 hover:border-[#0B56A4] transition-all group">
                      <div className="flex flex-col items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-gray-400 group-hover:scale-110 transition-transform mb-2" />
                        <p className="text-xs text-gray-500 font-medium">
                          Upload Final Degree
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
                      <div className="flex justify-between items-center text-xs bg-emerald-50 border border-emerald-100 rounded-lg p-2 font-semibold text-emerald-700">
                        <span className="truncate max-w-[200px]">
                          {degreeCertificate.name}
                        </span>
                        <button
                          onClick={() => handleRemove("degree")}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="text-rose-500 text-xs font-bold text-center bg-rose-50 p-2 rounded-lg">
                      {error}
                    </p>
                  )}
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              <div
                className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50/50 hover:border-[#0B56A4] transition-all group cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-10 h-10 text-[#0B56A4]" />
                </div>
                <p className="text-sm font-bold text-gray-800">
                  Drop Excel files here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  or{" "}
                  <span
                    className="text-[#0B56A4] font-bold underline decoration-2 underline-offset-4 cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Browse your files
                  </span>
                </p>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                {file && (
                  <div className="mt-6 bg-white border border-gray-100 rounded-xl p-3 shadow-sm w-full animate-in slide-in-from-bottom-2">
                    <p className="text-sm font-bold text-gray-700 truncate">
                      {file.name}
                    </p>
                    <button
                      onClick={handleCancel}
                      className="mt-1 text-rose-500 text-xs font-bold hover:underline"
                    >
                      Remove file
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 right-0 w-[40%] bg-white border-t border-gray-100 p-6 flex gap-3 z-20">
          {activeTab === "single" ? (
            <>
              {activeStep !== 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600 hover:text-gray-800 transition-all shadow-sm"
                >
                  Previous
                </button>
              )}
              {activeStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-[#08384F] text-white rounded-xl text-sm font-bold hover:bg-[#0b3a53] transition-all shadow-md active:scale-95"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-[#08384F] text-white rounded-xl text-sm font-bold hover:bg-[#0b3a53] transition-all shadow-md active:scale-95"
                >
                  Next
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setIsCanvas(false)}
                className="flex-1 py-3 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600 hover:text-gray-800 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || !file}
                className="flex-1 py-3 bg-[#08384F] text-white rounded-xl text-sm font-bold hover:bg-[#0b3a53] transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Upload File"}
              </button>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default AddFacultyCanvas;
