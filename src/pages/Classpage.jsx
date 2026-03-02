import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ClassroomHeader from "../components/ClassroomHeader";
import HeaderComponent from "../components/HeaderComponent";
import ClassRoomStreamComponent from "../components/ClassRoomStreamComponent";
import ClassRoomClassworkComponent from "../components/ClassRoomClassworkComponent";
import ClassroompeopleContainer from "../components/ClassroompeopleContainer";
import ClassroomSubjectPlanningComponent from "../components/ClassroomSubjectPlanningComponent";
import ClassroomAttendanceComponent from "../components/ClassroomAttendanceComponent";
import axios from "axios";

const Classpage = () => {
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { classId, sectionId } = useParams();
  const [activeTab, setActiveTab] = useState("stream");
  const [streamData, setStreamData] = useState({});

  useEffect(() => {
    getStreamDetails();
  }, []);

  async function getStreamDetails() {
    try {
      const res = await axios.get(
        `${apiUrl}api/staff/stream/${classId}/${sectionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setStreamData(res.data);
    } catch (err) {
      console.error(
        "Error occured while fetching Classroom stream details : ",
        err.message,
      );
    }
  }

  return (
    <>
      <section className="w-full h-screen flex">
        <div className="hidden md:block w-[20%]">
          <Sidebar />
        </div>
        <div className="container-2 w-full md:w-[80%] h-[100%]">
          <HeaderComponent
            title="Classroom"
            second={streamData?.subjectName}
            secondColor="text-[#0B56A4]"
          />

          <ClassroomHeader activeTab={activeTab} setActiveTab={setActiveTab} />

          <section className="main-section mx-6 py-2 h-[calc(100vh-150px)] flex gap-4 ">
            <div className="component-container w-full">
              {activeTab === "stream" && (
                <ClassRoomStreamComponent activeTab={activeTab} />
              )}
              {activeTab === "classwork" && (
                <ClassRoomClassworkComponent activeTab={activeTab} />
              )}
              {activeTab === "people" && (
                <ClassroompeopleContainer activeTab={activeTab} />
              )}
              {activeTab === "subjectPlanning" && (
                <ClassroomSubjectPlanningComponent
                  activeTab={activeTab}
                  subjectId={classId}
                />
              )}
              {activeTab === "attendance" && (
                <ClassroomAttendanceComponent
                  streamData={streamData}
                  subjectId={classId}
                />
              )}

            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default Classpage;
