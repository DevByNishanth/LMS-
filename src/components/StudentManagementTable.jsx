import React, { useEffect, useState, useRef } from "react";
import { Search, Plus, Eye, Pencil, Trash2, Download } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deletedata, setDeleteData] = useState(null);
  const [isDetailCanvas, setIsDetailCanvas] = useState(false);
  const [canvasData, setCanvasData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const tableRef = useRef(null);

  function handleSearch() {
    let filteredData = students;

    // Apply text search across name, email, and register number
    if (search !== "") {
      const query = search.toLowerCase();
      filteredData = filteredData.filter((item) => {
        const firstName = item.firstName ? String(item.firstName).toLowerCase() : "";
        const email = item.email ? String(item.email).toLowerCase() : "";
        const registerNumber = item.registerNumber ? String(item.registerNumber).toLowerCase() : "";
        return firstName.includes(query) || email.includes(query) || registerNumber.includes(query);
      });
    }

    // Apply department filter
    if (selectedDepartment !== "") {
      filteredData = filteredData.filter(
        (item) => item.department === selectedDepartment
      );
    }

    // Apply section filter
    if (selectedSection !== "") {
      filteredData = filteredData.filter(
        (item) => item.section === selectedSection
      );
    }

    // Apply year filter
    if (selectedYear !== "") {
      filteredData = filteredData.filter((item) => item.year === selectedYear);
    }

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
  }, [search, selectedDepartment, selectedSection, selectedYear]);

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

  const handlePrintPDF = () => {
    if (!tableRef.current) return;

    const printWindow = window.open("", "", "height=600,width=800");
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Details Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #08384F; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th { background-color: #08384F; color: white; padding: 10px; text-align: left; border: 1px solid #333; }
            td { padding: 8px; border: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            tr:hover { background-color: #f0f0f0; }
            .hide-on-print { display: none !important; }
          </style>
        </head>
        <body>
          <h1>Student Details Report</h1>
          ${tableRef.current.outerHTML}
          <script>
            window.print();
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

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
    <div className="bg-white px-2 mt-3 pb-4 rounded-xl shadow-sm border border-gray-300 mx-6 h-[calc(100vh-345px)]">
      <div className="flex gap-4 items-center mt-3  mb-4">
        {/* <h2 className="text-lg font-medium text-[#282526]">Student Details</h2> */}

        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex items-center  px-3 py-2 rounded-lg border border-gray-400 focus-within:border-[#0B56A4]">
            <input
              type="text"
              placeholder="Search by name, email or register number..."
              className="bg-transparent outline-none w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} className="text-gray-500" />
          </div>

          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="appearance-none px-3 py-2 pr-10 rounded-lg border border-gray-400 text-sm outline-none bg-white cursor-pointer focus:border-[#0B56A4]"
            >
              <option value="">Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="MECH">MECH</option>
              <option value="ECE">ECE</option>
              <option value="CIVIL">CIVIL</option>
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

          <div className="relative">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="appearance-none px-3 py-2 pr-10 rounded-lg border border-gray-400 text-sm outline-none bg-white cursor-pointer focus:border-[#0B56A4]"
            >
              <option value="">Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
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

          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none px-3 py-2 pr-10 rounded-lg border border-gray-400 text-sm outline-none bg-white cursor-pointer focus:border-[#0B56A4]"
            >
              <option value="">Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
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

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 bg-[#08384F] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#0b3a53] transition-colors"
          >
            <Download size={18} /> Download
          </button>

          <button
            onClick={() => {
              setIsEdit(false);
              setEditData(null);
              setIsModal(true);
            }}
            className="flex items-center gap-2 bg-[#08384F] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#0b3a53] transition-colors"
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border max-h-[calc(100vh-420px)] border-gray-400">
        <table className="w-full" ref={tableRef}>
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
              <th className="py-3 px-4 text-center whitespace-nowrap hide-on-print">
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
                  className={`text-sm hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } border-b border-gray-100`}
                >
                  <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-700">
                    {item.registerNumber}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                    {item.firstName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                    {item.year}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                    {item.department}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                    {item.section}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                    {item.email}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                    {item.mobileNumber}
                  </td>
                  <td className="py-3 px-4 hide-on-print">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setCanvasData(item);
                          setIsDetailCanvas(true);
                        }}
                        className="bg-blue-500 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer hover:bg-blue-600 hover:scale-110 transition-all shadow-sm"
                      >
                        <Eye size={16} className="text-white" />
                      </button>
                      <button
                        onClick={() => {
                          setIsEdit(true);
                          setEditData(item);
                          setIsModal(true);
                        }}
                        className="bg-emerald-500 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer hover:bg-emerald-600 hover:scale-110 transition-all shadow-sm"
                      >
                        <Pencil size={16} className="text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="bg-rose-500 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer hover:bg-rose-600 hover:scale-110 transition-all shadow-sm"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-10">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={noData}
                      className="w-48 mb-4 opacity-80"
                      alt="No data"
                    />
                    <h1 className="text-gray-500 font-medium">
                      No data found!
                    </h1>
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
