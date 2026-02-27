import React from "react";
import activeRightArrow from "../assets/right-arrow.svg";

const ProgressRing = ({ percentage, isActive }) => {
  const radius = 9;
  const stroke = 2.5;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  if (percentage === 100) {
    return (
      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
        <svg
          className="w-3.5 h-3.5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          viewBox="0 0 24 24"
        >
          <path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center w-5 h-5">
      <svg height="20" width="20" className="transform -rotate-90">
        {/* Background Track */}
        <circle
          stroke={isActive ? "rgba(255,255,255,0.2)" : "#D1D5DB"}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="10"
          cy="10"
        />
        {/* Progress Fill - Vibrant Blue/Cyan */}
        <circle
          stroke={isActive ? "#38BDF8" : "#0EA5E9"}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx="10"
          cy="10"
          className="transition-all duration-700 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const CoursePlanTab = ({
  tabs,
  activeTab,
  setActiveTab,
  tabProgress,
  overallProgress,
}) => {
  return (
    <div className="w-full py-4 px-4 bg-white rounded-md h-full overflow-auto hide-scrollbar">
      <h2 className="text-[18px] font-bold text-gray-800 mb-1">
        Complete Your Course Plan
      </h2>

      <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
        Complete all sections to finalize your subject planning.
      </p>

      {/* Main Progress Bar Container */}
      <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
            Overall Progress
          </span>
          <span className="text-[12px] text-[#08384f] font-bold">
            {overallProgress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#08384f] to-[#1a5f7a] h-2 rounded-full transition-all duration-1000 ease-out shadow-inner"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-2.5">
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          const progress = tabProgress[index] || 0;

          return (
            <div
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 group
                ${
                  isActive
                    ? "bg-[#08384F] text-white shadow-lg shadow-blue-900/20 translate-x-1"
                    : "bg-white border border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"
                }`}
            >
              <div className="flex items-center gap-3">
                <ProgressRing percentage={progress} isActive={isActive} />
                <span
                  className={`text-[14px] font-semibold transition-colors ${isActive ? "text-white" : "text-gray-700 group-hover:text-[#08384F]"}`}
                >
                  {tab}
                </span>
              </div>

              {isActive ? (
                <div className="bg-white/10 p-1 rounded-lg">
                  <img
                    src={activeRightArrow}
                    alt="Right Arrow"
                    className="w-4 h-4 brightness-0 invert"
                  />
                </div>
              ) : (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <img
                    src={activeRightArrow}
                    alt="Right Arrow"
                    className="w-4 h-4 opacity-30"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursePlanTab;
