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

        const match = sections.find(item => item.year === selectedYear);
        setSecData(match?.sections || []);
        setModalSectionData(match?.sections)
    }, [sections, selectedYear]);
    return (
        <div className="w-full h-full bg-white border border-[#D6D6D6] rounded-xl p-4 space-y-3">
            {secData.map((section, index) => (
                <button
                    key={index}
                    onClick={() => setSelectedSection(section.section)}
                    className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg 
                    border border-[#D6D6D6] transition
                    ${selectedSection === section.section
                            ? "bg-[#0B56A4] text-white border-[#0B56A4]"
                            : "bg-white text-gray-800 hover:bg-gray-50"
                        }
                    `}
                >
                    <span className="font-medium">{section.section}</span>
                    <ChevronRight
                        className={`w-6 h-6 ${selectedSection === section.section ? "text-white" : "text-gray-500"
                            }`}
                    />
                </button>
            ))}

        </div>
    );
};

export default StudentSectionComponent;
