import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { ChevronRight } from "lucide-react";
import notification from "../assets/notification.svg";
import StudentYearComponent from "../components/StudentYearComponent";
import StudentSectionComponent from "../components/StudentSectionComponent";
import StudentManagementStudentList from "../components/StudentManagementStudentList";
import { jwtDecode } from "jwt-decode";
import SwapStudentModal from "../components/SwapStudentModal";
import axios from "axios";
import HeaderComponent from "../components/HeaderComponent";

const years = ["2024-2025", "2025-2026", "2026-2027", "2027-2028"];

const SectionManagementPage = () => {
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2025-2026");
  const [selectedYear, setSelectedYear] = useState("1st Year");
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
  const [data, setData] = useState([]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const department =
          decoded?.department || decoded?.user?.department || "";
        setDept(department);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, [token]);

  useEffect(() => {
    if (dept) {
      handleGetData();
    }
  }, [dept]);

  useEffect(() => {
    async function getData() {
      if (!dept) return;
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
  }, [selectedSection, selectedYear, dept, apiUrl, token]);

  const onClose = () => {
    setIsSwapModal(false);
  };

  async function handleGetData() {
    try {
      const res = await axios.get(
        `${apiUrl}api/students/department-summary?department=${dept}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setData(res.data.years);
    } catch (err) {
      console.error("Error fetching department summary:", err);
    }
  }

  return (
    <>
      <section className="w-full h-screen flex overflow-hidden">
        <div className="w-[20%] h-full">
          <Sidebar />
        </div>
        <div className="w-[80%] h-full flex flex-col bg-gray-50/30">
          <HeaderComponent
            title="Section Management"
            second={dept}
            secondColor="text-[#0B56A4]"
          />

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="main-container mt-4">
              <header className="flex items-center justify-between mb-6">
                <h1 className="text-[#282526] font-semibold text-lg">
                  Student Details - Academic Year ({selectedAcademicYear})
                </h1>
                <select
                  value={selectedAcademicYear}
                  onChange={(e) => setSelectedAcademicYear(e.target.value)}
                  className="border border-gray-300 outline-none px-4 py-2 rounded-lg bg-white text-sm font-medium focus:ring-1 focus:ring-[#08384F] transition-all"
                >
                  {years.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </header>

              <div className="content-container grid grid-cols-12 gap-4 h-[calc(100vh-220px)]">
                <div className="col-span-3 h-full">
                  <StudentYearComponent
                    setSelectedSection={setSelectedSection}
                    years={data}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                  />
                </div>
                <div className="col-span-4 h-full">
                  <StudentSectionComponent
                    setModalSectionData={setModalSectionData}
                    selectedYear={selectedYear}
                    sections={data}
                    setSelectedSection={setSelectedSection}
                    selectedSection={selectedSection}
                  />
                </div>
                <div className="col-span-5 h-full">
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
