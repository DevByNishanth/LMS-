import { ChevronRight, Plus, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import noData from "../assets/noData.svg";
import axios from "axios";
const allSubjects = [
  { code: "CS6801", name: "Electronic and Communication" },
  { code: "CS6802", name: "Computer Networks" },
  { code: "CS6803", name: "Database Systems" },
  { code: "CS6804", name: "Operating Systems" },
  { code: "CS6805", name: "Artificial Intelligence" },
  { code: "CS6806", name: "Cloud Computing" },
];

const AddSubjectComponent = ({ facultyData, subjectData }) => {
  //    params
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const dept = params.get("dept");
  const formattedDept =
    dept.match(/\(([^)]+)\)/)?.[1].replace(/\s+/g, "") ||
    dept.replace(/\s+/g, "");
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;
  // states
  const [semesterType, setSemesterType] = useState("odd");
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedType, setSelectedType] = useState("Theory");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffSearch, setStaffSearch] = useState("");
  const [isStaffList, setIsStaffList] = useState(false);
  const [regulation, setRegulation] = useState(2026);

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // ref's
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  //   useEffect call's

  // outside click handler
  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsStaffList(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // auto update selected semester when odd/even changes
  useEffect(() => {
    setSelectedSemester(semesterType === "odd" ? 1 : 2);
  }, [semesterType]);

  // Fetch and pre-check existing allocated subjects
  useEffect(() => {
    const fetchAllocatedSubjects = async () => {
      if (!formattedDept || !selectedType || !selectedSemester || !semesterType || !regulation) {
        return;
      }

      try {
        const response = await axios.get(
          `${apiUrl}api/admin-allocation/subjects`,
          {
            params: {
              department: formattedDept,
              subjectType: selectedType,
              semester: selectedSemester,
              semesterType: semesterType,
              regulation: regulation,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Pre-check the subjects that are already allocated
        if (response.data && response.data.allocation && response.data.allocation.subjects) {
          const allocatedSubjects = response.data.allocation.subjects;
          setSelectedSubjects(allocatedSubjects);
        } else {
          setSelectedSubjects([]);
        }
      } catch (err) {
        console.error("Error fetching allocated subjects:", err);
        setSelectedSubjects([]);
      }
    };

    fetchAllocatedSubjects();
  }, [formattedDept, selectedType, selectedSemester, semesterType, regulation, token, apiUrl]);

  // functions

  const filteredStaff = facultyData.filter((staff) =>
    staff.firstName.toLowerCase().includes(staffSearch.toLowerCase())
  );

  // Filter based on search query
  const filteredSubjects = subjectData.filter(
    (sub) =>
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Odd or even semester list
  const oddSemesters = [1, 3, 5, 7];
  const evenSemesters = [2, 4, 6, 8];

  const handleSubjectToggle = (subjectObj) => {
    setSelectedSubjects((prev) => {
      const exists = prev.some((s) => s.code === subjectObj.code);
      if (exists) {
        // remove it
        return prev.filter((s) => s.code !== subjectObj.code);
      } else {
        // add it
        return [...prev, subjectObj];
      }
    });
  };

  const handleSave = async () => {
    const cleanSubjects = selectedSubjects.filter(
      (s) => s.code.trim() !== "" && s.subject.trim() !== ""
    );

    // Validation
    if (!selectedSemester) {
      alert("Please select a semester.");
      return;
    }
    if (!semesterType) {
      alert("Please select a semester type.");
      return;
    }
    if (!selectedType) {
      alert("Please select a subject type.");
      return;
    }
    if (!regulation) {
      alert("Please select a regulation.");
      return;
    }
    if (cleanSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }
    if (!formattedDept) {
      alert("Department is not available.");
      return;
    }

    const data = {
      semester: selectedSemester,
      semesterType: semesterType,
      subjectType: selectedType,
      regulation: regulation,
      subjects: cleanSubjects,
      department: formattedDept,
    };

    try {
      const res = await axios.post(
        `${apiUrl}api/admin-allocation/allocate-subjects`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 required header
            "Content-Type": "application/json",
          },
        }
      );
      alert("Subjects saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save subjects");
    }
  };

  // update staff 
  async function handleStaffUpdate() {
    if (!selectedStaff) {
      alert("Please select a staff member first.");
      return;
    }

    if (!formattedDept) {
      alert("Department is not available.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}api/admin/allocate-hod`,
        {
          facultyId: selectedStaff,
          department: formattedDept
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      alert("Staff allocated successfully!");
      setIsStaffList(false);
      setSelectedStaff(null);
    } catch (error) {
      console.error("Error updating staff:", error);
      alert("Failed to allocate staff");
    }
  }
  return (
    <>
      <section className="w-full p-4">
        {/* Header */}
        <div className="header-container mt-4 flex justify-end">
          <div className="container w-[600px] flex gap-4 items-center">
            <select
              className="w-[200px] outline-none border border-gray-400 px-3 py-2 rounded"
              value={regulation}
              onChange={(e) => setRegulation(e.target.value)}
            >
              <option value="" disabled>
                Select Regulation
              </option>
              <option value="2026">2026</option>
              <option value="2029">2029</option>
              <option value="2032">2032</option>
              <option value="2035">2035</option>
              <option value="2038">2038</option>
            </select>

            <select
              className="w-[200px] outline-none border border-gray-400 px-3 py-2 rounded"
              onChange={(e) => setSemesterType(e.target.value)}
              value={semesterType}
            >
              <option value="odd">Odd Semester</option>
              <option value="even">Even Semester</option>
            </select>

            <div className="btn-container relative">
              <button
                ref={buttonRef}
                onClick={() => {
                  setIsStaffList(!isStaffList);
                }}
                className={`bg-[#0B56A4] text-white px-3 py-2 text-lg cursor-pointer hover:bg-[#0b55a4dd] rounded flex gap-2 items-center w-[200px]  `}
              >
                <Plus
                  className={`${isStaffList ? "rotate-135" : "rotate-0"}`}
                />
                Add Admin
              </button>
              {isStaffList && (
                <div
                  ref={dropdownRef}
                  className="bg-white w-[310px] max-h-[440px] px-4 py-3 rounded-xl shadow-lg absolute top-full right-0 "
                >
                  <div className="main-container">
                    {/* searchbar  */}
                    <div className="flex items-center border border-gray-300 rounded-md px-2 mb-3">
                      <input
                        type="text"
                        placeholder="Search Staff Name"
                        className="w-full px-2 py-2 outline-none"
                        value={staffSearch}
                        onChange={(e) => setStaffSearch(e.target.value)}
                      />
                      <Search size={18} className="text-gray-600" />
                    </div>

                    {/* Staff list */}
                    <div className="space-y-2 max-h-[310px] overflow-y-auto">
                      {filteredStaff.length !== 0 ? (
                        filteredStaff.map((staff, index) => {
                          return (
                            <div
                              key={staff.id}
                              onClick={() => setSelectedStaff(staff._id)}
                              className={`flex items-center justify-between border border-gray-300 rounded-lg p-2 cursor-pointer transition ${selectedStaff === staff.id
                                ? "bg-blue-50 border-blue-500"
                                : ""
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src="https://randomuser.me/api/portraits/men/32.jpg"
                                  alt={staff.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <p className="text-gray-800 font-medium">
                                  <span>{staff.salutation}</span>{" "}
                                  {staff.firstName}
                                </p>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedStaff === staff._id
                                  ? "border-blue-600"
                                  : "border-gray-400"
                                  }`}
                              >
                                {selectedStaff === staff._id && (
                                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="mt-4 text-center">
                          <img src={noData} className="w-[160px] m-auto " />
                          <h1 className="text-gray-600 mt-4 text-md">
                            No data found..
                          </h1>
                        </div>
                      )}
                    </div>
                    <div className="button-container mt-2 w-full flex gap-4 items-center justify-end">
                      <button onClick={() => setIsStaffList(!isStaffList)} className="bg-gray-100 px-3 py-2 text-sm rounded font-medium">
                        Cancel
                      </button>
                      <button onClick={() => { handleStaffUpdate() }} className="bg-[#0B56A4] px-3 py-2 text-sm rounded text-white font-medium">
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="mt-6 grid grid-cols-12 gap-4 h-[calc(100vh-240px)]">
          {/* Semester List */}
          <div className="col-span-3 border border-gray-300 bg-[#fbfbfbf5] rounded-lg">
            {(semesterType === "odd" ? oddSemesters : evenSemesters).map(
              (sem) => (
                <div
                  key={sem}
                  className="mt-8 flex items-center justify-center"
                >
                  <button
                    onClick={() => setSelectedSemester(sem)}
                    className={`flex items-center justify-between px-4 text-lg rounded-lg gap-2 py-3 border border-gray-300 w-[200px] transition-all
                    ${selectedSemester === sem
                        ? "bg-[#0B56A4] text-white"
                        : "bg-white text-gray-800 hover:bg-gray-100"
                      }`}
                  >
                    Semester {sem} <ChevronRight />
                  </button>
                </div>
              )
            )}
          </div>

          {/* Subject Type */}
          <div className="col-span-3 border border-gray-300 bg-[#fbfbfbf5] rounded-lg">
            <div className="mt-8 px-4">
              <button
                onClick={() => setSelectedType("Theory")}
                className={`flex items-center justify-between px-4 text-lg rounded-lg gap-2 py-3 border border-gray-300 w-[200px] transition-all
                ${selectedType === "Theory"
                    ? "bg-[#0B56A4] text-white"
                    : "bg-white text-gray-800 hover:bg-blue-100"
                  }`}
              >
                Theory <ChevronRight />
              </button>

              <button
                onClick={() => setSelectedType("Lab")}
                className={`flex items-center justify-between px-4 text-lg rounded-lg gap-2 py-3 border border-gray-300 w-[200px] mt-4 transition-all
                ${selectedType === "Lab"
                    ? "bg-[#0B56A4] text-white"
                    : "bg-white text-gray-800 hover:bg-blue-100"
                  }`}
              >
                Lab <ChevronRight />
              </button>
            </div>
          </div>

          {/* Subject List */}
          <div className="col-span-6 border border-gray-300 px-6 bg-[#fbfbfbf5] rounded-lg">
            <div className="main-container mt-8">
              <input
                type="text"
                placeholder="Search Subject and code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border bg-white border-gray-300 rounded px-3 py-2 mb-4 outline-none"
              />

              <div className="max-h-[300px] overflow-y-auto space-y-2 ">
                {filteredSubjects.length !== 0 ? (
                  filteredSubjects.map((sub) => {
                    return (
                      <label
                        key={sub.code}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubjects.some(
                            (s) => s.code === sub.code
                          )}
                          onChange={() => handleSubjectToggle(sub)}
                          className="accent-[#0b55a3]"
                        />

                        <span className="text-gray-800">
                          {sub.code} - {sub.subject}
                        </span>
                      </label>
                    );
                  })
                ) : (
                  <div className="mt-4 text-center">
                    <img src={noData} className="w-[60%] h-[200px] m-auto " />
                    <h1 className="text-gray-600 mt-4 text-md">
                      No data found..
                    </h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-4 mt-4 ">
          <button className="px-4 py-2 border rounded text-gray-900 bg-gray-100 border-gray-400 cursor-pointer">
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#0B56A4] text-white rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </section>
    </>
  );
};

export default AddSubjectComponent;
