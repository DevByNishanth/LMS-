import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "CSE", students: 120 },
    { name: "ECE", students: 200 },
    { name: "MECH", students: 150 },
    { name: "AI&DS", students: 80 },
    { name: "EEE", students: 70 },
    { name: "CIVIL", students: 110 },
    { name: "MECH", students: 150 },
    { name: "AI&DS", students: 80 },
    { name: "EEE", students: 70 },
    { name: "CIVIL", students: 110 },
    { name: "IT", students: 130 },
];

const StudentBarChart = () => {
    return (
        <div className="bg-white py-6 mx-6 px-6 rounded-lg h-[380px] border border-gray-200 shadow-lg">
            <h2 className="font-medium mb-4 text-sm">
                Students In Each department
            </h2>

            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Bar
                        dataKey="students"
                        fill="#08384F"
                        radius={[10, 10, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StudentBarChart;