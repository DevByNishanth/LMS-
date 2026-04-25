import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";


const data = [
    { name: "Professor", value: 12, color: "#7ed6a5" },
    { name: "Associate Professor", value: 8, color: "#F6C23E" },
    { name: "Assistant Professor", value: 4, color: "#FF7A59" },
];
const HodPiechart = () => {
    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="bg-white p-4 shadow border border-gray-300 h-full rounded-lg w-full">
            <h2 className="font-medium mb-4">Number of Faculty</h2>

            <div className="w-full h-[224px] relative">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={70}
                            outerRadius={90}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h1 className="text-xl font-bold">{total}</h1>
                    <p className="text-gray-500 text-sm">Members</p>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        {item.name} - {item.value}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HodPiechart