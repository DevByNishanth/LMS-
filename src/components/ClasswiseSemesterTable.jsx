import React, { useState } from "react";
import { Eye, Download } from "lucide-react";

const ClasswiseSemesterTable = ({ selectedSemester, selectedSubject, selectedSection, onMonthSelect }) => {
    const [selectedMonth, setSelectedMonth] = useState("");

    // Mock data for semester months
    const semesterMonths = {
        "odd-semester": [
            { label: "June", value: "june" },
            { label: "July", value: "july" },
            { label: "August", value: "august" },
            { label: "September", value: "september" },
            { label: "October", value: "october" },
        ],
        "even-semester": [
            { label: "January", value: "january" },
            { label: "February", value: "february" },
            { label: "March", value: "march" },
            { label: "April", value: "april" },
            { label: "May", value: "may" },
        ],
    };

    // Mock data for semester attendance
    const semesterData = [
        { month: "June", totalClasses: 20, attendancePercentage: 85 },
        { month: "July", totalClasses: 22, attendancePercentage: 78 },
        { month: "August", totalClasses: 19, attendancePercentage: 92 },
        { month: "September", totalClasses: 21, attendancePercentage: 88 },
        { month: "October", totalClasses: 20, attendancePercentage: 80 },
    ];



    return (
        <div className="rounded-lg mx-6 mt-4">
            {/* Semester Table */}
            {!selectedMonth && (
                <div className="mt-8">
                    <h2 className="text-sm font-medium text-gray-700 mb-4">
                        {selectedSemester === "odd-semester" ? "Odd" : "Even"} Semester - {selectedSubject} ({selectedSection})
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Month</th>
                                    <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Classes</th>
                                    <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Attendance %</th>
                                    <th className="border px-4 py-2 text-center text-sm font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {semesterData.map((row, index) => (
                                    <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                                        <td className=" px-4 py-2 text-sm text-gray-700">{row.month}</td>
                                        <td className=" px-4 py-2 text-sm text-gray-700">{row.totalClasses}</td>
                                        <td className=" px-4 py-2 text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-1.5 bg-gray-300 rounded">
                                                    <div
                                                        className="h-1.5 bg-[#08384f] rounded"
                                                        style={{ width: `${row.attendancePercentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium">{row.attendancePercentage}%</span>
                                            </div>
                                        </td>
                                        <td className=" px-4 py-2 text-center">
                                            <button className="text-[#08384f] hover:text-[#08384f]">
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
        </div>
    );
};

export default ClasswiseSemesterTable;
