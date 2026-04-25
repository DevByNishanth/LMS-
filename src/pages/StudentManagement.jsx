import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StudentmanagementStatCard from "../components/StudentmanagementStatCard";
import StudentManagementPieChart from "../components/StudentManagementPieChart";
import StudentManagementTable from "../components/StudentManagementTable";
import HeaderComponent from "../components/HeaderComponent";

const yearsList = ["2025 - 2026", "2024 - 2025", "2023 - 2024"];

const StudentManagement = () => {
  const [selectedYear, setSelectedYear] = useState("2025 - 2026");

  return (
    <>
      <section className="w-full h-screen flex overflow-hidden ">
        <div className="w-[20%] h-full">
          <Sidebar />
        </div>

        <div className="w-[80%] h-full flex flex-col bg-gray-50/30">
          <HeaderComponent
            title={`Student Management - Academic Year (${selectedYear})`}
          >
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-[150px] focus:outline-none focus:ring-1 focus:ring-[#08384F] bg-white transition-all"
            >
              {yearsList.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </HeaderComponent>

          <div className="flex-1 overflow-y-auto pb-6 ">
            <div className="mx-6 grid grid-cols-12 gap-4 mt-6">
              <StudentmanagementStatCard />

              <div className="col-span-5 border border-gray-300 bg-white rounded-lg px-4 py-4 shadow-sm">
                <div className="header mb-4 flex items-center justify-between">
                  <h1 className="text-[#282526] font-medium">
                    Department wise Students
                  </h1>
                  <select className="border w-[120px] border-gray-300 px-2 py-1 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-[#08384F]">
                    <option value="cse">CSE</option>
                    <option value="mech">MECH</option>
                    <option value="ai/ml">AI & ML</option>
                  </select>
                </div>
                <StudentManagementPieChart />
              </div>
            </div>

            <div className="mt-4">
              <StudentManagementTable />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudentManagement;
