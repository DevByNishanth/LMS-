import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderComponent from "../components/HeaderComponent";
import FacultyManagementStatCard from "../components/FacultyManagementStatCard";
import TitanicPie from "../components/TitanicPie";
import { ChevronDown } from "lucide-react";
import FacultyTable from "../components/FacultyTable";
import axios from "axios";
import PieChartWithCustomizedLabel from "../components/PieChartWithCustomizedLabel";
const departments = ["CSE", "ECE", "EEE", "IT", "MECH", "OFFICE"];
const FacultyManagementPage = () => {
  // Auth
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");

  //  states
  const [department, setDepartment] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("ECE");
  const [chartData, setChartData] = useState([]);

  const [loading, setLoading] = useState(true);

  // functions

  // Handle department change
  const handleDepartment = (dept) => {
    setSelectedDepartment(dept);
    setDepartment(false);
    fetchDepartmentData(dept);
  };

  const fetchDepartmentData = async (dept) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${apiUrl}api/faculty/department-wise/${dept}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const formattedData = res.data.map((item) => ({
        name: item.Designation,
        value: item.Count,
      }));
      setChartData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching department data:", error);
      setLoading(false);
    }
  };

  // useEffect call's

  // Initial load — fetch ECE department data
  useEffect(() => {
    fetchDepartmentData("ECE");
  }, []);

  useEffect(() => {
    async function getData() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const departmentFilter = await axios.get(
        `${apiUrl}api/faculty/department-wise/ECE`
      );
    }
    getData();
  }, []);

  return (
    <>
      <section className="w-[100%] h-[100vh] flex">
        <div className="container-1 w-[20%] h-[100%]">
          <Sidebar />
        </div>
        <div className="container-2 w-[80%] h-[100%]">
          <HeaderComponent title={"Faculty Management"} />
          {/* header container ------------------------------------------------------  */}
          <div className="header-container px-6 flex gap-4">
            <div className="container-1 w-[50%]">
              <FacultyManagementStatCard />
            </div>
            <div className="container-1 w-[50%] border border-gray-300 rounded-lg p-2">
              <div className="header w-[90%] m-auto mb-2 flex items-center justify-between">
                <h1 className="font-medium text-[#282526] text-md ">
                  Department wise Faculties{" "}
                </h1>
                <div className="dropdwon-container relative  border gap-2  w-[100px] border-gray-300 rounded-lg ">
                  <button
                    onClick={() => {
                      setDepartment(!department);
                    }}
                    className="font-medium text-md flex justify-between items-center w-[100%] px-3 py-2"
                  >
                    {selectedDepartment}
                    <span>
                      <ChevronDown
                        className={`${
                          department ? "rotate-180" : ""
                        } transition-all duration-300 `}
                      />
                    </span>
                  </button>
                  {department && (
                    <div className="dropdown rounded-lg absolute top-full right-0 bg-white w-[160%] shadow-xl shadow-gray-400">
                      {departments.map((item, index) => {
                        return (
                          <button
                            onClick={() => {
                              handleDepartment(item);
                            }}
                            key={index}
                            className="w-full px-2 py-2 text-left hover:bg-gray-100"
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              {/* <TitanicPie /> */}
              <PieChartWithCustomizedLabel chartData={chartData} />
            </div>
          </div>
          {/* table-container -----------------------------------------  */}
          <div className="table-container mt-4">
            <FacultyTable />
          </div>
        </div>
      </section>
    </>
  );
};

export default FacultyManagementPage;
