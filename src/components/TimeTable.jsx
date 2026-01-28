import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Plus, X } from "lucide-react";
import deleteIcon from "../assets/delete.svg";
import editIcon from "../assets/edit.svg";
import TimetableDeleteModal from "./TimetableDeleteModal";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];




export default function TimeTable() {
    const [filters, setFilters] = useState({ year: "1st Year", semester: "1", section: "Section A" });
    const [tableData, setTableData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [modalData, setModalData] = useState({ day: "", time: "", oldTime: "" });
    const [faculties, setFaculties] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [modalInputs, setModalInputs] = useState({
        subjectName: "",
        facultyName: "",
        subjectId: "",
        facultyId: ""
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    const fetchTimetable = async () => {
        try {
            const token = localStorage.getItem("LmsToken");
            if (!token) return;

            const decoded = jwtDecode(token);
            const department = decoded.department || "CSE"; // Fallback to CSE if not found

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}api/timetable/class`,
                {
                    params: {
                        department: department,
                        year: filters.year,
                        section: filters.section,
                        semester: filters.semester
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = response.data;

            // Set tableData directly as backend now returns the structured object
            setTableData(data || {});
        } catch (err) {
            console.error("Error fetching timetable:", err);
        }
    };

    const fetchFaculties = async () => {
        try {
            const token = localStorage.getItem("LmsToken");
            if (!token) return;
            const decoded = jwtDecode(token);
            const dept = decoded.department || "CSE";

            const response = await axios.get(`${import.meta.env.VITE_API_URL}api/faculty/department/${dept}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("fac details : ", response.data.faculty)
            setFaculties(response.data.faculty || []);
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

            const response = await axios.get(`${import.meta.env.VITE_API_URL}api/subjects/${dept}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("subject details : ", response.data.subjects)
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

    const openModal = (day, time) => {
        setIsEditing(false);
        setModalData({ day, time, oldTime: time });
        setModalInputs({
            subjectName: "",
            facultyName: "",
            subjectId: "",
            facultyId: ""
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
            facultyId: entry.facultyId
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
            time
        });
        setShowDeleteModal(true);
    };

    const handleModalInputChange = (e) => {
        setModalInputs({ ...modalInputs, [e.target.name]: e.target.value });
    };

    const handleSubjectSelect = (e) => {
        const subId = e.target.value;
        const sub = subjects.find(s => s._id === subId);
        console.log("selected subject : ", subId)
        if (sub) {
            setModalInputs({
                ...modalInputs,
                subjectId: subId,
                subjectName: sub.subject
            });
        } else {
            setModalInputs({
                ...modalInputs,
                subjectId: "",
                subjectName: ""
            });
        }
    };

    const handleFacultySelect = (e) => {
        const staffId = e.target.value;
        const staff = faculties.find(f => f._id === staffId);
        if (staff) {
            setModalInputs({
                ...modalInputs,
                facultyId: staffId,
                facultyName: staff.firstName || staff.name || ""
            });
        } else {
            setModalInputs({
                ...modalInputs,
                facultyId: "",
                facultyName: ""
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
                facultyName: modalInputs.facultyName
            };

            if (isEditing) {
                // Update Payload
                const updatePayload = {
                    ...payload,
                    oldTime: modalData.oldTime,
                    newTime: modalData.time
                };
                await axios.put(`${import.meta.env.VITE_API_URL}api/timetable/update`, updatePayload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Save Payload
                const savePayload = {
                    ...payload,
                    time: modalData.time
                };
                await axios.post(`${import.meta.env.VITE_API_URL}api/timetable/save`, savePayload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
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
            {/* Filters */}
            <div className="flex justify-end gap-4 mb-4">
                <select name="year" value={filters.year} onChange={handleFilterChange} className="border rounded px-3 py-2">
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>
                <select name="semester" value={filters.semester} onChange={handleFilterChange} className="border rounded px-3 py-2">
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2 </option>
                    <option value="3">Semester 3 </option>
                    <option value="4">Semester 4 </option>
                    <option value="5">Semester 5 </option>
                    <option value="6">Semester 6 </option>
                    <option value="7">Semester 7 </option>
                    <option value="8">Semester 8 </option>
                </select>
                <select name="section" value={filters.section} onChange={handleFilterChange} className="border rounded px-3 py-2">
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                    <option value="Section D">Section D</option>
                </select>
            </div>

            {/* Table */}
            <div className=" bg-white max-h-[calc(100vh-165px)] overflow-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-[#08384F] text-white sticky top-0">
                        <tr>
                            <th className="p-3 text-left">Time Slot</th>
                            {days.map((day) => (
                                <th key={day} className="p-3 text-center">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(tableData).map((time, index) => (
                            <tr
                                key={time}
                                className={`${index % 2 === 1 ? "bg-[#E6E9F5]" : ""} border border-gray-200`}
                            >
                                <td className="p-3 font-medium text-[#333333]">{time}</td>

                                {days.map((day) => (
                                    <td key={day} className="p-4 text-center">
                                        {tableData[time]?.[day] ? (
                                            <div className="text-xs flex flex-col items-center gap-1 font-medium text-[#333333]">
                                                <div className="flex items-center justify-center gap-3">
                                                    <span className="font-semibold">{tableData[time][day].subjectName}</span>
                                                    <span className="flex items-center gap-3">
                                                        <img
                                                            src={editIcon}
                                                            className="w-4.5 h-4.5 cursor-pointer hover:scale-110"
                                                            alt="Edit"
                                                            onClick={() => handleEdit(day, time, tableData[time][day])}
                                                        />
                                                        <img
                                                            src={deleteIcon}
                                                            className="w-4.5 h-4.5 cursor-pointer hover:scale-110"
                                                            alt="Delete"
                                                            onClick={() => openDeleteModal(day, time)}
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => openModal(day, time)}
                                                className="inline-flex cursor-pointer items-center gap-2 text-black"
                                            >
                                                Add
                                                <span className="bg-[#0B56A4] hover:bg-[#0b55a4e7] rounded-full w-6 h-6 flex items-center justify-center text-white">
                                                    <Plus className="text-white w-4 h-4" />
                                                </span>
                                            </button>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white md:w-[40%] rounded-lg p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{isEditing ? "Edit Time Table Entry" : "Add Time Table Entry"}</h2>
                            <X className="cursor-pointer" onClick={() => setShowModal(false)} />
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
                                className={`w-full ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#08384F] cursor-pointer hover:bg-[#08394fe8]"} text-white py-2 rounded mt-2 flex items-center justify-center gap-2`}
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
