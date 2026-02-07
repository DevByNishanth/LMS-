import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { CheckCircle, XCircle } from "lucide-react";
import presentIcon from '../assets/presentIcon.svg'
import absentIcon from '../assets/absentIcon.svg'
import onDutyIcon from '../assets/onDutyIcon.svg'


const HOURS = [
    "1st Hour (08:40AM - 09:30AM)",
    "2nd Hour (09:30AM - 10:30AM)",
    "3rd Hour (10:30AM - 11:30AM)",
    "4th Hour (11:30AM - 12:30PM)",
    "5th Hour (01:30PM - 02:30PM)",
    "6th Hour (02:30PM - 03:30PM)",
    "7th Hour (03:30PM - 04:30PM)",
];

const ClassroomAttendanceComponent = ({ subjectId, streamData }) => {
    // states 
    const [attendanceData, setAttendanceData] = useState([]);
    const [activeHour, setActiveHour] = useState(0);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [studentsList, setStudentsList] = useState([]);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkLoading, setBulkLoading] = useState(false);

    const token = localStorage.getItem("LmsToken");
    const apiUrl = import.meta.env.VITE_API_URL;


    // functions 
    const getStudents = async () => {
        if (!streamData) return;

        console.log("Stream Data being processed:", streamData);

        // robustly get values
        const department = streamData.department;

        let year = streamData.year || streamData.targetYear;
        // Fallback: Derive year from semester if year is missing
        if (!year && streamData.semester) {
            const sem = parseInt(streamData.semester);
            if (sem <= 2) year = "1st Year";
            else if (sem <= 4) year = "2nd Year";
            else if (sem <= 6) year = "3rd Year";
            else year = "4th Year";
        }

        // Extract "B" from "Section B", or use the value as is
        let normalizedSection = streamData.section;
        if (!normalizedSection && streamData.sectionName) {
            const parts = streamData.sectionName.split(" ");
            normalizedSection = parts.length > 1 ? parts.pop() : streamData.sectionName;
        }

        const hourLabel = HOURS[activeHour].split(" (")[0].replace(" ", "");

        // Check if all required fields are present
        if (!department || !year || !normalizedSection || !subjectId) {
            console.error("Missing required params for attendance calling:", {
                department,
                year,
                normalizedSection,
                subjectId,
                originalYear: streamData.year,
                originalSemester: streamData.semester
            });
            return;
        }

        const params = {
            department: department,
            year: year,
            section: normalizedSection,
            subjectId: subjectId,
            date: date,
            hour: hourLabel
        };

        console.log("Fetching students with params:", params);

        try {
            const res = await axios.get(`${apiUrl}api/attendance/students`, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(res.data);
            const fetchedStudents = res.data.students.map(student => ({
                ...student,
                id: student._id, // Ensure we have a unique id
                rollNo: student.rollNumber,
                name: student.name,
                selected: false,
                status: student.status || "present" // default status
            }));

            setStudentsList(fetchedStudents);

            // Update attendance data for the current hour
            setAttendanceData(prev => {
                const hourLabelFull = HOURS[activeHour];
                const updatedData = [...prev];
                const existingHourIndex = updatedData.findIndex(h => h.hour === activeHour);

                if (existingHourIndex > -1) {
                    updatedData[existingHourIndex] = {
                        ...updatedData[existingHourIndex],
                        students: fetchedStudents
                    };
                } else {
                    updatedData.push({
                        hour: activeHour,
                        label: hourLabelFull,
                        students: fetchedStudents
                    });
                }
                return updatedData;
            });

        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }

    console.log("subject id : ", subjectId);
    console.log("stream data : ", streamData);
    useEffect(() => {
        if (subjectId && streamData) {
            getStudents();
        }
    }, [activeHour, date, subjectId, streamData])

    const handleSelectAll = (checked) => {
        setAttendanceData(prev => prev.map(h => {
            if (h.hour === activeHour) {
                return {
                    ...h,
                    students: h.students.map(s => ({ ...s, selected: checked }))
                }
            }
            return h;
        }));
    };

    const handleRowSelect = (id) => {
        setAttendanceData(prev => prev.map(h => {
            if (h.hour === activeHour) {
                return {
                    ...h,
                    students: h.students.map(s => s.id === id ? { ...s, selected: !s.selected } : s)
                }
            }
            return h;
        }));
    };

    const currentHourData = attendanceData.find(
        (h) => h.hour === activeHour
    );

    const students = currentHourData?.students || [];

    // Filter by roll no or name
    const filteredStudents = students.filter(
        (s) =>
            (s.rollNo && String(s.rollNo).toLowerCase().includes(search.toLowerCase())) ||
            (s.name && s.name.toLowerCase().includes(search.toLowerCase()))
    );

    const isAllSelected =
        filteredStudents.length > 0 &&
        filteredStudents.every((s) => s.selected);

    // Get count of selected students
    const selectedStudentsCount = students.filter(s => s.selected).length;


    // habndle attendace 
    const markAttendance = async (student, status) => {
        const normalizedSection = streamData.section || streamData.sectionName?.split(" ").pop();

        try {
            const hourLabel = HOURS[activeHour].split(" (")[0].replace(" ", "");
            const res = await axios.post(`${apiUrl}api/attendance/mark`, {
                studentId: student._id,
                rollNumber: student.rollNumber,
                name: student.name,
                department: streamData.department,
                year: streamData.year || streamData.targetYear,
                section: normalizedSection,
                subjectId: subjectId,
                date: date,
                hour: hourLabel,
                status: status,
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log(`${status} marked: `, res.data)

            // Re-fetch or update local state to show current status
            getStudents();

        } catch (error) {
            console.error(`Error marking ${status}:`, error);
        }
    }

    // Handle bulk attendance marking
    const handleBulkAttendance = async (status) => {
        const selectedStudents = students.filter(s => s.selected);

        if (selectedStudents.length === 0) {
            alert("Please select at least one student");
            return;
        }

        setBulkLoading(true);
        try {
            const hourLabel = HOURS[activeHour].split(" (")[0].replace(" ", "");
            const records = selectedStudents.map(student => ({
                studentId: student._id,
                status: status
            }));

            const res = await axios.post(`${apiUrl}api/attendance/bulk`, {
                subjectId: subjectId,
                date: date,
                hour: hourLabel,
                records: records
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Bulk attendance marked: ", res.data);
            alert("Attendance marked successfully!");
            setShowBulkModal(false);

            // Re-fetch students to update the attendance status
            getStudents();

        } catch (error) {
            console.error("Error marking bulk attendance:", error);
            alert(error.response?.data?.message || "Failed to mark bulk attendance");
        } finally {
            setBulkLoading(false);
        }
    }

    return (
        <div className="h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-[#333333]">
                    {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} - <span className="text-[#0B56A4]">({new Date(date).toLocaleDateString('en-GB', { weekday: 'long' })})</span>
                </h2>

                <div className="flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Search Roll no and Name"
                        className="border border-gray-300 text-gray-600 rounded px-3 py-2 w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {selectedStudentsCount > 0 && (
                        <button
                            onClick={() => setShowBulkModal(true)}
                            className="bg-[#0B56A4] text-white px-4 py-2 rounded hover:bg-[#084282] transition-all shadow-md font-semibold text-sm whitespace-nowrap"
                        >
                            Bulk Attendance ({selectedStudentsCount})
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-4 h-[calc(100%-60px)]">
                {/* Left Hour Tabs */}
                <div className="w-[30%] border border-gray-300 h-full overflow-auto rounded-lg shadow p-2">
                    {HOURS.map((hour, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveHour(index)}
                            className={`w-full text-left px-4 py-3 rounded mb-1 text-md 
                                      ${activeHour === index
                                    ? "bg-[#0B56A4] text-white"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            {hour}
                        </button>
                    ))}
                </div>

                {/* Attendance Table */}
                <div className="flex-1 border border-gray-300 rounded-lg h-full overflow-auto ">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-900 text-white sticky top-0 z-10">
                            <tr>
                                <th className="p-3">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className='scale-125'
                                    />
                                </th>
                                <th className="p-3 text-left">Roll No</th>
                                <th className="p-3 text-left">Student</th>
                                <th className="p-3 text-center">Present</th>
                                <th className="p-3 text-center">Absent</th>
                                <th className="p-3 text-center">On-Duty</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">
                                        No students found
                                    </td>
                                </tr>
                            )}

                            {filteredStudents.map((student) => (
                                <tr
                                    key={student.id}
                                    className="border-b border-gray-300 hover:bg-gray-50"
                                >
                                    <td className="p-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={student.selected}
                                            onChange={() => handleRowSelect(student.id)}
                                            className='scale-125 accent-[#0B56A4]'
                                        />
                                    </td>

                                    <td className="p-3">{student.rollNo}</td>

                                    <td className="p-3 flex items-center gap-2">
                                        <img
                                            src="https://i.pravatar.cc/30"
                                            className="w-6 h-6 rounded-full"
                                            alt=""
                                        />
                                        {student.name}
                                    </td>

                                    <td className="p-3 text-center">
                                        {student.status === "Present" ? (
                                            <img
                                                src={presentIcon}
                                                onClick={() => markAttendance(student, "Present")}
                                                className="w-7 h-7 cursor-pointer inline transition-all scale-125"
                                                alt="Present"
                                            />
                                        ) : (
                                            <CheckCircle
                                                onClick={() => markAttendance(student, "Present")}
                                                className="cursor-pointer text-green-500 inline opacity-50 hover:opacity-100 transition-opacity"
                                            />
                                        )}
                                    </td>

                                    <td className="p-3 text-center">
                                        {student.status === "Absent" ? (
                                            <img
                                                src={absentIcon}
                                                onClick={() => markAttendance(student, "Absent")}
                                                className="w-7 h-7 cursor-pointer inline transition-all scale-125"
                                                alt="Absent"
                                            />
                                        ) : (
                                            <XCircle
                                                onClick={() => markAttendance(student, "Absent")}
                                                className="cursor-pointer text-red-500 inline opacity-50 hover:opacity-100 transition-opacity"
                                            />
                                        )}
                                    </td>

                                    <td className="p-3 text-center">
                                        {student.status === "On-Duty" ? (
                                            <img
                                                src={onDutyIcon}
                                                onClick={() => markAttendance(student, "On-Duty")}
                                                className="w-7 h-7 cursor-pointer inline transition-all scale-125"
                                                alt="On-Duty"
                                            />
                                        ) : (
                                            <CheckCircle
                                                onClick={() => markAttendance(student, "On-Duty")}
                                                className="cursor-pointer text-blue-500 inline opacity-50 hover:opacity-100 transition-opacity"
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bulk Attendance Modal */}
            {showBulkModal && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 z-60"
                        onClick={() => setShowBulkModal(false)}
                    ></div>

                    {/* Modal */}
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-70 p-8 w-96">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                            Mark Attendance for {selectedStudentsCount} Student{selectedStudentsCount !== 1 ? 's' : ''}
                        </h3>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleBulkAttendance("Present")}
                                disabled={bulkLoading}
                                className="flex items-center gap-3 w-full p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-all disabled:opacity-50"
                            >
                                <CheckCircle className="text-green-500" size={24} />
                                <span className="font-semibold text-gray-800">Mark Present</span>
                            </button>

                            <button
                                onClick={() => handleBulkAttendance("Absent")}
                                disabled={bulkLoading}
                                className="flex items-center gap-3 w-full p-4 border-2 border-red-500 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                            >
                                <XCircle className="text-red-500" size={24} />
                                <span className="font-semibold text-gray-800">Mark Absent</span>
                            </button>

                            <button
                                onClick={() => handleBulkAttendance("On-Duty")}
                                disabled={bulkLoading}
                                className="flex items-center gap-3 w-full p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-all disabled:opacity-50"
                            >
                                <CheckCircle className="text-blue-500" size={24} />
                                <span className="font-semibold text-gray-800">Mark On-Duty</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowBulkModal(false)}
                            disabled={bulkLoading}
                            className="w-full mt-6 p-3 border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default ClassroomAttendanceComponent
