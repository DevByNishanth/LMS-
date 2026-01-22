import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderComponent from "../components/HeaderComponent";
import { useLocation } from "react-router-dom";
import AddSubjectComponent from "../components/AddSubjectComponent";
import axios from "axios";

const AddSubjectPage = () => {
  // Auth
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");

  // url's
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const dept = params.get("dept");
  const department =
    dept.match(/\(([^)]+)\)/)?.[1].replace(/\s+/g, "") ||
    dept.replace(/\s+/g, "");

  //   states
  const [data, setData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);

  // useEffect calls

  useEffect(() => {
    getData();
  }, []);
  //   functions

  // api call's
  const getData = async () => {
    try {
      const response = await axios.get(`${apiUrl}api/subjects/${department}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubjectData(response.data.subjects);
      setFacultyData(response.data.faculty);
    } catch (err) {
      console.error("Error occured while geting subject : ", err);
    }
  };

  return (
    <>
      <section className="w-[100%] h-[100vh] flex">
        <div className="container-1 w-[20%] h-[100%]">
          <Sidebar />
        </div>
        {/* content section -----------------------------------  */}
        <div className="container-2 w-[80%] h-[100%]">
          <HeaderComponent
            title={"Subject Management"}
            second={dept}
            secondColor="text-blue-700"
          />
          <div className="content-container mx-6">
            <AddSubjectComponent
              facultyData={facultyData}
              subjectData={subjectData}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default AddSubjectPage;
