import React, { useEffect, useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import noData from "../assets/noData.svg";
import AddStudentCanvas from "./AddStudentCanvas";
import StudentDetailViewCanvas from "./StudentDetailViewCanvas";
import axios from "axios";
import StudentDeleteModal from "./StudentDeleteModal";

const StudentManagementTable = () => {
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState("firstName");
  const [loading, setLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deletedata, setDeleteData] = useState(null);
  const [isDetailCanvas, setIsDetailCanvas] = useState(false);
  const [canvasData, setCanvasData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const searchOptions = [
    { value: "firstName", label: "Name" },
    { value: "registerNumber", label: "Register No" },
    { value: "department", label: "Department" },
    { value: "section", label: "Section" },
    { value: "email", label: "Email" },
  ];

  const selectedLabel =
    searchOptions.find((opt) => opt.value === searchCategory)?.label || "Name";

  function handleSearch() {
    if (search === "") {
      setFiltered(students);
      return;
    }

    const query = search.toLowerCase();

    const filteredData = students.filter((item) => {
      const valueToSearch = item[searchCategory]
        ? String(item[searchCategory]).toLowerCase()
        : "";
      return valueToSearch.includes(query);
    });

    setFiltered(filteredData);
  }

  useEffect(() => {
    setFiltered(students);
  }, [students]);

  useEffect(() => {
    handleApicall();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, searchCategory]);

  function onClose() {
    setIsModal(false);
  }

  async function handleApicall() {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}api/students/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(item) {
    setDeleteData(item);
    setIsDeleteModal(true);
  }

  const ShimmerRow = () => (
    <tr className="animate-pulse border-b border-gray-200">
      {[...Array(8)].map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="bg-white px-6 mt-3 pb-4 rounded-xl shadow-sm border border-gray-300 mx-6 h-[calc(100vh-300px)]">
      <div className="flex justify-between mt-3 items-center mb-4">
        <h2 className="text-lg font-medium text-[#282526]">Student Details</h2>

        <div className="flex gap-3 items-center">
          <div className="relative">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="appearance-none px-3 py-2 pr-10 rounded-lg border border-gray-400 text-sm outline-none bg-white cursor-pointer focus:border-[#0B56A4]"
            >
              {searchOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center w-72 px-3 py-2 rounded-lg border border-gray-400 focus-within:border-[#0B56A4]">
            <input
              type="text"
              placeholder={`Search by ${selectedLabel}...`}
              className="bg-transparent outline-none w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} className="text-gray-500" />
          </div>

          <button
            onClick={() => {
              setIsEdit(false);
              setEditData(null);
              setIsModal(true);
            }}
            className="flex items-center gap-2 bg-[#0B56A4] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#094685] transition-colors"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border max-h-[calc(100vh-380px)] border-gray-400">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#08384F] text-white text-sm">
              <th className="py-3 px-4 text-left whitespace-nowrap">ID</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Name</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Year</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">
                Department
              </th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Section</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Email</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Phone</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <>
                <ShimmerRow />
                <ShimmerRow />
                <ShimmerRow />
                <ShimmerRow />
                <ShimmerRow />
                <ShimmerRow />
                <ShimmerRow />
                <ShimmerRow />
                <ShimmerRow />
                <ShimmerRow />
                <ShimmerRow />
              </>
            ) : filtered.length !== 0 ? (
              filtered.map((item, index) => (
                <tr
                  key={index}
                  className={`text-sm hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  }`}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.registerNumber}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.firstName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{item.year}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.department}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.section}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{item.email}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.mobileNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-4">
                      <div
                        onClick={() => {
                          setCanvasData(item);
                          setIsDetailCanvas(true);
                        }}
                        className="bg-[#0567CE] w-8 h-8 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Eye size={18} className="text-white" />
                      </div>
                      <div
                        onClick={() => {
                          setIsEdit(true);
                          setEditData(item);
                          setIsModal(true);
                        }}
                        className="bg-[#22DE6F] w-8 h-8 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Pencil size={18} className="text-white" />
                      </div>
                      <div
                        onClick={() => handleDelete(item)}
                        className="bg-[#F24343] w-8 h-8 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Trash2 size={18} className="text-white" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-10">
                  <div className="flex flex-col items-center justify-center">
                    <img src={noData} className="w-48 mb-4" alt="No data" />
                    <h1 className="text-gray-500">No data found!</h1>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModal && (
        <AddStudentCanvas
          onClose={onClose}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          editData={editData}
          handleApicall={handleApicall}
        />
      )}
      {isDetailCanvas && (
        <StudentDetailViewCanvas
          setIsDetailCanvas={setIsDetailCanvas}
          canvasData={canvasData}
        />
      )}
      {isDeleteModal && (
        <StudentDeleteModal
          setDeleteData={setDeleteData}
          setIsDeleteModal={setIsDeleteModal}
          deletedata={deletedata}
        />
      )}
    </div>
  );
};

export default StudentManagementTable;
