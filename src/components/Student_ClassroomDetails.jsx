import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import ClassroomHeader from "./Student_ClassroomHeader";

import ClassRoomStreamComponent from "./Student_ClassRoomStreamComponent";
import ClassRoomClassworkComponent from "./Student_ClassRoomClassworkComponent";
import ClassroompeopleContainer from "./Student_ClassRoomPeopleContainer";

const ClassroomDetails = () => {
  const [activeItem, setActiveItem] = useState("Stream");

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <ClassroomHeader activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="px-8 py-4">
        <div className="mb-6">
          <h1 className="flex items-center text-gray-800 text-lg">
            Class
            <span>
              <ChevronRight className="w-5 h-5 text-gray-400 mx-1" />
            </span>
            <span className="text-[#0B56A4] font-medium">
              III_CSE_A - Crypto and Encryption
            </span>
          </h1>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          {activeItem === "Stream" && <ClassRoomStreamComponent />}
          {activeItem === "Classwork" && <ClassRoomClassworkComponent />}
          {activeItem === "Peoples" && <ClassroompeopleContainer />}
          {activeItem === "Grades" && (
            <div className="py-20 text-center text-gray-400 font-medium">
              Grades Content Displayed Here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetails;
