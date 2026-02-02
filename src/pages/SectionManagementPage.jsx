import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Bell, ChevronRight, User } from "lucide-react";
import notification from "../assets/notification.svg";
import StudentYearComponent from "../components/StudentYearComponent";
import StudentSectionComponent from "../components/StudentSectionComponent";
import StudentmanagementStatCard from "../components/StudentmanagementStatCard";
import StudentManagementStudentList from "../components/StudentManagementStudentList";
import StudentList from "../components/StudentList";
import { jwtDecode } from "jwt-decode";
import SwapStudentModal from "../components/SwapStudentModal";
import axios from "axios";

const years = ["2024-2025", "2025-2026", "2026-2027", "2027-2028"];

const SectionManagementPage = () => {
  // Auth
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;
  // const dept = "CSE"

  console.log("tok : ", token);

  // states
  const [firstLetter, setFirstLetter] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2025-2026");
  const [selectedYear, setSelectedYear] = useState("First Year");
  const [sections, setSections] = useState([
    "Section A",
    "Section B",
    "Section C",
    "un allocated",
  ]);
  const [selectedSection, setSelectedSection] = useState("A");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [isSwapModal, setIsSwapModal] = useState(false);
  const [dept, setDept] = useState("");

  const [modalSectionData, setModalSectionData] = useState([]);
  // const [years, setYears] = useState([])
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("LmsToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        const name =
          decoded?.name || decoded?.username || decoded?.user?.name || "";
        const department =
          decoded?.department || decoded?.user?.department || "";
        setDept(department);

        if (name) {
          setFirstLetter(name.charAt(0).toUpperCase());
        }
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  // useEffect call's

  useEffect(() => {
    handleGetData();
  }, []);

  // functions
  const onClose = () => {
    setIsSwapModal(false);
  };

  // API call
  async function handleGetData() {
    const res = await axios.get(
      `${apiUrl}api/students/department-summary?${dept}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    setData(res.data.years);
  }

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(
          `${apiUrl}api/students/filter?department=${dept}&year=${selectedYear}&section=${selectedSection}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setStudents(res.data.students);
      } catch (err) {
        console.error("Error while fetching students data : ", err);
      }
    }
    getData();
  }, [selectedSection, selectedYear, dept]);

  return (
    <>
      <section className="w-full h-screen flex">
        <div className="w-[20%]">
          <Sidebar />
        </div>
        <div className="container-2 w-[80%] h-full px-6">
          {/* header section  */}
          <div className="w-full flex items-center justify-between py-4  bg-white">
            {/* Left: Breadcrumb */}
            <div className="flex items-center">
              <span className="text-lg font-medium text-[#282526]">
                Section Management
              </span>
              <span className="text-gray-600">
                <ChevronRight />
              </span>

              <span className="text-[#0B56A4] font-medium text-lg">{dept}</span>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-4">
              {/* Notification */}
              <div className="p-2 rounded-full bg-gray-50 shadow-sm hover:shadow-md transition">
                <img src={notification} className="w-4 h-4" />
              </div>

              {/* Profile Image */}
              <div className="w-8 h-8 rounded-full bg-[#0B56A4] text-white flex items-center justify-center font-semibold shadow-sm">
                {firstLetter}
              </div>
            </div>
          </div>

          {/* main-content-container */}
          <div className="main-container mt-2">
            {/* heading  */}
            <header className="flex items-center justify-between">
              <h1 className="text-[#282526] font-medium text-lg">
                Student Details - Academic Year ({selectedAcademicYear})
              </h1>
              <select
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                className="border w-fit outline-none px-4 py-2 border-gray-300 rounded"
              >
                {years.map((item) => {
                  return <option value={item}>{item}</option>;
                })}
              </select>
            </header>

            {/* content section  */}
            <div className="content-container mt-4 grid grid-cols-12 gap-4 h-[calc(100vh-160px)]">
              {/* year container  */}
              <div className="year-container col-span-3 h-[100%]">
                <StudentYearComponent
                  setSelectedSection={setSelectedSection}
                  years={data}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                />
              </div>
              <div className="year-container col-span-4 h-[100%]">
                <StudentSectionComponent
                  setModalSectionData={setModalSectionData}
                  selectedYear={selectedYear}
                  sections={data}
                  setSelectedSection={setSelectedSection}
                  selectedSection={selectedSection}
                />
              </div>
              <div className="year-container col-span-5  h-[100%]">
                <StudentManagementStudentList
                  setIsSwapModal={setIsSwapModal}
                  students={students}
                  selectedStudents={selectedStudents}
                  setSelectedStudents={setSelectedStudents}
                  selectedSection={selectedSection}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {isSwapModal && (
        <SwapStudentModal
          sections={sections}
          selectedStudents={selectedStudents}
          onClose={onClose}
          modalSectionData={modalSectionData}
        />
      )}
    </>
  );
};

export default SectionManagementPage;
