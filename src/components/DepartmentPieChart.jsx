import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "MECH", value: 112, color: "#7ed6a5" },
  { name: "CSE", value: 72, color: "#F6C23E" },
  { name: "ECE", value: 72, color: "#FF7A59" },
  { name: "EEE", value: 50, color: "#7ED6A5" },
  { name: "MECH", value: 112, color: "#4F9CF9" },
  { name: "CSE", value: 72, color: "#F6C23E" },
  { name: "ECE", value: 72, color: "#FF7A59" },
  { name: "EEE", value: 50, color: "#7ED6A5" },
  { name: "EEE", value: 50, color: "#7ED6A5" },
  { name: "EEE", value: 50, color: "#7ED6A5" },
  { name: "EEE", value: 50, color: "#7ED6A5" },
 
];

const DepartmentPieChart = () => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-white p-4 shadow border border-gray-300 rounded-lg w-full">
      <h2 className="font-medium mb-4">Overall Department count</h2>

      <div className="w-full h-[184px] relative">
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
      <div className="mt-4 space-y-2  overflow-y-auto hide-scrollbar">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.name} - {item.value} Members
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentPieChart;