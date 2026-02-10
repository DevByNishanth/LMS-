import React from "react";
import { Share2, BookOpen, Users, BarChart2, Bell } from "lucide-react";

const ClassroomHeader = ({ activeItem = "Stream", setActiveItem }) => {
  const tabs = [
    { id: "Stream", label: "Stream", icon: <Share2 size={18} /> },
    { id: "Classwork", label: "Classwork", icon: <BookOpen size={18} /> },
    { id: "Peoples", label: "Peoples", icon: <Users size={18} /> },
    { id: "Grades", label: "Grades", icon: <BarChart2 size={18} /> },
  ];

  return (
    <div className="flex items-center justify-between w-full px-8 py-3 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        {tabs.map((tab) => {
          const isActive = activeItem?.toLowerCase() === tab.id.toLowerCase();

          return (
            <button
              key={tab.id}
              onClick={() => setActiveItem(tab.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#0B56A4] text-white shadow-md"
                  : "bg-[#E8F0FE] text-[#18283b] hover:bg-[#d0e1fd]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-gray-50 transition">
          <Bell size={22} />
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-black border-2 border-white rounded-full"></span>
        </button>

        <div className="cursor-pointer">
          <img
            src="https://i.pravatar.cc/150?u=surya"
            alt="User Profile"
            className="w-10 h-10 rounded-full border border-gray-200 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ClassroomHeader;