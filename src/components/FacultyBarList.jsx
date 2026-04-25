import React from "react";

const data = [
    { dept: "ECE", value: 23400, color: "bg-[#7ed6a6]" },
    { dept: "EEE", value: 15000, color: "bg-blue-500" },
    { dept: "AI&DS", value: 22000, color: "bg-blue-400" },
    { dept: "MECH", value: 30000, color: "bg-[#f6c23e]" },
    { dept: "CIVIL", value: 10000, color: "bg-[#0e5443]" },
    { dept: "AI&DS", value: 22000, color: "bg-[#ff7a59]" },
    { dept: "CIVIL", value: 10000, color: "bg-[#0e5443]" },
    { dept: "EEE", value: 23400, color: "bg-[#57534e]" },
    { dept: "ECE", value: 23400, color: "bg-[#7ed6a6]" },
    { dept: "CIVIL", value: 10000, color: "bg-[#0e5443]" },
    { dept: "AI&DS", value: 22000, color: "bg-blue-400" },
];

const max = Math.max(...data.map((d) => d.value));

const FacultyBarList = () => {
    return (
        <div className="w-full px-6 py-3">
            <header className="sticky top-0 bg-white">
                <h2 className="font-medium py-2">
                    Total Number of Faculty in each department
                </h2>
            </header>


            <div className="space-y-4">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <span className="w-16 text-sm">{item.dept}</span>

                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div
                                className={`${item.color} h-3 rounded-full`}
                                style={{ width: `${(item.value / max) * 100}%` }}
                            />
                        </div>

                        <span className="text-sm text-gray-600 w-20 text-right">
                            {item.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FacultyBarList;