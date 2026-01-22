import React, { useEffect, useRef, useState } from "react";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import { Search, Plus, CheckCircle, XCircle } from "lucide-react";
import AddSubjectCanvas from "./AddSubjectCanvas";
const subjects = [
  {
    code: "101001021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101001021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101001021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101001021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101001021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101001021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101001021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101002021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101003021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101004021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101005021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101006021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "101007021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
  {
    code: "309009021331",
    name: "Electronic and communication",
    department: "Quantum pulse",
    regulation: "2013-2017",
  },
];
const SubjectTable = () => {
  // states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("subjectPlanning");
  const [addSubject, setAddSubject] = useState(false);

  const filteredSubjects = subjects.filter(
    (s) =>
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setSelectedTab("subjectPlanning");
          }}
          className={` ${
            selectedTab.toLowerCase() == "subjectplanning"
              ? "bg-[#0B56A4] text-white"
              : "border border-gray-300 text-black"
          } px-4 py-2 rounded-md font-medium cursor-pointer`}
        >
          Subject Planning
        </button>
        <button
          onClick={() => {
            setSelectedTab("timetableschedule");
          }}
          className={` ${
            selectedTab.toLowerCase() == "timetableschedule"
              ? "bg-[#0B56A4] text-white"
              : "border border-gray-300 text-black"
          } px-4 py-2 rounded-md font-medium cursor-pointer`}
        >
          Timetable Schedule
        </button>
      </div>

      {/* Search + Add */}
      <div className="main-container border border-gray-300 rounded-xl p-5">
        <div className="flex justify-between items-center mb-3 ">
          <h2 className="text-xl font-medium text-[#282526]">
            Subject Details
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                className="absolute left-2 top-2.5 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Subject and code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black-500"
              />
            </div>
            <button
              onClick={() => setAddSubject(true)}
              className="bg-[#0B56A4] text-white px-3 py-2 rounded-md flex items-center gap-1 text-sm cursor-pointer hover:bg-[#0b55a4e9]"
            >
              <Plus className="text-white w-6 h-6" /> Add Subject
            </button>
          </div>
        </div>

        {/* Table */}
        {selectedTab.toLowerCase() == "subjectplanning" ? (
          <div className="overflow-auto h-[calc(100vh-250px)] border border-gray-300 rounded-t-lg">
            <table className="w-full text-sm">
              <thead className="bg-[#08384F] text-white sticky top-0">
                <tr>
                  <td className="py-3 px-4 text-left">Subject Code</td>
                  <td className="py-3 px-4 text-left">Subject Name</td>
                  <td className="py-3 px-4 text-left">Department</td>
                  <td className="py-3 px-4 text-left">Regulation</td>
                  <td className="py-3 px-4 text-center">Action</td>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subj, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }  border-b border-gray-200 text-[13px]`}
                  >
                    <td className="py-3 px-4">{subj.code}</td>
                    <td className="py-3 px-4">{subj.name}</td>
                    <td className="py-3 px-4">{subj.department}</td>
                    <td className="py-3 px-4">{subj.regulation}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="bg-[#22DE6F] cursor-pointer text-white w-8 h-8 flex items-center justify-center rounded-full">
                          <img src={editIcon} alt="" />
                        </button>
                        <button className="bg-[#F24343] cursor-pointer text-white w-8 h-8 flex items-center justify-center rounded-full">
                          <img src={deleteIcon} alt="" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h1>Timetable schedule</h1>
          </div>
        )}
      </div>
      {addSubject && <AddSubjectCanvas setAddSubject={setAddSubject} />}
    </div>
  );
};

export default SubjectTable;
