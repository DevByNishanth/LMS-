import React from "react";
import { ChevronRight } from "lucide-react";

const StudentYearComponent = ({
  years,
  selectedYear,
  setSelectedYear,
  setSelectedSection,
}) => {
  return (
    <div className="w-full h-full bg-white border border-[#D6D6D6] rounded-xl p-4 space-y-3 overflow-y-auto">
      {years.map((year, index) => (
        <button
          key={index}
          onClick={() => {
            setSelectedSection("A");
            setSelectedYear(year.year);
          }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border border-[#D6D6D6] transition-all duration-200 outline-none
                        ${
                          selectedYear === year.year
                            ? "bg-[#08384F] text-white border-[#08384F] shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98]"
                        }`}
        >
          <span className="font-semibold text-sm uppercase tracking-wide">
            {year.year}
          </span>
          <ChevronRight
            className={`w-5 h-5 transition-transform duration-200 ${
              selectedYear === year.year
                ? "text-white translate-x-1"
                : "text-gray-400"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StudentYearComponent;
