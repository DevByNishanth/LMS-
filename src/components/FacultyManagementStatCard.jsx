import React, { useEffect, useState } from "react";
import professor from "../assets/preofessorIcon.svg";
import totalFac from "../assets/totalFacultyIcon.svg";
import deanHod from "../assets/deanHodIcon.svg";
import assistant from "../assets/assistantAssociateIcon.svg";
import axios from "axios";
import { Users, User } from "lucide-react";

const FacultyManagementStatCard = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");

  const [stats, setStats] = useState({
    totalFaculty: 0,
    deansAndHods: 0,
    professors: 0,
    associateAssistant: 0,
    supportingStaffs: 0,
  });

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

      const { totalFaculty, deansAndHods, professors, associateAssistant } =
        response.data;

      const supporting =
        totalFaculty - (deansAndHods + professors + associateAssistant);

      setStats({
        totalFaculty,
        deansAndHods,
        professors,
        associateAssistant,
        supportingStaffs: supporting > 0 ? supporting : 0,
      });
    } catch (error) {
      console.error("Error fetching faculty stats:", error);
    }
  };

  return (
    <section className="col-span-7 ">
      <section className="grid grid-cols-20 gap-4">
        <div className="col-span-7 flex items-center bg-[#DED9F9] rounded-xl py-6 px-4">
          <div className="space-y-2 text-[#282526] font-medium">
            <div className="w-10 h-10 bg-[#927DFF] text-white rounded-full flex items-center justify-center">
              <img
                src={totalFac}
                alt="icon"
                className="w-5 h-5 brightness-0 invert"
              />
            </div>
            <h2 className="text-sm">Total Faculty Members</h2>
            <p className="text-2xl font-semibold">{stats.totalFaculty}</p>
          </div>
        </div>

        <div className="col-span-13 grid grid-cols-2 gap-4">
          <div className="bg-[#D9EBFE] rounded-xl px-3 py-4">
            <div className="flex items-center gap-3 text-[#282526]">
              <div className="w-10 h-10 bg-[#59AAFF] rounded-full flex items-center justify-center shrink-0">
                <img
                  src={deanHod}
                  alt="icon"
                  className="w-5 h-5 brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium">Dean's & Hod's</h3>
                <p className="text-lg font-semibold">{stats.deansAndHods}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#D2F8ED] rounded-xl p-5">
            <div className="flex items-center gap-3 text-[#282526]">
              <div className="w-10 h-10 bg-[#58A08B] rounded-full flex items-center justify-center shrink-0">
                <img
                  src={professor}
                  alt="icon"
                  className="w-5 h-5 brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium">Professor</h3>
                <p className="text-lg font-semibold">{stats.professors}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFEED9] rounded-xl p-5">
            <div className="flex items-center gap-3 text-[#282526]">
              <div className="w-10 h-10 bg-[#FFA73A] rounded-full flex items-center justify-center shrink-0">
                <img
                  src={assistant}
                  alt="icon"
                  className="w-5 h-5 brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium">Associate & Assistant</h3>
                <p className="text-lg font-semibold">
                  {stats.associateAssistant}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F5F5] rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 text-[#282526]">
              <div className="w-10 h-10 bg-[#707070] rounded-full flex items-center justify-center shrink-0">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Supporting Staffs</h3>
                <p className="text-lg font-semibold">
                  {stats.supportingStaffs}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default FacultyManagementStatCard;
