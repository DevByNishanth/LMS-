import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderComponent from "../components/HeaderComponent";
import HodSubjectDetailsComponent from "../components/HodSubjectDetailsComponent";
import { jwtDecode } from "jwt-decode";

const HodSubjectmanagementpage = () => {
  const [dept, setDept] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("LmsToken");
    if (token) {
      const decoded = jwtDecode(token);
      const department =
        decoded?.department
      setDept(department);
    }
  })
  return (
    <>
      <section className="w-[100%] h-[100vh] flex">
        <div className="container-1 hidden md:block w-[20%] h-[100%]">
          <Sidebar />
        </div>
        <div className="container-2 w-[100%] md:w-[80%]   h-[100%]">
          <HeaderComponent
            title={"Staff Allocation"}
            secondColor="text-blue-700"
            second={dept}
          />
          {/* --------------- hod subject details and faculty allocation table -----------  */}
          <div className="mx-6 ">
            <HodSubjectDetailsComponent />
          </div>
        </div>
      </section>
    </>
  );
};

export default HodSubjectmanagementpage;
