import axios from "axios";
import { ArrowRight, ChevronRight, Pencil, Plus, Trash, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import SubjectRow from "./SubjectRow";
import noData from "../assets/noData.svg";
import { jwtDecode } from "jwt-decode";


const tableHeader = ["Subject", "Section", "Staff", "Action"];
const regulations = ["2026", "2029", "2032", "2035"];
const semester = [1, 2, 3, 4, 5, 6, 7, 8];
const subjects = [
  { subject: "CS6801- Electronic and communication" },
  { subject: "CS6802- Electronic and communication" },
];

const data = [
  {
    subject: "Electronic and Communication",
    sections: [
      {
        sectionName: "Section A",
        staff: { name: "Surya Chandran" },
      },
      {
        sectionName: "Section B",
        staff: null,
      },
      {
        sectionName: "Section C",
        staff: { name: "Surya Chandran" },
      },
    ],
  },
  {
    subject: "Electronic and Communication",
    sections: [
      {
        sectionName: "Section A",
        staff: { name: "Surya Chandran" },
      },
      {
        sectionName: "Section B",
        staff: null,
      },
      {
        sectionName: "Section C",
        staff: { name: "Surya Chandran" },
      },
    ],
  },
  {
    subject: "Electronic and Communication",
    sections: [
      {
        sectionName: "Section A",
        staff: { name: "Surya Chandran" },
      },
      {
        sectionName: "Section B",
        staff: null,
      },
      {
        sectionName: "Section C",
        staff: { name: "Surya Chandran" },
      },
    ],
  },
];

const HodSubjectDetailsComponent = () => {
  // Auth ----------------------------->
  const apiUrl = import.meta.env.VITE_API_URL; // from .env file
  const token = localStorage.getItem("LmsToken");
  // states
  const [selectedType, setSelectedType] = useState("theory");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedRegulation, setSelectedRegulation] = useState(2026);
  const [selectedSemester, setSelectedSemester] = useState(1);
  // const [selectedDept, setSelectedDept] = useState("CSE"); // default
  const [facultyDetails, setFacultyDetails] = useState([]);

  // const [subjectData, setSubjectData] = useState([
  //   {
  //     subject: "Electronic and Communication",
  //     sections: [
  //       {
  //         sectionName: "Section A",
  //         staff: {
  //           name: "Surya Chandran",
  //           id: "staff_01",
  //         },
  //       },
  //       {
  //         sectionName: "Section B",
  //         staff: null,
  //       },
  //       {
  //         sectionName: "Section C",
  //         staff: {
  //           name: "Surya Chandran",
  //           id: "staff_01",
  //         },
  //       },
  //     ],
  //   },
  // ]);

  const [subjectData, setSubjectData] = useState([]);
  const [dept, setDept] = useState("");



  // useEffect call's --------------------------------------------->

  useEffect(() => {
    const token = localStorage.getItem("LmsToken");
    if (token) {
      const decoded = jwtDecode(token);
      const department =
        decoded?.department
      setDept(department);
    }
  }, [])



  useEffect(() => {
    if (!selectedRegulation || !selectedSemester || !selectedType || !dept) return;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}api/admin-allocation/hod-dashboard?type=${selectedType}&semester=${selectedSemester}&regulation=${selectedRegulation}&department=${dept}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setSubjectData(data.subjects); // update table data
        setFacultyDetails(data.faculty);
      } catch (error) {
        console.error("Error fetching allocation:", error);
      }
    };

    fetchData();
  }, [selectedType, selectedSemester, selectedRegulation, dept]);

  //   functions ------------------------------------------->

  return (
    <>
      <section className="mt-4 ">
        {/* header section ---------------  */}
        <div className="header flex items-center justify-end gap-3">
          <select
            className="border border-gray-300 rounded px-4 py-2 w-[200px]"
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
            className="border border-gray-300 rounded px-4 py-2 w-[200px]"
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
        {/* bg-[#08384F] */}
        {/* body section -------------------  */}
        <div className="main-container grid grid-cols-12 gap-2 mt-4">
          <div className="first-tab-container min-h-[calc(100vh-170px)]   overflow-auto border border-gray-300 rounded-lg col-span-3 px-4 py-6">
            <button
              onClick={() => setSelectedType("theory")}
              className={`w-full   flex gap-2 items-center justify-between px-4 py-2 rounded-lg ${selectedType.toLowerCase() == "theory"
                ? "bg-[#0B56A4] text-white"
                : "border border-gray-300"
                }`}
            >
              Theory <ChevronRight />
            </button>
            <button
              onClick={() => setSelectedType("lab")}
              className={`w-full mt-2 flex gap-2 items-center justify-between px-4 py-2 rounded-lg ${selectedType.toLowerCase() == "lab"
                ? "bg-[#0B56A4] text-white"
                : "border border-gray-300"
                }`}
            >
              Lab <ChevronRight />
            </button>
          </div>
          {/* table section --------------------------------------  */}
          <div className="second-tab-container rounded-lg col-span-9 max-h-[calc(100vh-170px)] overflow-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 ">
                <tr className="bg-[#083B5C] text-white">
                  <th className="py-3 px-4 text-left">Subject</th>
                  <th className="py-3 px-4 text-left">Section</th>
                  <th className="py-3 px-4 text-left">Staff</th>
                </tr>
              </thead>

              <tbody>
                {/* {subjectData.map((item, index) => (
                  <SubjectRow key={index} item={item} />
                ))} */}
                {subjectData.length !== 0 ? (
                  subjectData.map((item, index) => {
                    return (
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
                        setSelectedDept={setDept}
                        setSelectedType={setSelectedType}
                        setSelectedSemester={setSelectedSemester}
                        setSelectedRegulation={setSelectedRegulation}
                      />
                    );
                  })
                ) : (
                  <>
                    <div className=" translate-x-[85%] mt-8 w-fit">
                      <img src={noData} className="w-[300px] " />
                      <h1 className="text-gray-600 m-auto w-fit mt-4">
                        No data found!
                      </h1>
                    </div>
                  </>
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
