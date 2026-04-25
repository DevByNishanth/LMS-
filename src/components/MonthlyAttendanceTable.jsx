import React from "react";
import { Eye, Download } from "lucide-react";

const data = [
    {
        date: "15/05/2026",
        classHour: "1st Hour",
        total: 50,
        present: 15,
        absent: 15,
        onduty: 15,
        percentage: 90,
    },
    {
        date: "15/05/2026",
        classHour: "2nd Hour",
        total: 50,
        present: 15,
        absent: 15,
        onduty: 15,
        percentage: 70,
    },
    {
        date: "16/05/2026",
        classHour: "2nd Hour",
        total: 50,
        present: 15,
        absent: 15,
        onduty: 15,
        percentage: 40,
    },
    {
        date: "16/05/2026",
        classHour: "2nd Hour",
        total: 50,
        present: 15,
        absent: 15,
        onduty: 15,
        percentage: 80,
    },
    {
        date: "17/05/2026",
        classHour: "2nd Hour",
        total: 50,
        present: 15,
        absent: 15,
        onduty: 15,
        percentage: 70,
    },
];

const MonthlyAttendanceTable = ({ selectedMonth, selectedSubject, selectedSection }) => {

    // functions 
    const formatMonthName = (month) => {
        return month.charAt(0).toUpperCase() + month.slice(1);
    }

    // jsx 
    return (
        <div className="mx-6 mt-4 rounded-lg">
            {/* Header */}
            <div className="mb-3">
                <h2 className="text-sm font-medium text-gray-700">
                    {formatMonthName(selectedMonth)} attendance for {selectedSubject || 'Cyber Security'}
                </h2>

                {/* Top progress */}
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-full h-1.5 bg-gray-300 rounded">
                        <div className="h-1.5 bg-[#08384f] rounded w-1/2"></div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">50%</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
                {/* Table Header */}
                <div className="grid grid-cols-8 bg-[#08384f] text-white text-xs font-medium px-4 py-4">
                    <span>Date</span>
                    <span>Class Hours</span>
                    <span>Total Students</span>
                    <span>Present Count</span>
                    <span>Absent Count</span>
                    <span>Onduty Count</span>
                    <span>Percentage</span>
                    <span className="text-center">Action</span>
                </div>

                {/* Table Rows */}
                {data.map((item, index) => (
                    <div
                        key={index}
                        className={`grid grid-cols-8 items-center text-xs px-4 py-3 ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                            }`}
                    >
                        <span>{item.date}</span>
                        <span>{item.classHour}</span>
                        <span>{item.total}</span>
                        <span className="text-green-600 font-semibold">
                            {item.present}
                        </span>
                        <span className="text-red-800 font-semibold">
                            {item.absent}
                        </span>
                        <span className="text-[#08384f] font-semibold">
                            {item.onduty}
                        </span>

                        {/* Progress bar */}
                        <div className="flex items-center gap-2">
                            <div className="w-full h-1.5 bg-gray-300 rounded">
                                <div
                                    className="h-1.5 bg-[#08384f] rounded"
                                    style={{ width: `${item.percentage}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-700 font-medium">
                                {item.percentage}%
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-center gap-2">
                            <button className="bg-[#08384f] p-1.5 rounded-full text-white hover:bg-[#08384f]">
                                <Eye size={14} />
                            </button>
                            <button className="bg-[#08384f] p-1.5 rounded-full text-white hover:bg-[#08384f]">
                                <Download size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthlyAttendanceTable;