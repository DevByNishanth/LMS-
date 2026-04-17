import React from "react";

const AttendanceOverview = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const data = [
    [82, 42, 85, 12, 87, 90, 60],
    [32, 83, 87, 97, 92, 82, 60],
    [92, 82, 72, 62, 92, 60, 60],
    [82, 62, 92, 85, 60, 82, 60],
    [72, 84, 60, 60, 32, 82, 60],
    [83, 42, 82, 81, 92, 22, 60],
    [84, 85, 22, 86, 20, 12, null],
  ];

  const getColor = (value) => {
    if (value === null) return "bg-gray-200";
    if (value < 50) return "bg-[#F99BAB] text-red-800";
    if (value < 80) return "bg-[#62B2FD] text-blue-800";
    return "bg-[#9BDFC4] text-green-800";
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-fit">
      <h2 className="font-medium mb-4 flex items-center justify-between">
        Attendance Overview
        <span className="text-xs text-gray-400">Past 7 Days ↗</span>
      </h2>

      <div className="grid grid-cols-8 gap-2 text-center text-xs">
        {/* Empty corner */}
        <div></div>

        {/* Days */}
        {days.map((day) => (
          <div key={day} className="font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Rows */}
        {data.map((row, i) => (
          <React.Fragment key={i}>
            <div className="font-medium text-gray-400">
              {i + 1}
              <sup>
                {i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"}
              </sup>
            </div>

            {row.map((val, j) => (
              <div
                key={j}
                className={`p-2 rounded-md ${getColor(val)}`}
              >
                {val !== null ? `${val}%` : ""}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-300 rounded-full"></span>
          80–90% Good
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-300 rounded-full"></span>
          {"<"}50% Poor
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-300 rounded-full"></span>
          50–80% Average
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
          No Class
        </div>
      </div>
    </div>
  );
};

export default AttendanceOverview;
