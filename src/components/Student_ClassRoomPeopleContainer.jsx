import React, { useState } from "react";
import profileImg from "../assets/profileImg.svg";

const teachersList = [
  { name: "Surya Chandran" },
  { name: "Surya Chandran" },
  { name: "Surya Chandran" },
  { name: "Surya Chandran" },
  { name: "Surya Chandran" },
];
const studentsList = [
  { name: "Chandran" },
  { name: "Chandran" },
  { name: "Chandran" },
  { name: "Chandran" },
  { name: "Chandran" },
];

const Student_ClassroomPeopleContainer = () => {
  const [selectedTab, setSelectedTab] = useState("Teachers");

  const currentList = selectedTab === "Teachers" ? teachersList : studentsList;

  return (
    <section className="w-full p-6 h-full border border-[#DBDBDB] rounded-lg bg-white">
      <div className="tab-container px-4 py-2 flex items-center gap-2 bg-[#E6E9F5] rounded-full max-w-md mx-auto">
        <button
          onClick={() => setSelectedTab("Teachers")}
          className={`w-1/2 py-2 px-3 cursor-pointer rounded-full transition-all duration-200 ${selectedTab === "Teachers" ? "bg-[#0B56A4] text-white shadow-md" : "text-gray-600 hover:text-black"}`}
        >
          Teachers
        </button>
        <button
          onClick={() => setSelectedTab("Students")}
          className={`w-1/2 py-2 cursor-pointer px-3 rounded-full transition-all duration-200 ${selectedTab === "Students" ? "bg-[#0B56A4] text-white shadow-md" : "text-gray-600 hover:text-black"}`}
        >
          Classmates
        </button>
      </div>
      <header className="mt-8 mb-4 border-b border-[#0B56A4] pb-2">
        <h1 className="font-medium text-xl text-[#282526]">
          {selectedTab === "Teachers" ? "Faculties" : "Classmates"}
          <span className="ml-2 text-[#0B56A4]">({currentList.length})</span>
        </h1>
      </header>

      <div className="people-list w-full max-h-[calc(100vh-320px)] overflow-y-auto pr-2 custom-scrollbar">
        {currentList.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 px-2 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profileImg}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <p className="text-md font-medium text-gray-800">{item.name}</p>
            </div>

            <div className="text-gray-400 text-xl font-medium cursor-pointer hover:text-gray-700 p-2">
              &#8942;
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Student_ClassroomPeopleContainer;
