import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import noData from "../assets/noData.svg";
import AddFacultyCanvas from "./AddFacultyCanvas";
import axios from "axios";
import DetailViewCanvas from "./DetailViewCanvas";
import DeleteModal from "./DeleteModal";

const FacultyTable = () => {
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("firstName");
  const [isCanvas, setIsCanvas] = useState(false);
  const [isDetailCanvas, setIsDetailCanvas] = useState(false);
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canvasData, setCanvasData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const searchOptions = [
    { value: "firstName", label: "Name" },
    { value: "employeeId", label: "Emp ID" },
    { value: "designation", label: "Designation" },
    { value: "department", label: "Department" },
    { value: "email", label: "Email" },
  ];

  const selectedLabel =
    searchOptions.find((opt) => opt.value === searchCategory)?.label || "Name";

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, searchCategory, data]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}api/faculty`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Faculty Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm === "") {
      setFiltered(data);
      return;
    }
    const query = searchTerm.toLowerCase();
    const filteredData = data.filter((item) => {
      const valueToSearch = item[searchCategory]
        ? String(item[searchCategory]).toLowerCase()
        : "";
      return valueToSearch.includes(query);
    });
    setFiltered(filteredData);
  };

  const ShimmerRow = () => (
    <tr className="animate-pulse border-b border-gray-200">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="mx-6 bg-white border border-gray-300 rounded-xl p-5 shadow-sm h-[calc(100vh-300px)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#282526]">Faculty Details</h2>

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="text-gray-500" />
          </div>

          <button
            onClick={() => {
              setIsEdit(false);
              setEditData(null);
              setIsCanvas(true);
            }}
            className="flex items-center gap-2 bg-[#08384F]  bgtext-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#094685] transition-colors font-medium text-sm"
          >
            <Plus size={18} /> Add Faculty
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border max-h-[calc(100vh-390px)] border-gray-400">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#08384F]  bg  text-white text-sm">
              <th className="py-3 px-4 text-left whitespace-nowrap">Emp ID</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">
                Emp Name
              </th>
              <th className="py-3 px-4 text-left whitespace-nowrap">
                Designation
              </th>
              <th className="py-3 px-4 text-left whitespace-nowrap">
                Department
              </th>
              <th className="py-3 px-4 text-left whitespace-nowrap">
                Email ID
              </th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Phone</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <>
                {[...Array(10)].map((_, i) => (
                  <ShimmerRow key={i} />
                ))}
              </>
            ) : filtered.length !== 0 ? (
              filtered.map((item, index) => (
                <tr
                  key={index}
                  className={`text-sm hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-b border-gray-200`}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.employeeId}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.firstName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.designation}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.department}
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
                          setIsCanvas(true);
                        }}
                        className="bg-[#22DE6F] w-8 h-8 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Pencil size={18} className="text-white" />
                      </div>
                      <div
                        onClick={() => {
                          setDeleteId(item._id);
                          setIsDelete(true);
                        }}
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
                <td colSpan="7" className="py-10">
                  <div className="flex flex-col items-center justify-center">
                    <img src={noData} className="w-48 mb-4" alt="No data" />
                    <h1 className="text-gray-500 font-medium">
                      No records found!
                    </h1>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isCanvas && (
        <AddFacultyCanvas
          setIsCanvas={setIsCanvas}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          editData={editData}
          getData={getData}
        />
      )}
      {isDetailCanvas && (
        <DetailViewCanvas
          setIsDetailCanvas={setIsDetailCanvas}
          canvasData={canvasData}
        />
      )}
      {isDelete && (
        <DeleteModal
          setIsDelete={setIsDelete}
          deleteId={deleteId}
          getData={getData}
        />
      )}
    </div>
  );
};

export default FacultyTable;
