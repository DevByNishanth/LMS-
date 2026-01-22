import React, { useEffect, useState } from "react";
import professor from "../assets/preofessorIcon.svg";
import totalFac from "../assets/totalFacultyIcon.svg";
import deanHod from "../assets/deanHodIcon.svg";
import assistant from "../assets/assistantAssociateIcon.svg";
import axios from "axios";

const FacultyManagementStatCard = () => {
  // Auth
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");

  // states
  const [finalData, setFinalData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`${apiUrl}api/faculty/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const stats = [
        {
          title: "Total Faculty Members",
          count: response.data.totalFaculty,
          color: "bg-[#DED9F9]",
          iconBg: "bg-[#927DFF]",
          iconSrc: totalFac,
        },
        {
          title: "Dean’s & Hod’s",
          count: response.data.deansAndHods,
          color: "bg-[#D9EBFE]",
          iconBg: "bg-[#59AAFF]",
          iconSrc: deanHod,
        },
        {
          title: "Professor",
          count: response.data.professors,
          color: "bg-[#D2F8ED]",
          iconBg: "bg-[#58A08B]",
          iconSrc: professor,
        },
        {
          title: "Associate & Assistant",
          count: response.data.associateAssistant,
          color: "bg-[#FFEED9]",
          iconBg: "bg-[#FFA73A]",
          iconSrc: assistant,
        },
      ];

      setFinalData(stats);
    } catch (error) {
      console.error("Error fetching faculty stats:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {finalData.map((item, index) => (
        <div
          key={index}
          className={`${item.color} flex items-center gap-4 px-5 py-4 rounded-xl`}
        >
          {/* Icon */}
          <div
            className={`${item.iconBg} w-10 h-10 rounded-full flex items-center justify-center`}
          >
            <img src={item.iconSrc} alt="icon" className="w-5 h-5" />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-sm font-medium text-gray-700">{item.title}</h3>
            <p className="text-lg font-semibold text-gray-900">{item.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacultyManagementStatCard;
