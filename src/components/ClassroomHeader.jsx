import React, { useEffect, useState } from "react";
import {
  Layout,
  ClipboardList,
  Users,
  GraduationCap,
  CalendarCheck,
  Map,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

const ClassroomHeader = ({ activeTab, setActiveTab }) => {
  const [firstLetter, setFirstLetter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("LmsToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name = decoded?.name || decoded?.username || decoded?.user?.name || "";
        if (name) {
          setFirstLetter(name.charAt(0).toUpperCase());
        }
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  const tabs = [
    { id: "stream", label: "Stream", icon: Layout },
    { id: "classwork", label: "Classwork", icon: ClipboardList },
    { id: "people", label: "Peoples", icon: Users },
    { id: "grades", label: "Grades", icon: GraduationCap },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "subjectPlanning", label: "Course plan", icon: Map },
  ];

  return (
    <header className="w-full border-b border-gray-100 bg-white px-6 py-4 flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab.toLowerCase() === tab.id.toLowerCase();
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#08384F] text-white shadow-lg shadow-blue-900/20"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  isActive ? "bg-white/20" : "bg-gray-200"
                }`}
              >
                <Icon size={16} strokeWidth={2.5} />
              </div>
              <span className="pr-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default ClassroomHeader;