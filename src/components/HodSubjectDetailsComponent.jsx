import axios from "axios";
import { ArrowRight, ChevronRight, Pencil, Plus, Trash, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import SubjectRow from "./SubjectRow";
import noData from "../assets/noData.svg";
import { jwtDecode } from "jwt-decode";

const regulations = ["2026", "2029", "2032", "2035"];
const semester = [1, 2, 3, 4, 5, 6, 7, 8];

const HodSubjectDetailsComponent = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");
  
  const [selectedType, setSelectedType] = useState("theory");
  const [selectedRegulation, setSelectedRegulation] = useState("2026");
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [facultyDetails, setFacultyDetails] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [dept, setDept] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("LmsToken");
    if (token) {
      const decoded = jwtDecode(token);
      const department = decoded?.department;
      setDept(department);
    }
  }, []);

  useEffect(() => {
    if (!selectedRegulation || !selectedSemester || !selectedType || !dept)
      return;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}api/admin-allocation/hod-dashboard?subjectType=${selectedType}&semester=${selectedSemester}&regulation=${selectedRegulation}&department=${dept}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        setSubjectData(data.subjects);
        setFacultyDetails(data.faculty);
      } catch (error) {
        console.error("Error fetching allocation:", error);
      }
    };

    fetchData();
  }, [selectedType, selectedSemester, selectedRegulation, dept]);

  return (
    <>
      <section className="mt-4 ">
        <div className="header flex items-center justify-end gap-3">
          <select
            className="border border-gray-300 rounded px-4 py-2 w-[200px] outline-none"
            value={selectedRegulation}
            onChange={(e) => setSelectedRegulation(e.target.value)}
          >
            <option value="">Select regulation</option>
            {regulations.map((item) => (
              <option key={item} value={item}>
                {item} Regulation
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded px-4 py-2 w-[200px] outline-none"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">Select semester</option>
            {semester.map((item) => (
              <option key={item} value={item}>
                Semester {item}
              </option>
            ))}
          </select>
        </div>

        <div className="main-container grid grid-cols-12 gap-2 mt-4">
          <div className="first-tab-container min-h-[calc(100vh-170px)] overflow-auto border border-gray-300 rounded-lg col-span-3 px-4 py-6">
            <button
              onClick={() => setSelectedType("theory")}
              className={`w-full flex gap-2 items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                selectedType.toLowerCase() === "theory"
                  ? "bg-[#08384F] text-white"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Theory <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setSelectedType("lab")}
              className={`w-full mt-2 flex gap-2 items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                selectedType.toLowerCase() === "lab"
                  ? "bg-[#08384F] text-white"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Lab <ChevronRight size={18} />
            </button>
          </div>

          <div className="second-tab-container rounded-lg col-span-9 max-h-[calc(100vh-170px)] overflow-auto border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#083B5C] text-white">
                  <th className="py-3 px-4 text-left font-medium">Subject Code & Name</th>
                  <th className="py-3 px-4 text-left font-medium">Section</th>
                  <th className="py-3 px-4 text-left font-medium">Staff</th>
                </tr>
              </thead>

              <tbody>
                {subjectData.length !== 0 ? (
                  subjectData.map((item, index) => (
                    <SubjectRow
                      key={index}
                      item={item}
                      setFacultyDetails={setFacultyDetails}
                      setSubjectData={setSubjectData}
                      facultyDetails={facultyDetails}
                      selectedDept={dept}
                      selectedType={selectedType}
                      selectedSemester={selectedSemester}
                      selectedRegulation={selectedRegulation}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-10">
                      <div className="flex flex-col items-center justify-center">
                        <img src={noData} className="w-[250px]" alt="No data" />
                        <h1 className="text-gray-500 mt-4 font-medium">No data found!</h1>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default HodSubjectDetailsComponent;