import React, { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { useState } from "react";
import { Bell } from "lucide-react";
import notification from '../assets/notification.svg'
import StudentmanagementStatCard from '../components/StudentmanagementStatCard';
import StudentManagementPieChart from '../components/StudentManagementPieChart';
import StudentManagementTable from '../components/StudentManagementTable';
import { jwtDecode } from "jwt-decode";


const yearsList = [
  "2025 - 2026",
  "2024 - 2025",
  "2023 - 2024",
];
const StudentManagement = () => {
  const [selectedYear, setSelectedYear] = useState("2025 - 2026");
  const [firstName, setFirstName] = useState("");

  // useEffect calls 
  useEffect(() => {
    const token = localStorage.getItem("LmsToken");
    if (token) {
      const decoded = jwtDecode(token);
      const name =
        decoded?.name ||
        decoded?.username ||
        decoded?.user?.name ||
        "";
      if (name) {
        setFirstName(name.charAt(0).toUpperCase());
      }
    }
  }, [])

  return (
    <>

      <section className="w-[100%] h-[100vh] flex">
        <div className="container-1 w-[20%] h-[100%]">
          <Sidebar />
        </div>

        <div className="container-2 w-[80%] h-[100%]">
          <div className="w-full flex items-center justify-between px-6 py-3 bg-white">

            {/* LEFT TITLE */}
            <h1 className="text-lg font-medium text-[#282526]">
              Student Management - Academic Year ({selectedYear})
            </h1>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-6">

              {/* DROPDOWN */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-[150px]  focus:outline-none"
              >
                {yearsList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* BELL ICON */}
              <div className="p-2 rounded-full bg-gray-50 shadow-sm hover:shadow-md transition">
                <img src={notification} className="w-4 h-4" />
              </div>

              {/* Profile Image */}
              <div className="w-8 h-8 rounded-full bg-[#0B56A4] text-white flex items-center justify-center font-semibold shadow-sm">
                {firstName}
              </div>
            </div>
          </div>

          {/* statcard and piechart container  */}

          <div className="main-container mx-6 grid grid-cols-12 gap-2 mt-4">
            <StudentmanagementStatCard />
            <div className='col-span-5 border  border-gray-300 rounded-lg px-4 py-2'>
              <div className="header mb-3 flex items-center justify-between">
                <h1 className='text-[#282526] font-medium'>Department wise Students </h1>
                <select className='border w-[120px] border-gray-300 px-2 py-1 rounded-md'>
                  <option value="cse">CSE</option>
                  <option value="mech">MECH</option>
                  <option value="ai/ml">AI & ML</option>
                </select>
              </div>
              <StudentManagementPieChart />
            </div>
          </div>

          {/* table-container  */}
          <StudentManagementTable />


        </div>


      </section>
    </>
  )
}

export default StudentManagement