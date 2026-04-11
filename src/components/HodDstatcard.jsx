import React from "react";
import { Users, GraduationCap, Building2 } from "lucide-react";

const stats = [
    {
        title: "Total Faculty",
        value: "225",
        icon: <Users className="text-blue-500" />,
        bg: "bg-blue-100",
    },
    {
        title: "Total Students",
        value: "345",
        icon: <GraduationCap className="text-yellow-600" />,
        bg: "bg-yellow-100",
    },
    {
        title: "Total Departments",
        value: "07",
        icon: <Building2 className="text-red-500" />,
        bg: "bg-red-100",
    },
];
const HodDstatcard = () => {
    return (
        <>
            {stats.map((item, index) => (
                <div
                    key={index}
                    className="bg-white border border-gray-300 shadow rounded-lg p-5 h-[100px] flex items-center gap-4"
                >
                    <div className={`p-3 rounded-full ${item.bg}`}>
                        {item.icon}
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium text-sm">{item.title}</p>
                        <h2 className="text-lg font-semibold">{item.value}</h2>
                    </div>
                </div>
            ))}
        </>
    )
}

export default HodDstatcard