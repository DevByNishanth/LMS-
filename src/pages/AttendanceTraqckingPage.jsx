import React from 'react'
import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import notification from '../assets/notification.svg'
import { Bell, ChevronRight, User } from "lucide-react";
import bookIcon from '../assets/activeBookIcon.svg'
import upSideRightArrow from '../assets/upSideRightArrow.svg'
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import { CheckCircle, XCircle } from "lucide-react";


const HOURS = [
    "1st Hour (08:40AM - 09:30AM)",
    "2nd Hour (09:30AM - 10:30AM)",
    "3rd Hour (10:30AM - 11:30AM)",
    "4th Hour (11:30AM - 12:30PM)",
    "5th Hour (01:30PM - 02:30PM)",
    "6th Hour (02:30PM - 03:30PM)",
    "7th Hour (03:30PM - 04:30PM)",
];


const INITIAL_DATA = [
    {
        hour: 0,
        label: "1st Hour (08:40AM - 09:30AM)",
        students: [
            { id: 1, rollNo: "0102044541", name: "Surya Chandran" },
            { id: 2, rollNo: "0102044542", name: "Arun Kumar" },
        ],
    },
    {
        hour: 1,
        label: "2nd Hour (09:30AM - 10:30AM)",
        students: [
            { id: 3, rollNo: "0102044543", name: "Vignesh" },
            { id: 4, rollNo: "0102044544", name: "Karthik" },
        ],
    },
];



const AttendanceTraqckingPage = () => {
    // states 
    const [attendanceData, setAttendanceData] = useState(INITIAL_DATA);
    const [activeHour, setActiveHour] = useState(0);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);


    const [firstName, setFirstName] = useState("");

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

    // functions 

    const currentHourData = attendanceData.find(
        (h) => h.hour === activeHour
    );

    const students = currentHourData?.students || [];


    // Filter by roll no or name
    const filteredStudents = students.filter(
        (s) =>
            s.rollNo.includes(search) ||
            s.name.toLowerCase().includes(search.toLowerCase())
    );

    const isAllSelected =
        filteredStudents.length > 0 &&
        filteredStudents.every((s) => s.selected);


    // jsx 
    return (
        <>
            <section className="w-full h-screen flex ">
                <div className="w-[20%]">
                    <Sidebar />
                </div>

                {/* main container  */}

                <div className="container-2 w-[80%] h-full px-6 ">
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
                                04 DEC 2025 - <span className="text-[#0B56A4]">(Monday)</span>
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
                                                    <CheckCircle className="text-green-500 inline" />
                                                </td>

                                                <td className="p-3 text-center">
                                                    <XCircle className="text-red-500 inline" />
                                                </td>

                                                <td className="p-3 text-center">
                                                    <CheckCircle className="text-blue-500 inline" />
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