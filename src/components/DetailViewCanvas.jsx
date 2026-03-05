import React, { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import noData from "../assets/noData.svg";

const DetailViewCanvas = ({ setIsDetailCanvas, canvasData }) => {

  // Auth 
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");


  const canvasRef = useRef(null);
  // states ==========================================
  const [activeTab, setActiveTab] = useState("Employee Overview");
  const [subjectData, setSubjectData] = useState([]);
  const [timetableData, setTimetableData] = useState([]);




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

  // const subjectData = [
  //   {
  //     reg: "2019",
  //     name: "Digital Signal and Processing",
  //     year: "3 Year",
  //     dept: "ECE",
  //     sec: "Section A",
  //   },
  //   {
  //     reg: "2013",
  //     name: "Object oriented Programming",
  //     year: "1 Year",
  //     dept: "EEE",
  //     sec: "Section B",
  //   },
  //   {
  //     reg: "2019",
  //     name: "Object oriented Programming",
  //     year: "4 Year",
  //     dept: "MECH",
  //     sec: "Section B",
  //   },
  // ];



  const tabs = ["Employee Overview", "Attendance", "Subject List", "Timetable"];


  // functions =============================

  async function fetchSubjectList() {
    try {
      const res = await axios.get(`${apiUrl}api/admin/faculty/${canvasData._id}/subjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Subject List Response:", res.data.data);
      setSubjectData(res.data.data);
    } catch (err) {
      console.error("Error fetching subject list:", err);
    }
  }

  async function fetchTimetable() {
    try {
      const res = await axios.get(`${apiUrl}api/admin/faculty/${canvasData._id}/timetable`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Timetable Response:", res.data.data);

      // Transform timetable data
      const transformedData = transformTimetableData(res.data.data);
      setTimetableData(transformedData);
    } catch (err) {
      console.error("Error fetching timetable:", err);
    }
  }

  function transformTimetableData(apiData) {
    if (!apiData || apiData.length === 0) return [];

    const data = apiData[0]; // Get first item
    const daysMap = {};
    const timeSlots = new Set();

    // Map days to their slots and collect all time slots
    data.days.forEach(dayObj => {
      daysMap[dayObj.day] = dayObj.slots;
      dayObj.slots.forEach(slot => timeSlots.add(slot.time));
    });

    // Convert timeSlots Set to sorted array
    const sortedTimeSlots = Array.from(timeSlots).sort();

    // Create mapping from full day names to short keys
    const dayKeyMap = {
      'Monday': 'mon',
      'Tuesday': 'tue',
      'Wednesday': 'wed',
      'Thursday': 'thu',
      'Friday': 'fri',
      'Saturday': 'sat',
      'Sunday': 'sun'
    };

    // Build rows for each time slot
    const rows = sortedTimeSlots.map(timeSlot => {
      const row = { slot: timeSlot };

      // Define day order
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      dayOrder.forEach(day => {
        const key = dayKeyMap[day];
        const daySlots = daysMap[day] || [];
        const subject = daySlots.find(s => s.time === timeSlot);
        row[key] = subject ? subject.subjectName : '--';
      });

      return row;
    });

    return rows;
  }

  useEffect(() => {
    fetchSubjectList();
    fetchTimetable();
  }, [canvasData])

  // Helper function to check if data is available for current tab
  const isDataAvailable = () => {
    switch (activeTab) {
      case "Employee Overview":
        return true; // Always show employee overview
      case "Attendance":
        return attendanceData && attendanceData.length > 0;
      case "Subject List":
        return subjectData && subjectData.length > 0;
      case "Timetable":
        return timetableData && timetableData.length > 0;
      default:
        return false;
    }
  };

  // consoles ------------------------------------------------------

  // jsx --------------------------------------------------------- 
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"></div>
      <section
        ref={canvasRef}
        className="w-[96%] bg-white h-[95vh] rounded  z-[60] fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 shadow-2xl flex flex-col overflow-auto animate-in zoom-in-95 duration-200"
      >
        <div className="flex justify-between items-center px-6 py-2 border-b border-gray-100 bg-white sticky top-0 z-20">
          <h2 className="text-lg font-semibold text-[#08384F]">
            Faculty Profile Information
          </h2>
          <button
            onClick={() => setIsDetailCanvas(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <X size={24} className="text-gray-400 group-hover:text-gray-700" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* faculty information section  */}
          <div className="p-6 shrink-0 space-y-6">
            {/* basic information section  */}
            <div className="flex gap-8 items-start">
              <div className="w-[160px] h-[150px] shrink-0 border-2 border-gray-300 bg-gray-50 rounded flex items-center justify-center">
                <span className="text-5xl font-bold text-[#08384F]">
                  {canvasData?.firstName?.slice(0, 1) || "--"}
                </span>
              </div>

              <div className="flex-1 bg-gray-50 border border-gray-300 rounded p-5 grid grid-cols-4 gap-6 shadow-sm">
                {[
                  { label: "First Name", value: canvasData?.firstName },
                  { label: "Last Name", value: canvasData?.lastName },
                  { label: "Email Address", value: canvasData?.email },
                  { label: "Phone", value: canvasData?.mobileNumber },
                  { label: "Gender", value: canvasData?.gender },
                  { label: "Date of Birth", value: canvasData?.dateOfBirth },
                  { label: "Qualification", value: canvasData?.qualification },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 truncate">
                      {item.value || "--"}
                    </span>
                  </div>
                ))}
              </div>
            </div>


          </div>

          <div className="flex-1 flex flex-col px-6">
            <div className="flex items-center justify-between mb-5 shrink-0">
              <div className="flex bg-gray-100 p-1.5 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-10 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab
                      ? "bg-[#08384F] text-white shadow-lg"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {activeTab === "Attendance" && (
                <select className="border border-gray-300 rounded px-4 py-2 text-xs font-semibold text-gray-700 bg-white outline-none cursor-pointer hover:border-[#0B56A4] transition-colors">
                  <option>November 2024</option>
                  <option>October 2024</option>
                </select>
              )}
            </div>

            <div className="flex-1 border bg-white border-gray-700 max-h-[calc(100vh-380px)] rounded overflow-auto ">
              {isDataAvailable() ? (
                <table className="w-full text-left text-sm border-separate border-spacing-0">
                  <thead className="sticky top-0 bg-[#08384F] text-white z-10">
                    <tr>
                      {activeTab === "Employee Overview" && (
                        // <th className="p-4 font-bold">Employment Summary</th>
                        ""
                      )}
                      {activeTab === "Attendance" && (
                        <>
                          <th className="p-4 font-bold border-r border-white/10">Date</th>
                          <th className="p-4 font-bold border-r border-white/10">Clock-In</th>
                          <th className="p-4 font-bold border-r border-white/10">Clock-out</th>
                          <th className="p-4 font-bold">Working hours</th>
                        </>
                      )}
                      {activeTab === "Subject List" && (
                        <>
                          <th className="p-4 font-bold border-r border-white/10">Sub code</th>
                          <th className="p-4 font-bold border-r border-white/10">Subject Name</th>
                          <th className="p-4 font-bold border-r border-white/10">Year</th>
                          <th className="p-4 font-bold border-r border-white/10">Department</th>
                          <th className="p-4 font-bold">Section</th>
                        </>
                      )}
                      {activeTab === "Timetable" && (
                        <>
                          <th className="p-4 font-bold border-r border-white/10">Time Slot</th>
                          <th className="p-4 font-bold border-r border-white/10">Mon</th>
                          <th className="p-4 font-bold border-r border-white/10">Tue</th>
                          <th className="p-4 font-bold border-r border-white/10">Wed</th>
                          <th className="p-4 font-bold border-r border-white/10">Thu</th>
                          <th className="p-4 font-bold border-r border-white/10">Fri</th>
                          <th className="p-4 font-bold">Sat</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeTab === "Employee Overview" && (
                      <tr>
                        <td colSpan="5" className="p-6">
                          <div className="employee-overview-section bg-white  border-gray-300 rounded">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-1.5 h-6 bg-[#0B56A4] rounded-full"></div>
                              <h3 className="text-lg font-semibold text-gray-800">Employment Overview</h3>
                            </div>

                            <div className="grid grid-cols-4 gap-y-6 gap-x-4">
                              {[
                                { icon: IdCardLanyard, label: "Employee Id", value: canvasData.employeeId },
                                { icon: Briefcase, label: "Designation", value: canvasData.designation },
                                { icon: Building2, label: "Department", value: canvasData.department },
                                { icon: UserCog, label: "Reporting Manager", value: canvasData?.reportingManager },
                                { icon: Calendar1Icon, label: "Joining Date", value: canvasData?.joiningDate },
                                { icon: Clock, label: "Notice Period", value: canvasData?.noticePeriod },
                                { icon: Key, label: "Role", value: canvasData?.role },
                                { icon: Badge, label: "Job Title", value: canvasData?.jobTitle },
                              ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                                    <item.icon size={18} className="text-[#0B56A4]" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                      {item.label}
                                    </span>
                                    <span className="text-sm text-gray-700 font-semibold">
                                      {item.value || "--"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {activeTab === "Attendance" &&
                      attendanceData.map((row, i) => (
                        <tr key={i} className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-gray-700 font-medium">{row.date}</td>
                          <td className="p-4 text-emerald-700 font-semibold">{row.clockIn}</td>
                          <td className="p-4 text-rose-700 font-semibold">{row.clockOut}</td>
                          <td className="p-4 text-gray-700 font-semibold">{row.hours}</td>
                        </tr>
                      ))}
                    {activeTab === "Subject List" &&
                      subjectData.map((row, i) => (
                        <tr key={i} className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-gray-500 font-bold">{row.subjectCode}</td>
                          <td className="p-4 text-gray-800 font-bold">{row.subject}</td>
                          <td className="p-4 text-gray-600 font-medium">{row.year}</td>
                          <td className="p-4 text-gray-600 font-medium">{row.department}</td>
                          <td className="p-4">
                            <span className=" font-medium">
                              {row.sec}
                            </span>
                          </td>
                        </tr>
                      ))}
                    {activeTab === "Timetable" &&
                      timetableData.map((row, i) => (
                        <tr key={i} className="hover:bg-blue-50 transition-colors">
                          <td className="p-4 text-[#08384F] font-bold bg-gray-50/80">{row.slot}</td>
                          {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat].map((day, idx) => (
                            <td key={idx} className={`p-4 text-xs font-bold ${day === "FREE" ? "text-gray-300 italic" : "text-gray-600"}`}>
                              {day}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <img
                    src={noData}
                    alt="No data available"
                    className="w-[220px] h-[220px] "
                  />
                  <p className="text-gray-800 text-lg -mt-10 font-medium">
                    No data available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailViewCanvas;