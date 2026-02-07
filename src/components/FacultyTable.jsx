import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import eye from "../assets/eyeIcon.svg";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import AddFacultyCanvas from "./AddFacultyCanvas";
import axios from "axios";
import DetailViewCanvas from "./DetailViewCanvas";
import DeleteModal from "./DeleteModal";
const data = [
  {
    id: "1010012023131",
    name: "Surya Chandran",
    designation: "Designer",
    department: "Quantum Pulse",
    email: "abc@gmail.com",
    phone: "102342232322",
  },
  {
    id: "1010012023132",
    name: "Ravi Kumar",
    designation: "Professor",
    department: "Astro Tech",
    email: "ravi@gmail.com",
    phone: "9876543210",
  },
  {
    id: "1010012023133",
    name: "Priya Sharma",
    designation: "Assistant Professor",
    department: "Quantum Pulse",
    email: "priya@gmail.com",
    phone: "9123456789",
  },
  {
    id: "1010012023133",
    name: "Priya Sharma",
    designation: "Assistant Professor",
    department: "Quantum Pulse",
    email: "priya@gmail.com",
    phone: "9123456789",
  },
  {
    id: "1010012023133",
    name: "Priya Sharma",
    designation: "Assistant Professor",
    department: "Quantum Pulse",
    email: "priya@gmail.com",
    phone: "9123456789",
  },
  {
    id: "1010012023133",
    name: "Priya Sharma",
    designation: "Assistant Professor",
    department: "Quantum Pulse",
    email: "priya@gmail.com",
    phone: "9123456789",
  },
];
const FacultyTable = () => {
  // Authorization
  const token = localStorage.getItem("LmsToken");

  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCanvas, setIsCanvas] = useState(false);
  const [isDetailCanvas, setIsDetailCanvas] = useState(false);
  const [data, setData] = useState([]);
  const [canvasData, setCanvasData] = useState({})
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  //   useEffect call's
  useEffect(() => {
    getData();
  }, []);

  //   functions
  const getData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL; // from .env file
    const response = await axios.get(`${apiUrl}api/faculty`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setData(response.data);
  };

  const filteredData = data.filter((item) => {
    const idStr = String(item.employeeId || "");
    return (
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idStr.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="mx-6  bg-white border border-gray-300 rounded-xl p-5 ">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Faculty Details</h2>

        {/* Search Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Faculty and ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-400 focus:border-none rounded-md text-md px-3 py-2  w-64 focus:outline-none focus:ring-2 focus:ring-black-600"
          />
          <button
            onClick={() => {
              setIsCanvas(true);
            }}
            className=" bg-[#0B56A4] text-white px-4 py-2 cursor-pointer rounded-lg text-md font-medium hover:bg-[#0b55a4f1] transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <Plus /> Add Faculty
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-auto h-[calc(100vh-390px)] border border-gray-300 rounded-t-lg">
        <table className="min-w-full border-collapse  rounded-lg ">
          <thead className="sticky top-0 ">
            <tr className="bg-[#08384F] font-normal  text-white text-left text-[13px]">
              <td className="py-3 px-4">Emp ID</td>
              <td className="py-2 px-4">Emp Name</td>
              <td className="py-2 px-4">Designation</td>
              <td className="py-2 px-4">Department</td>
              <td className="py-2 px-4">Email ID</td>
              <td className="py-2 px-4">Phone</td>
              <td className="py-2 px-4">Action</td>
            </tr>
          </thead>
          <tbody className="">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-b border-gray-200 text-[13px]`}
                >
                  <td className="py-3 px-4">{item.employeeId}</td>
                  <td className="py-3 px-4">{item.firstName}</td>
                  <td className="py-3 px-4">{item.designation}</td>
                  <td className="py-3 px-4">{item.department}</td>
                  <td className="py-3 px-4">{item.email}</td>
                  <td className="py-3 px-4">{item.mobileNumber}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => { setCanvasData(item); setIsDetailCanvas(true) }}
                      className="bg-[#0567CE] cursor-pointer hover:bg-[#0567CE] text-white w-8 h-8 flex items-center justify-center rounded-full"
                    >
                      <img src={eye} alt="" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setEditData(item);
                        setIsCanvas(true);
                      }}
                      className="bg-[#22DE6F] cursor-pointer text-white w-8 h-8 flex items-center justify-center rounded-full"
                    >
                      <img src={editIcon} alt="" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(item._id);
                        setIsDelete(true);
                      }}
                      className="bg-[#F24343] cursor-pointer text-white w-8 h-8 flex items-center justify-center rounded-full"
                    >
                      <img src={deleteIcon} alt="" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-4 text-sm"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isCanvas && <AddFacultyCanvas setIsCanvas={setIsCanvas} isEdit={isEdit} setIsEdit={setIsEdit} editData={editData} getData={getData} />}
      {isDetailCanvas && (
        <DetailViewCanvas setIsDetailCanvas={setIsDetailCanvas} canvasData={canvasData} />
      )}
      {isDelete && (
        <DeleteModal setIsDelete={setIsDelete} deleteId={deleteId} />
      )}
    </div>
  );
};

export default FacultyTable;
