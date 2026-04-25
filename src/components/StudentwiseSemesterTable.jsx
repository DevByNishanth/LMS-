import React, { useState } from "react";
import { Search, Eye, Download } from "lucide-react";
import homeImg from "../assets/reportHomeImg.svg";

const StudentwiseSemesterTable = ({ selectedSemester, selectedSubject, selectedSection }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("");

    // Mock student data
    const allStudents = [
        { rollNo: "001", name: "Aaryan Kumar", totalClasses: 15, present: 14, absent: 1, onDuty: 0, attendance: 93 },
        { rollNo: "002", name: "Bhavna Singh", totalClasses: 15, present: 13, absent: 2, onDuty: 0, attendance: 87 },
        { rollNo: "003", name: "Chirag Patel", totalClasses: 15, present: 15, absent: 0, onDuty: 0, attendance: 100 },
        { rollNo: "004", name: "Deepa Sharma", totalClasses: 15, present: 12, absent: 2, onDuty: 1, attendance: 80 },
        { rollNo: "005", name: "Esha Gupta", totalClasses: 15, present: 14, absent: 1, onDuty: 0, attendance: 93 },
    ];

    // Mock semester data
    const semesterMonths = {
        "odd-semester": ["June", "July", "August", "September", "October"],
        "even-semester": ["January", "February", "March", "April", "May"],
    };

    // Filter students based on search query (by roll no or name)
    const filteredStudents = allStudents.filter(
        (student) =>
            student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Mock detailed student data for each month
    const studentMonthData = [
        { month: "June", rollNo: "001", name: "Aaryan Kumar", totalClasses: 20, present: 18, absent: 2, onDuty: 0, attendance: 90 },
        { month: "July", rollNo: "001", name: "Aaryan Kumar", totalClasses: 22, present: 21, absent: 1, onDuty: 0, attendance: 95 },
        { month: "August", rollNo: "001", name: "Aaryan Kumar", totalClasses: 19, present: 19, absent: 0, onDuty: 0, attendance: 100 },
    ];

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
    };

    const handleMonthFilter = (monthValue) => {
        setSelectedMonth(monthValue);
    };

    const months = semesterMonths[selectedSemester] || [];

    return (
        <div className="rounded-lg mx-6 mt-4">
            {!selectedStudent ? (
                // Stage 1: Search Bar
                <div className="min-h-[500px]">
                    <h2 className="text-sm font-medium text-gray-700 mb-6">
                        Search Student - {selectedSemester === "odd-semester" ? "Odd" : "Even"} Semester
                    </h2>

                    <div className="flex justify-between items-center mb-8">
                        {/* Search Input */}
                        <div className="relative w-[280px]">
                            <input
                                type="text"
                                placeholder="Search roll no or name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />
                            <Search size={16} className="absolute right-2 top-2.5 text-gray-500" />
                        </div>

                        {/* Download Button */}
                        <button className="flex items-center gap-2 bg-[#08384f] text-white px-4 py-2 rounded-md text-sm hover:bg-[#08384fd3]">
                            <Download size={16} />
                            Download Report
                        </button>
                    </div>

                    {/* Search Results */}
                    {searchQuery && filteredStudents.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Search Results</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100 border-b">
                                            <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Roll No</th>
                                            <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Student Name</th>
                                            <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Classes</th>
                                            <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Attendance %</th>
                                            <th className="border px-4 py-2 text-center text-sm font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.map((student, index) => (
                                            <tr key={index} className=" border-b border-gray-300 hover:bg-gray-50 cursor-pointer">
                                                <td className=" px-4 py-2 text-sm text-gray-700">{student.rollNo}</td>
                                                <td className=" px-4 py-2 text-sm text-gray-700">{student.name}</td>
                                                <td className=" px-4 py-2 text-sm text-gray-700">{student.totalClasses}</td>
                                                <td className=" px-4 py-2 text-sm text-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-1.5 bg-gray-300 rounded">
                                                            <div
                                                                className="h-1.5 bg-[#08384f] rounded"
                                                                style={{ width: `${student.attendance}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs font-medium">{student.attendance}%</span>
                                                    </div>
                                                </td>
                                                <td className=" px-4 py-2 text-center">
                                                    <button
                                                        onClick={() => handleStudentSelect(student)}
                                                        className="text-[#08384f] hover:text-[#08384f]"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {searchQuery && filteredStudents.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center mt-10">
                            <img src={homeImg} alt="No results" className="w-[150px] h-[150px] mb-4" />
                            <p className="text-gray-600">No students found matching your search</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!searchQuery && (
                        <div className="flex flex-col items-center justify-center text-center mt-10">
                            <img src={homeImg} alt="Search" className="w-[200px] h-[200px] mb-4" />
                            <h3 className="text-gray-700 font-medium mb-2">Start Searching</h3>
                            <p className="text-gray-600">Enter student roll no or name to view attendance details</p>
                        </div>
                    )}
                </div>
            ) : (
                // Stage 2: Student Detail with Month Data
                <div>
                    {/* Back Button & Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <button
                                onClick={() => {
                                    setSelectedStudent(null);
                                    setSelectedMonth("");
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
                            >
                                ← Back to Search
                            </button>
                            <h2 className="text-sm font-medium text-gray-700">
                                {selectedStudent.name} ({selectedStudent.rollNo}) - {selectedSemester === "odd-semester" ? "Odd" : "Even"} Semester
                            </h2>
                        </div>
                        <button className="flex items-center gap-2 bg-[#08384f] text-white px-4 py-2 rounded-md text-sm hover:bg-[#08384fd3]">
                            <Download size={16} />
                            Download Report
                        </button>
                    </div>

                    {/* Month Filter */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-700 block mb-3">Filter by Month:</label>
                        <div className="grid grid-cols-5 gap-2">
                            <button
                                onClick={() => handleMonthFilter("")}
                                className={`p-2 rounded-md text-sm font-medium transition ${selectedMonth === ""
                                        ? "bg-blue-500 text-white"
                                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                All Months
                            </button>
                            {months.map((month) => (
                                <button
                                    key={month}
                                    onClick={() => handleMonthFilter(month)}
                                    className={`p-2 rounded-md text-sm font-medium transition ${selectedMonth === month
                                            ? "bg-blue-500 text-white"
                                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Month</th>
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
                                {studentMonthData
                                    .filter((row) => !selectedMonth || row.month === selectedMonth)
                                    .map((row, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="border px-4 py-2 text-sm text-gray-700">{row.month}</td>
                                            <td className="border px-4 py-2 text-sm text-gray-700">{row.rollNo}</td>
                                            <td className="border px-4 py-2 text-sm text-gray-700">{row.name}</td>
                                            <td className="border px-4 py-2 text-sm text-gray-700">{row.totalClasses}</td>
                                            <td className="border px-4 py-2 text-sm text-gray-700">{row.present}</td>
                                            <td className="border px-4 py-2 text-sm text-gray-700">{row.absent}</td>
                                            <td className="border px-4 py-2 text-sm text-gray-700">{row.onDuty}</td>
                                            <td className="border px-4 py-2 text-sm text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-1.5 bg-gray-300 rounded">
                                                        <div
                                                            className="h-1.5 bg-blue-500 rounded"
                                                            style={{ width: `${row.attendance}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-medium">{row.attendance}%</span>
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
                </div>
            )}
        </div>
    );
};

export default StudentwiseSemesterTable;
