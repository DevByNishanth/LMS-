import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar'
import notification from '../assets/notification.svg'
import { Bell, ChevronRight, User, CheckCircle, XCircle } from "lucide-react";
import { jwtDecode } from 'jwt-decode'
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

const AttendanceTraqckingPage = () => {
    // router dom hooks
    const [searchParams] = useSearchParams();
    const query_data = JSON.parse(searchParams.get("data") || "{}");

    // states 
    const [attendanceData, setAttendanceData] = useState([]);
    const [activeHour, setActiveHour] = useState(0);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [firstName, setFirstName] = useState("");
    const [studentsList, setStudentsList] = useState([]);

    const token = localStorage.getItem("LmsToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    // useEffect call's 

    useEffect(() => {
        const token = localStorage.getItem("LmsToken");
        if (!token) {
            return
        } else {
            const decoded = jwtDecode(token);
            setFirstName(decoded.name.charAt(0).toUpperCase());
        }
    }, [])

    useEffect(() => {
        if (query_data.department && query_data.year && query_data.sectionName) {
            getStudents();
        }
    }, [activeHour, date])


    const normalizedSection = query_data.sectionName
        ?.split(" ")
        .pop();

    // functions 
    const getStudents = async () => {
        try {
            const hourLabel = HOURS[activeHour].split(" (")[0].replace(" ", "");
            const res = await axios.get(`${apiUrl}api/attendance/students`, {
                params: {
                    department: query_data.department,
                    year: query_data.year,
                    section: normalizedSection,
                    subjectId: query_data.subjectId,
                    date: date,
                    hour: hourLabel
                },
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
                // Sort by hour if needed, though usually handled by find
                return updatedData;
            });

        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }

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


    // habndle attendace 
    const markAttendance = async (student, status) => {
        try {
            const hourLabel = HOURS[activeHour].split(" (")[0].replace(" ", "");
            const res = await axios.post(`${apiUrl}api/attendance/mark`, {
                studentId: student._id,
                rollNumber: student.rollNumber,
                name: student.name,
                department: query_data.department,
                year: query_data.year,
                section: normalizedSection,
                subjectId: query_data.subjectId,
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

    // jsx 
    return (
        <>
            <section className="w-full h-screen flex ">
                <div className="w-[20%] hidden md:block">
                    <Sidebar />
                </div>

                {/* main container  */}

                <div className="container-2 w-full md:w-[80%] h-full px-6 ">

                    {/* header section  */}
                    <div className="w-full flex items-center justify-between  bg-white">
                        <div className="w-full flex items-center justify-between py-4  bg-white">
                            {/* Left: Breadcrumb */}
                            <div className="flex items-center">
                                <span className="text-lg font-medium text-[#282526]">Student Attendance</span>
                            </div>

                            {/* Right: Icons */}
                            <div className="flex items-center gap-4">
                                {/* Notification */}
                                <div className="p-2 rounded-full bg-gray-50 shadow-sm hover:shadow-md transition">
                                    <img src={notification} className="w-4 h-4" />
                                </div>

                                {/* Profile Image */}
                                <div className="w-8 h-8 rounded-full bg-[#0B56A4] text-white flex items-center justify-center font-semibold shadow-sm">
                                    {firstName}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* main contnet area  */}
                    <div className="p-4 h-[calc(100vh-80px)]  ">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-[#333333]">
                                {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} - <span className="text-[#0B56A4]">({new Date(date).toLocaleDateString('en-GB', { weekday: 'long' })})</span>
                            </h2>

                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Search Roll no and Name"
                                    className="border border-gray-300 text-gray-600 rounded px-3 py-2 w-64"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <input
                                    type="date"
                                    className="border border-gray-300 text-gray-600 rounded px-3 py-2"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {/* Left Hour Tabs */}
                            <div className="w-[30%] border border-gray-300 h-[calc(100vh-160px)] overflow-auto rounded-lg shadow p-2">
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
                            <div className="flex-1 border border-gray-300 rounded-lg  h-[calc(100vh-160px)] overflow-auto ">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-900 text-white sticky top-0">
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
                    </div>

                </div>
            </section>
        </>
    )
}

export default AttendanceTraqckingPage