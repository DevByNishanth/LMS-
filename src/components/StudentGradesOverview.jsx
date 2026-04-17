import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const subjects = [
    { name: "Cyber Security", percent: 90 },
    { name: "C Programming", percent: 87 },
    { name: "Mathematics", percent: 63 },
    { name: "English", percent: 53 },
];

const colors = ["#4a90d9", "#6aaee3", "#a0c8ef", "#c8dff5"];

const StudentGradesOverview = () => {
    const donutData = subjects.map((s, i) => ({
        name: s.name,
        value: s.percent,
        color: colors[i],
    }));

    return (
        <div className="bg-white p-5 rounded-xl shadow max-w-sm">
            <h2 className="font-medium py-2 mb-2">
                Grades Overview
            </h2>

            {/* Donut Chart */}
            <div className="relative flex justify-center mb-6">
                <PieChart width={180} height={180}>
                    <Pie
                        data={donutData}
                        cx={85}
                        cy={85}
                        innerRadius={58}
                        outerRadius={85}
                        dataKey="value"
                        strokeWidth={3}
                        stroke="#fff"
                        paddingAngle={2}
                    >
                        {donutData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-medium text-gray-800">90%</span>
                    <span className="text-xs text-gray-400">Average</span>
                </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3">
                {subjects.map((s, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                            <span>{s.name}</span>
                            <span>{s.percent}%</span>
                        </div>
                        <div className="w-full bg-blue-50 h-1.5 rounded-full">
                            <div
                                className="h-1.5 rounded-full"
                                style={{ width: `${s.percent}%`, backgroundColor: colors[i] }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentGradesOverview;
