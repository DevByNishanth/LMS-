import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ClassroomHeader from "../components/ClassroomHeader";
import { ChevronRight } from "lucide-react";
import classWorkIcon from "../assets/classWorkIcon.svg";
import peopleIcon from "../assets/peopleIcon.svg";
import gradeIcon from "../assets/gradesIcon.svg";
import activeSteamIcon from "../assets/activeSteamIcon.svg";
import ClassRoomStreamComponent from "../components/ClassRoomStreamComponent";
import ClassRoomClassworkComponent from "../components/ClassRoomClassworkComponent";
import ClassroompeopleContainer from "../components/ClassroompeopleContainer";
import notificationIcon from "../assets/notification.svg";
import { jwtDecode } from "jwt-decode";

const Classpage = () => {
  const [activeTab, setActiveTab] = useState("stream");
  // const [activeItem, setActiveItem] = useState('Stream');
  const [firstLetter, setFirstLetter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("LmsToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name =
          decoded?.name || decoded?.username || decoded?.user?.name || "";

        if (name) {
          setFirstLetter(name.charAt(0).toUpperCase());
        }
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  return (
    <>
      <section className="w-full h-screen flex">
        <div className="hidden md:block w-[20%]">
          <Sidebar />
        </div>
        <div className="container-2 w-full md:w-[80%] h-[100%]">
          {/* Breadcrumbs   */}
          <div className="main-content-container p-6 flex items-center justify-between">
            <div className="breadcrumsb-container">
              <h1 className="flex items-center ">
                Class{" "}
                <span>
                  <ChevronRight className="w-6 h-6" />
                </span>{" "}
                <span className="text-[#0B56A4] font-medium">
                  |||_CSE _ A - Crypto and Encryption{" "}
                </span>
              </h1>
            </div>
            {/* Right - Icons */}
            <div className="flex items-center gap-3">
              {/* Notification Icon */}
              <div className="p-2 rounded-full bg-gray-50 shadow-sm hover:shadow-md transition">
                <img src={notificationIcon} className="w-4 h-4" />
              </div>

              {/* Profile Image */}
              <div className="w-8 h-8 rounded-full bg-[#0B56A4] text-white flex items-center justify-center font-semibold shadow-sm">
                {firstLetter}
              </div>
            </div>
          </div>
          <ClassroomHeader activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* body section  */}

          <section className="main-section mx-6 py-2 h-[calc(100vh-150px)] flex gap-4 ">
            <div className="component-container w-full">
              {activeTab === "stream" && (
                <ClassRoomStreamComponent activeTab={activeTab} />
              )}
              {activeTab == "classwork" && (
                <ClassRoomClassworkComponent activeTab={activeTab} />
              )}
              {activeTab == "people" && (
                <ClassroompeopleContainer activeTab={activeTab} />
              )}
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default Classpage;
