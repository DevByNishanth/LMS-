import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Plus, X, Download } from "lucide-react";
import deleteIcon from "../assets/delete.svg";
import editIcon from "../assets/edit.svg";
import TimetableDeleteModal from "./TimetableDeleteModal";
import CollegeLogo from "../assets/logosece.png";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const daysArray = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function TimeTable() {
  const [filters, setFilters] = useState({
    year: "1st Year",
    semester: "1",
    section: "Section A",
  });
  const [tableData, setTableData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalData, setModalData] = useState({
    day: "",
    time: "",
    oldTime: "",
  });
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modalInputs, setModalInputs] = useState({
    subjectName: "",
    facultyName: "",
    subjectId: "",
    facultyId: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const timetableRef = React.useRef(null);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("LmsToken");
      if (!token) return;

      const decoded = jwtDecode(token);
      const department = decoded.department || "CSE";

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/timetable/class`,
        {
          params: {
            department: department,
            year: filters.year,
            section: filters.section,
            semester: filters.semester,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Set tableData directly as backend now returns the structured object
      setTableData(response.data || {});
    } catch (err) {
      console.error("Error fetching timetable:", err);
      setTableData({}); // Reset on error
    } finally {
      setLoading(false);
    }
  };

  const prepareSlots = () => {
    if (!tableData.headers || !tableData.breaks) return [];

    const slots = [];

    // Add periods
    tableData.headers.forEach((header, index) => {
      slots.push({
        ...header,
        type: "period",
        originalIndex: index,
      });
    });

    // Add breaks
    Object.entries(tableData.breaks).forEach(([key, time]) => {
      const name = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .replace("Break", "")
        .trim();
      slots.push({
        type: "break",
        name: name,
        time: time,
      });
    });

    // Helper to convert "HH:MMAM/PM" to minutes for sorting
    const getTimeVal = (timeStr) => {
      const start = timeStr.split(" - ")[0].trim();
      const match = start.match(/^(\d+):(\d+)(AM|PM)$/i);
      if (!match) return 0;

      let [_, hours, minutes, modifier] = match;
      let h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);

      if (modifier.toUpperCase() === "PM" && h !== 12) h += 12;
      if (modifier.toUpperCase() === "AM" && h === 12) h = 0;

      return h * 60 + m;
    };

    slots.sort((a, b) => getTimeVal(a.time) - getTimeVal(b.time));

    return slots;
  };

  const slots = prepareSlots();

  const fetchFaculties = async () => {
    try {
      const token = localStorage.getItem("LmsToken");
      if (!token) return;
      const decoded = jwtDecode(token);
      const dept = decoded.department || "CSE";

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/faculty`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("fac details : ", response.data);
      const filteredStaffs = response.data.filter(
        (item) => item.firstName.toLowerCase() !== "super",
      );
      setFaculties(filteredStaffs);
    } catch (err) {
      console.error("Error fetching faculties:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("LmsToken");
      if (!token) return;
      const decoded = jwtDecode(token);
      const dept = decoded.department || "CSE";

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/subjects/${dept}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("subject details : ", response.data.subjects);

      setSubjects(response.data.subjects || []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  React.useEffect(() => {
    fetchTimetable();
    fetchFaculties();
    fetchSubjects();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDownloadPDF = () => {
    if (!tableData.rows) return;
    const pdfSlots = prepareSlots();
    const printWindow = window.open("", "_blank");

    const htmlContent = `
        <html>
            <head>
                <title>Timetable - ${tableData.department}</title>
                <style>
                    @page { 
                        size: landscape; 
                        margin: 10mm; 
                    }
                    body { 
                        font-family: 'Segoe UI', Arial, sans-serif; 
                        margin: 0; 
                        padding: 0; 
                        color: #000; 
                    }
                    .header-wrapper {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .college-logo { 
                        height: 80px; 
                        margin-bottom: 10px;
                        object-fit: contain; 
                    }
                    .info-bar {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        padding: 0 5px;
                        margin-bottom: 10px;
                        border-bottom: 2px solid #08384F;
                        padding-bottom: 5px;
                    }
                    .left-info {
                        text-align: left;
                    }
                    .right-info {
                        text-align: right;
                    }
                    .text-label {
                        font-size: 12px;
                        text-transform: uppercase;
                        color: #555;
                        font-weight: 600;
                    }
                    .text-bold {
                        font-size: 18px;
                        color: #08384F;
                        font-weight: 800;
                        margin-left: 5px;
                    }

                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        table-layout: fixed; 
                        border: 2px solid #000; 
                    }
                    th, td { 
                        border: 1px solid #000; 
                        padding: 10px 4px; 
                        text-align: center; 
                        vertical-align: middle; 
                        word-wrap: break-word; 
                    }
                    
                    th { 
                        background-color: #08384F !important; 
                        color: white !important; 
                        -webkit-print-color-adjust: exact; 
                        font-size: 12px;
                        letter-spacing: 0.5px;
                    }
                    .day-col { 
                        background-color: #f8f8f8 !important; 
                        font-weight: 800; 
                        width: 80px; 
                        font-size: 14px; 
                        color: #08384F;
                        -webkit-print-color-adjust: exact; 
                    }
                    .break-cell { 
                        background-color: #fdfdfd !important; 
                        font-weight: 800; 
                        font-size: 11px; 
                        color: #333; 
                        letter-spacing: 2px;
                        -webkit-print-color-adjust: exact; 
                    }
                    .subject { 
                        font-weight: 700; 
                        font-size: 12px; 
                        display: block; 
                        line-height: 1.2; 
                        margin-bottom: 3px; 
                    }
                    .faculty { 
                        font-size: 10px; 
                        color: #444; 
                        display: block; 
                    }
                    .time-sub { 
                        font-size: 9px; 
                        font-weight: 400; 
                        display: block; 
                        margin-top: 4px; 
                        color: #ddd;
                    }
                </style>
            </head>
            <body>
                <div class="header-wrapper">
                    <img src="${CollegeLogo}" class="college-logo" />
                </div>

                <div class="info-bar">
                    <div class="left-info">
                        <span class="text-label">Department:</span>
                        <span class="text-bold">${tableData.department || "IT"}</span>
                        <span class="text-label" style="margin-left: 20px;">Section:</span>
                        <span class="text-bold">${filters.section}</span>
                    </div>
                    <div class="right-info">
                        <span class="text-label">Semester:</span>
                        <span class="text-bold">${filters.semester}</span>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 80px;">DAY</th>
                            ${pdfSlots
                              .map(
                                (slot) => `
                                <th>
                                    ${slot.type === "break" ? slot.name.toUpperCase() : `PERIOD<br/><span class="time-sub">${slot.time}</span>`}
                                </th>
                            `,
                              )
                              .join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${tableData.rows
                          .map(
                            (row) => `
                            <tr>
                                <td class="day-col">${row.day.substring(0, 3).toUpperCase()}</td>
                                ${pdfSlots
                                  .map((slot) => {
                                    if (slot.type === "break") {
                                      return `<td class="break-cell">BREAK</td>`;
                                    }
                                    const entry =
                                      row.periods[slot.originalIndex];
                                    return `<td>${
                                      entry
                                        ? `
                                        <span class="subject">${entry.subjectName}</span>
                                        <span class="faculty">${entry.facultyName}</span>
                                    `
                                        : "-"
                                    }</td>`;
                                  })
                                  .join("")}
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </body>
            <script>
                window.onload = function() { 
                    window.print(); 
                    window.onafterprint = function() { window.close(); };
                };
            </script>
        </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const openModal = (day, time) => {
    setIsEditing(false);
    setModalData({ day, time, oldTime: time });
    setModalInputs({
      subjectName: "",
      facultyName: "",
      subjectId: "",
      facultyId: "",
    });
    setShowModal(true);
  };

  const handleEdit = (day, time, entry) => {
    setIsEditing(true);
    setModalData({ day, time, oldTime: time });
    setModalInputs({
      subjectName: entry.subjectName,
      facultyName: entry.facultyName,
      subjectId: entry.subjectId,
      facultyId: entry.facultyId,
    });
    setShowModal(true);
  };

  const openDeleteModal = (day, time) => {
    const token = localStorage.getItem("LmsToken");
    if (!token) return;
    const decoded = jwtDecode(token);
    const department = decoded.department || "CSE";

    setDeleteData({
      department,
      year: filters.year,
      semester: parseInt(filters.semester),
      section: filters.section,
      day,
      time,
    });
    setShowDeleteModal(true);
  };

  const handleModalInputChange = (e) => {
    setModalInputs({ ...modalInputs, [e.target.name]: e.target.value });
  };

  const handleSubjectSelect = (e) => {
    const subId = e.target.value;
    const sub = subjects.find((s) => s._id === subId);
    console.log("selected subject : ", subId);
    if (sub) {
      setModalInputs({
        ...modalInputs,
        subjectId: subId,
        subjectName: sub.subject,
      });
    } else {
      setModalInputs({
        ...modalInputs,
        subjectId: "",
        subjectName: "",
      });
    }
  };

  const handleFacultySelect = (e) => {
    const staffId = e.target.value;
    const staff = faculties.find((f) => f._id === staffId);
    if (staff) {
      setModalInputs({
        ...modalInputs,
        facultyId: staffId,
        facultyName: staff.firstName || staff.name || "",
      });
    } else {
      setModalInputs({
        ...modalInputs,
        facultyId: "",
        facultyName: "",
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("LmsToken");
      if (!token) return;

      const decoded = jwtDecode(token);
      const department = decoded.department || "CSE";

      const payload = {
        department: department,
        year: filters.year,
        semester: parseInt(filters.semester),
        section: filters.section,
        day: modalData.day,
        subjectId: modalInputs.subjectId,
        subjectName: modalInputs.subjectName,
        facultyId: modalInputs.facultyId,
        facultyName: modalInputs.facultyName,
      };

      if (isEditing) {
        // Update Payload
        const updatePayload = {
          ...payload,
          oldTime: modalData.oldTime,
          newTime: modalData.time,
        };
        await axios.put(
          `${import.meta.env.VITE_API_URL}api/timetable/update`,
          updatePayload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        // Save Payload
        const savePayload = {
          ...payload,
          time: modalData.time,
        };
        await axios.post(
          `${import.meta.env.VITE_API_URL}api/timetable/save`,
          savePayload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }

      setShowModal(false);
      fetchTimetable(); // Refresh data
    } catch (err) {
      console.error("Error saving timetable entry:", err);
      alert(err.response?.data?.message || "Failed to save entry");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 ">
      {/* Header with Title & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl ">
        <div>
          <h2 className="text-xl font-semibold text-[#08384F]">
            {tableData.department || "Timetable"}
            <span className="text-gray-600 font-normal ml-2 text-sm">
              {filters.year} • Sem {filters.semester} • {filters.section}
            </span>
          </h2>
        </div>
        <div className="flex gap-3">
          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="border border-gray-200 w-[160px] outline-none focus:ring-2 focus:ring-[#08384F]/20 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 cursor-pointer transition-all"
          >
            {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            name="semester"
            value={filters.semester}
            onChange={handleFilterChange}
            className="border border-gray-200 w-[160px] outline-none focus:ring-2 focus:ring-[#08384F]/20 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 cursor-pointer transition-all"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={String(s)}>
                Semester {s}
              </option>
            ))}
          </select>
          <select
            name="section"
            value={filters.section}
            onChange={handleFilterChange}
            className="border border-gray-200 w-[160px] outline-none focus:ring-2 focus:ring-[#08384F]/20 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 cursor-pointer transition-all"
          >
            {["Section A", "Section B", "Section C", "Section D"].map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-700 transition-all font-medium text-sm shadow-md hover:shadow-lg"
        >
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* Table Container */}
      <div
        className="time-table-container bg-white border border-slate-100 overflow-hidden"
        ref={timetableRef}
      >
        <div className="overflow-x-auto max-h-[calc(100vh-220px)]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#08384F]  bg  text-white ">
                <th className="sticky top-0 left-0 z-30 bg-[#08384F]  bg  p-5 text-left font-medium text-sm border-b border-white/10 uppercase tracking-wider w-[180px] min-w-[180px]">
                  Day
                </th>
                {slots.length > 0 ? (
                  slots.map((slot, idx) => (
                    <th
                      key={idx}
                      className={`sticky top-0 z-20 p-4 text-center border-b border-white/10 w-[180px] min-w-[180px] ${slot.type === "break" ? "bg-[#062c3e] italic text-white" : "bg-[#08384F]  bg"}`}
                    >
                      <div className="flex flex-col gap-1">
                        {/* <span className="text-[10px] opacity-70 font-medium">
                                                {slot.type === 'period' ? `PERIOD ${slot.period}` : 'BREAK'}
                                            </span> */}
                        <span className="text-sm font-medium tracking-tight">
                          {slot.type === "break"
                            ? slot.name
                            : slot.time.split(" - ")[0]}
                        </span>
                        <span className="text-[10px] opacity-100">
                          {slot.type === "period" ? slot.time : slot.time}
                        </span>
                      </div>
                    </th>
                  ))
                ) : (
                  <th className="p-4 text-center w-[180px] min-w-[180px]">
                    Loading Slots...
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={slots.length + 1} className="p-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-[#08384F]/10 rounded-full"></div>
                        <div className="absolute top-0 w-16 h-16 border-4 border-[#08384F] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-slate-500 font-semibold animate-pulse">
                        Syncing Timetable Database...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : tableData.rows && tableData.rows.length > 0 ? (
                tableData.rows.map((row, rowIndex) => (
                  <tr
                    key={row.day}
                    className="group hover:bg-slate-50/80 transition-colors h-[120px]"
                  >
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/80 p-5 font-bold text-[#08384F] border-r border-slate-100 transition-colors w-[180px] min-w-[180px]">
                      {row.day}
                    </td>
                    {slots.map((slot, slotIdx) => {
                      if (slot.type === "break") {
                        return (
                          <td
                            key={slotIdx}
                            className="bg-gray-200 p-4 text-center group-hover:bg-gray-400 transition-colors w-[180px] min-w-[180px]"
                          >
                            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em] vertical-rl rotate-180">
                              • {slot.name}•
                            </span>
                          </td>
                        );
                      }

                      const periodEntry = row.periods[slot.originalIndex];

                      return (
                        <td
                          key={slotIdx}
                          className="p-4 transition-all relative w-[180px] min-w-[180px]"
                        >
                          {periodEntry ? (
                            <div className="group/card h-full flex flex-col justify-center">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                  <span className="text-xs font-medium text-slate-800 line-clamp-2 leading-tight">
                                    {periodEntry.subjectName}
                                  </span>
                                  <div className="flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0">
                                    <button
                                      onClick={() =>
                                        handleEdit(
                                          row.day,
                                          slot.time,
                                          periodEntry,
                                        )
                                      }
                                      className="p-1 hover:bg-blue-50 cursor-pointer rounded transition-colors"
                                    >
                                      <img
                                        src={editIcon}
                                        className="w-5 h-5 flex-shrink-0 object-contain"
                                        alt="Edit"
                                      />
                                    </button>
                                    <button
                                      onClick={() =>
                                        openDeleteModal(row.day, slot.time)
                                      }
                                      className="p-1 hover:bg-red-50 cursor-pointer rounded transition-colors"
                                    >
                                      <img
                                        src={deleteIcon}
                                        className="w-5 h-5 flex-shrink-0 object-contain"
                                        alt="Delete"
                                      />
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 mt-auto">
                                  <div className="w-1 h-1 bg-[#08384F]  bg  rounded-full"></div>
                                  <span className="text-[12px] font-medium text-slate-500 truncate">
                                    {periodEntry.facultyName}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="group/add flex items-center justify-center h-full">
                              <button
                                onClick={() => openModal(row.day, slot.time)}
                                className="opacity-0 group-hover/add:opacity-100 flex flex-col items-center gap-1 text-[10px] font-bold text-[#08384F] transition-all transform hover:scale-105"
                              >
                                <div className="bg-[#08384F]  bg  p-2 rounded-full mb-1">
                                  <Plus className="w-4 h-4 text-white" />
                                </div>
                                Add
                              </button>
                              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none group-hover/add:hidden">
                                <Plus className="w-6 h-6 text-slate-200" />
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={slots.length + 1} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-slate-300">
                        <X className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      </div>
                      <p className="text-slate-400 font-medium italic">
                        No timetable schedule found for this criteria.
                      </p>
                      <button
                        onClick={fetchTimetable}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        Reload Data
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white md:w-[40%] rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {isEditing ? "Edit Time Table Entry" : "Add Time Table Entry"}
              </h2>
              <X
                className="cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="input-container w-full">
                  <p className="text-sm mb-1 font-medium">Select Subject</p>
                  <select
                    name="subjectId"
                    value={modalInputs.subjectId}
                    onChange={handleSubjectSelect}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Choose Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="input-container w-full">
                  <p className="text-sm mb-1 font-medium">Select Faculty</p>
                  <select
                    name="facultyId"
                    value={modalInputs.facultyId}
                    onChange={handleFacultySelect}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Choose Staff</option>
                    {faculties.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.firstName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#08384F]  bg  cursor-pointer hover:bg-[#08394fe8]"} text-white py-2 rounded mt-2 flex items-center justify-center gap-2`}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <TimetableDeleteModal
          setIsDelete={setShowDeleteModal}
          deleteData={deleteData}
          onSuccess={fetchTimetable}
        />
      )}
    </div>
  );
}
