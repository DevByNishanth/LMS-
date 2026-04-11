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
    { name: "1st Year", students: 120 },
    { name: "2nd Year", students: 200 },
    { name: "3rd Year", students: 150 },
    { name: "4th Year", students: 80 },
];

const HodStudentBarChart = () => {
    return (
        <div className="bg-white py-2 px-6 rounded-xl h-[380px]">
            <h2 className="font-medium mb-4 ">
                Total Number of student in each Year
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

export default HodStudentBarChart;