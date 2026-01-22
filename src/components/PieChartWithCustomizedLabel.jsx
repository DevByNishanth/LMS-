import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#34B3F1", "#08384F", "#0B56A4"];
const RADIAN = Math.PI / 180;

// Custom label renderer
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
}) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {value}
      {/* {`${(percent * 100).toFixed(0)}%`} */}
    </text>
  );
};

export default function PieChartWithCustomizedLabel({
  isAnimationActive = true,
  chartData,
}) {
  console.log("chart data : ", chartData);
  // const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const apiUrl = import.meta.env.VITE_API_URL;
  //   const fetchChartData = async () => {
  //     try {
  //       const res = await axios.get(`${apiUrl}api/faculty/department-wise/ECE`); // ← Replace with your backend API endpoint

  //       // Example backend response:
  //       // [
  //       //   { Class: "1st", Designation: "Professor", Count: 202 },
  //       //   { Class: "2nd", Designation: "Assistant Professor", Count: 167 },
  //       //   { Class: "3rd", Designation: "Associate Professor", Count: 178 },
  //       // ]

  //       // Transform backend data for Recharts
  //       const formattedData = res.data.map((item) => ({
  //         name: item.Designation,
  //         value: item.Count,
  //       }));

  //       setChartData(formattedData);
  //       console.log("data 1 : ", res.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching chart data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchChartData();
  // }, []);

  const legends = [
    { color: "#34B3F1", label: "Professor" },
    { color: "#0B56A4", label: "Assistant Professor" },
    { color: "#08384F", label: "Associate Professor" },
  ];

  // if (loading) return <div>Loading chart...</div>;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "140px",
        display: "flex",
      }}
    >
      <ResponsiveContainer width="50%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={isAnimationActive}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="flex gap-5 items-center">
        {/* Divider */}
        <div className="w-[1px] bg-gray-300 h-30"></div>

        {/* Legend */}
        <div className="space-y-4">
          {legends.map((item) => (
            <div key={item.label} className="flex items-center space-x-3">
              <div
                className="w-5 h-5 rounded-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-600 font-medium text-base">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
