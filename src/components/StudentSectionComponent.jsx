import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

const StudentSectionComponent = ({
  setModalSectionData,
  selectedYear,
  sections,
  selectedSection,
  setSelectedSection,
}) => {
  const [secData, setSecData] = useState([]);

  useEffect(() => {
    if (!sections || sections.length === 0) return;

    const match = sections.find((item) => item.year === selectedYear);
    const currentSections = match?.sections || [];
    setSecData(currentSections);
    setModalSectionData(currentSections);
  }, [sections, selectedYear, setModalSectionData]);

  return (
    <div className="w-full h-full bg-white border border-[#D6D6D6] rounded-xl p-4 space-y-3 overflow-y-auto">
      {secData.map((section, index) => (
        <button
          key={index}
          onClick={() => setSelectedSection(section.section)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 outline-none
                        ${
                          selectedSection === section.section
                            ? "bg-[#08384F] text-white border-[#08384F] shadow-md"
                            : "bg-white text-gray-700 border-[#D6D6D6] hover:bg-gray-50 active:scale-[0.98]"
                        }`}
        >
          <span className="font-semibold text-sm uppercase tracking-wide">
            Section {section.section}
          </span>
          <ChevronRight
            className={`w-5 h-5 transition-transform duration-200 ${
              selectedSection === section.section
                ? "text-white translate-x-1"
                : "text-gray-400"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StudentSectionComponent;
