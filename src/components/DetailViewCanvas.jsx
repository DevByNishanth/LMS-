import React, { useEffect, useRef, useState } from "react";
import manImg from "../assets/man.svg";
import {
  Badge,
  Briefcase,
  Building2,
  Calendar1Icon,
  Clock,
  IdCardLanyard,
  Key,
  UserCog,
  X,
} from "lucide-react";

const DetailViewCanvas = ({ setIsDetailCanvas, canvasData }) => {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Attendance");

  useEffect(() => {
    function handleOutsideClick(e) {
      if (canvasRef.current && !canvasRef.current.contains(e.target)) {
        setIsDetailCanvas(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setIsDetailCanvas]);

  const attendanceData = Array(10).fill({
    date: "Wed, 17 July 2021",
    clockIn: "04:00 PM",
    clockOut: "04:00 PM",
    hours: "8hrs",
  });

  const subjectData = [
    {
      reg: "2019",
      name: "Digital Signal and Processing",
      year: "3 Year",
      dept: "ECE",
      sec: "Section A",
    },
    {
      reg: "2013",
      name: "Object oriented Programming",
      year: "1 Year",
      dept: "EEE",
      sec: "Section B",
    },
    {
      reg: "2019",
      name: "Object oriented Programming",
      year: "4 Year",
      dept: "MECH",
      sec: "Section B",
    },
  ];

  const timetableData = [
    {
      slot: "08:40 AM - 09:35 AM",
      mon: "3 Year - CSE A",
      tue: "3 Year - CSE A",
      wed: "FREE",
      thu: "FREE",
      fri: "3 Year - CSE A",
      sat: "3 Year - CSE A",
    },
    {
      slot: "09:35 AM - 10:30 AM",
      mon: "3 Year - CSE A",
      tue: "3 Year - CSE A",
      wed: "3 Year - CSE A",
      thu: "3 Year - CSE A",
      fri: "3 Year - CSE A",
      sat: "FREE",
    },
  ];

  const tabs = ["Attendance", "Subject List", "Timetable"];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50"></div>
      <section
        ref={canvasRef}
        className="w-[90%] bg-white h-[95vh] rounded-lg z-[60] fixed left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-[#0c3a4d]">
            Faculty Details Information
          </h2>
          <button
            onClick={() => setIsDetailCanvas(false)}
            className="p-1.5 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5 shrink-0">
            <div className="flex gap-6 items-start">
              <div className="w-[120px] h-[120px] shrink-0 border border-slate-900 bg-gray-50 rounded-xl flex items-center justify-center">
                <span className="text-5xl font-medium text-slate-800">
                  {canvasData?.firstName?.slice(0, 1) || "A"}
                </span>
              </div>

              <div className="flex-1 bg-gray-50/50 border border-gray-100 rounded-xl p-4 grid grid-cols-4 gap-4">
                {[
                  {
                    label: "First Name",
                    value: canvasData?.firstName || "Arun",
                  },
                  {
                    label: "Last Name",
                    value: canvasData?.lastName || "Kumar",
                  },
                  {
                    label: "Email",
                    value: canvasData?.email || "arunkumar70@college.edu",
                  },
                  {
                    label: "Phone",
                    value: canvasData?.mobileNumber || "9651464284",
                  },
                  { label: "Gender", value: canvasData?.gender || "Female" },
                  {
                    label: "Date of Birth",
                    value: canvasData?.dateOfBirth || "20-11-2003",
                  },
                  {
                    label: "Qualification",
                    value: canvasData?.qualification || "B.E",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-sky-600 rounded-full"></div>
                <h3 className="text-base font-medium text-gray-800">
                  Employee Details
                </h3>
              </div>

              <div className="grid grid-cols-5 gap-y-4 gap-x-2 mt-4 ">
                {[
                  {
                    icon: IdCardLanyard,
                    label: "Employee Id",
                    value: canvasData.employeeId || "EMP1070",
                  },
                  {
                    icon: Briefcase,
                    label: "Designation",
                    value: canvasData.designation || "Lecturer",
                  },
                  {
                    icon: Building2,
                    label: "Department",
                    value: canvasData.department || "EEE",
                  },
                  {
                    icon: UserCog,
                    label: "Reporting Manager",
                    value: canvasData?.reportingManager || "Manager B",
                  },
                  {
                    icon: Calendar1Icon,
                    label: "Joining Date",
                    value: canvasData?.joiningDate || "11-10-2022",
                  },
                  {
                    icon: Clock,
                    label: "Notice Period",
                    value: canvasData?.noticePeriod || "60 Days",
                  },
                  {
                    icon: Key,
                    label: "Role",
                    value: canvasData?.role || "Assistant Professor",
                  },
                  {
                    icon: Badge,
                    label: "Job Title",
                    value: canvasData?.jobTitle || "Senior Lecturer",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <item.icon className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium text-gray-400 uppercase">
                        {item.label}
                      </span>
                      <span className="text-sm text-gray-600 font-medium">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-5 bg-white overflow-hidden">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex bg-gray-100 p-1 rounded-full">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-2 text-xs font-bold rounded-full transition-all ${
                      activeTab === tab
                        ? "bg-[#1a5fb4] text-white shadow-md"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {activeTab === "Attendance" && (
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white outline-none">
                  <option>November</option>
                </select>
              )}
            </div>

            <div className="flex-1 border border-gray-100 rounded-md overflow-auto shadow-sm bg-white">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="sticky top-0 bg-[#0c3a4d] text-white z-10">
                  {activeTab === "Attendance" && (
                    <tr>
                      <th className="p-3 font-semibold">Date</th>
                      <th className="p-3 font-semibold">Clock-In</th>
                      <th className="p-3 font-semibold">Clock-out</th>
                      <th className="p-3 font-semibold">Working hours</th>
                    </tr>
                  )}
                  {activeTab === "Subject List" && (
                    <tr>
                      <th className="p-3 font-semibold">Regulation</th>
                      <th className="p-3 font-semibold">Subject Name</th>
                      <th className="p-3 font-semibold">Year</th>
                      <th className="p-3 font-semibold">Department</th>
                      <th className="p-3 font-semibold">Section</th>
                    </tr>
                  )}
                  {activeTab === "Timetable" && (
                    <tr>
                      <th className="p-3 font-semibold">Time Slot</th>
                      <th className="p-3 font-semibold">Mon</th>
                      <th className="p-3 font-semibold">Tue</th>
                      <th className="p-3 font-semibold">Wed</th>
                      <th className="p-3 font-semibold">Thu</th>
                      <th className="p-3 font-semibold">Fri</th>
                      <th className="p-3 font-semibold">Sat</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeTab === "Attendance" &&
                    attendanceData.map((row, i) => (
                      <tr
                        key={i}
                        className="even:bg-gray-50 hover:bg-blue-50/50 transition-colors "
                      >
                        <td className="p-3 text-gray-600">{row.date}</td>
                        <td className="p-3 text-gray-500">{row.clockIn}</td>
                        <td className="p-3 text-gray-500">{row.clockOut}</td>
                        <td className="p-3 text-gray-800 font-">
                          {row.hours}
                        </td>
                      </tr>
                    ))}
                  {activeTab === "Subject List" &&
                    subjectData.map((row, i) => (
                      <tr
                        key={i}
                        className="even:bg-gray-50 hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-3 text-gray-600">{row.reg}</td>
                        <td className="p-3 text-gray-800 font-semibold">
                          {row.name}
                        </td>
                        <td className="p-3 text-gray-500">{row.year}</td>
                        <td className="p-3 text-gray-500">{row.dept}</td>
                        <td className="p-3 text-blue-600 font-medium">
                          {row.sec}
                        </td>
                      </tr>
                    ))}
                  {activeTab === "Timetable" &&
                    timetableData.map((row, i) => (
                      <tr
                        key={i}
                        className="even:bg-gray-50 hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-3 text-gray-800 font-bold bg-gray-50/30">
                          {row.slot}
                        </td>
                        <td className="p-3 text-gray-600 italic text-xs">
                          {row.mon}
                        </td>
                        <td className="p-3 text-gray-600 italic text-xs">
                          {row.tue}
                        </td>
                        <td className="p-3 text-gray-600 italic text-xs">
                          {row.wed}
                        </td>
                        <td className="p-3 text-gray-600 italic text-xs">
                          {row.thu}
                        </td>
                        <td className="p-3 text-gray-600 italic text-xs">
                          {row.fri}
                        </td>
                        <td className="p-3 text-gray-600 italic text-xs">
                          {row.sat}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailViewCanvas;
