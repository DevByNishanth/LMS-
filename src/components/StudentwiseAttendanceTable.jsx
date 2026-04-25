import React, { useState } from "react";
import { Search, Download, Eye } from "lucide-react";
import homeImg from '../assets/reportHomeImg.svg'

const StudentwiseAttendanceTable = ({ selectedMonth, selectedSubject, selectedSection }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Mock student attendance data
    const allStudents = [
        { rollNo: "001", name: "Aaryan Kumar", totalClasses: 20, present: 18, absent: 2, onDuty: 0, attendance: 90 },
        { rollNo: "002", name: "Bhavna Singh", totalClasses: 20, present: 17, absent: 2, onDuty: 1, attendance: 85 },
        { rollNo: "003", name: "Chirag Patel", totalClasses: 20, present: 20, absent: 0, onDuty: 0, attendance: 100 },
        { rollNo: "004", name: "Deepa Sharma", totalClasses: 20, present: 16, absent: 3, onDuty: 1, attendance: 80 },
        { rollNo: "005", name: "Esha Gupta", totalClasses: 20, present: 18, absent: 2, onDuty: 0, attendance: 90 },
        { rollNo: "006", name: "Farhan Khan", totalClasses: 20, present: 15, absent: 5, onDuty: 0, attendance: 75 },
        { rollNo: "007", name: "Gajanan Tripathi", totalClasses: 20, present: 19, absent: 1, onDuty: 0, attendance: 95 },
        { rollNo: "008", name: "Harshita Singh", totalClasses: 20, present: 17, absent: 2, onDuty: 1, attendance: 85 },
    ];

    // Filter students based on search query (by roll no or name)
    const filteredStudents = allStudents.filter(
        (student) =>
            student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatMonthName = (month) => {
        return month.charAt(0).toUpperCase() + month.slice(1);
    };
    return (
        <div className="rounded-lg mx-6 mt-4 min-h-[500px]">

            {/* Header */}
            <div className="mb-4">
                <h2 className="text-sm font-medium text-gray-700">
                    {formatMonthName(selectedMonth)} attendance for {selectedSubject || 'Cyber Security'}
                </h2>

                {/* Progress bar */}
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-full h-1.5 bg-gray-300 rounded">
                        <div className="h-1.5 bg-[#08384f] rounded w-1/2"></div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">50%</span>
                </div>
            </div>

            {/* Search + Button */}
            <div className="flex justify-between items-center mb-8">

                {/* Search Input */}
                <div className="relative w-[280px]">
                    <input
                        type="text"
                        placeholder="Search roll no or name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search
                        size={16}
                        className="absolute right-2 top-2.5 text-gray-500"
                    />
                </div>

                {/* Download Button */}
                <button className="flex items-center gap-2 bg-[#08384f] text-white px-4 py-2 rounded-md text-sm hover:bg-[#08384fd3]">
                    <Download size={16} />
                    Download Report
                </button>
            </div>

            {/* Table or Empty State */}
            {filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Roll No</th>
                                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Student Name</th>
                                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Classes</th>
                                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Present</th>
                                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Absent</th>
                                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">On Duty</th>
                                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Attendance %</th>
                                <th className="border px-4 py-2 text-center text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="border px-4 py-2 text-sm text-gray-700">{student.rollNo}</td>
                                    <td className="border px-4 py-2 text-sm text-gray-700">{student.name}</td>
                                    <td className="border px-4 py-2 text-sm text-gray-700">{student.totalClasses}</td>
                                    <td className="border px-4 py-2 text-sm text-green-600 font-semibold">{student.present}</td>
                                    <td className="border px-4 py-2 text-sm text-red-600 font-semibold">{student.absent}</td>
                                    <td className="border px-4 py-2 text-sm text-blue-600 font-semibold">{student.onDuty}</td>
                                    <td className="border px-4 py-2 text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-1.5 bg-gray-300 rounded">
                                                <div
                                                    className="h-1.5 bg-blue-500 rounded"
                                                    style={{ width: `${student.attendance}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium">{student.attendance}%</span>
                                        </div>
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center mt-10">

                    {/* Illustration (replace with your asset if needed) */}
                    <img
                        src={homeImg}
                        alt="No data"
                        className="w-40 h-40 mb-4 opacity-80"
                    />

                    <h3 className="text-lg font-semibold mb-2">
                        {searchQuery ? "No students found" : "Search the Student to view the attendance"}
                    </h3>

                    <p className="text-sm text-gray-600 max-w-md">
                        {searchQuery
                            ? "Try searching with a different roll number or name"
                            : "Enter a student's name or roll number in the search bar above to view their attendance details."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default StudentwiseAttendanceTable;