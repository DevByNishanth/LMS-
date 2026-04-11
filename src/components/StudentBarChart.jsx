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
        <div className="bg-white py-2 px-6 rounded-xl h-[380px]">
            <h2 className="font-medium mb-4 ">
                Total Number of student in each department
            </h2>

            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Bar
                        dataKey="students"
                        fill="#1C7ED6"
                        radius={[10, 10, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StudentBarChart;