import React from "react";
import activeRightArrow from "../assets/right-arrow.svg";

const ProgressRing = ({ percentage }) => {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  if (percentage === 100) {
    return (
      <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="10"
          cy="10"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          className="text-gray-300"
        />
        <circle
          cx="10"
          cy="10"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-blue-500 transition-all duration-500"
        />
      </svg>
    </div>
  );
};

const CoursePlanTab = ({
  tabProgress,
  overallProgress,
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    "Course Details",
    "CO-PO and CO-PSO Mapping",
    "Reference and others",
    "Lesson Planner ( Theory )",
    "Lesson Planner ( Lab )",
  ];

  return (
    <div className="w-full py-2 px-4 ">
      <h2 className="text-[18px] font-medium text-gray-800 mb-1">
        Complete Your Course Plan
      </h2>
      <p className="text-[12px] text-gray-400 mb-3 leading-relaxed">
        Complete all sections to finish your course planning.
      </p>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-[#08384f] h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <p className="text-[12px] text-[#08384f] font-medium mt-1">
          {overallProgress}% Total Progress
        </p>
      </div>

      <div className="space-y-2">
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          const progress = tabProgress[index] || 0;

          return (
            <div
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center justify-between px-3 py-3 rounded-md cursor-pointer transition-all duration-200
                                ${isActive ? "bg-[#08384F] text-white" : "bg-[#E6E9F5] text-gray-700 hover:bg-gray-300"}`}
            >
              <div className="flex items-center gap-2">
                <ProgressRing percentage={progress} />
                <span className="text-[14px] font-medium">{tab}</span>
              </div>
              {isActive && (
                <img
                  src={activeRightArrow}
                  alt="Arrow"
                  className="w-5 h-5 brightness-0 invert"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursePlanTab;
