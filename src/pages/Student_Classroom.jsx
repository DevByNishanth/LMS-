import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import folderIcon from "../assets/folderIcon.svg";
import archiveIcon from "../assets/archiveIcon.svg";
import { Link } from "react-router-dom";
import noDatafoundImg from "../assets/noDatafoundImg.svg";
import axios from "axios";
import banner1 from "../assets/banner1.svg";
import banner2 from "../assets/banner2.svg";
import banner3 from "../assets/banner3.svg";

const classroomImages = [banner1, banner2, banner3];

const getRandomImage = (index) => {
  return classroomImages[index % classroomImages.length];
};

const StudentClassroom = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState([
    {
      _id: "1",
      className: "III_CSE_A",
      subjectName: "Crypto and Encryption",
      staffName: "Surya Chandran",
    },
    {
      _id: "2",
      className: "III_CSE_B",
      subjectName: "Data Science and Security",
      staffName: "Rajesh Kumar",
    },
    {
      _id: "3",
      className: "IV_CSE_A",
      subjectName: "Digital Signal Processing",
      staffName: "Anitha Sharma",
    },
  ]);

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    try {
      const response = await axios.get(`${apiUrl}api/student/classroom`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("LmsToken")}`,
        },
      });
      const data = await response.data.data;
      if (data && data.length > 0) {
        setClasses(data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  }

  // Filter logic: Checks if search query matches Subject Name or Class Name
  const filteredClasses = classes.filter(
    (cls) =>
      cls.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.className.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="px-6">
      {/* Search Bar - only shows if there are classes at all */}
      {classes.length > 0 && (
        <div className="mt-2 flex items-center justify-between mb-4">
          <div className="searchbar-container border border-[#D9D9D9] bg-white rounded-lg flex items-center gap-2 px-2">
            <input
              type="text"
              placeholder="Search Subject and class"
              className="w-80 px-4 py-2 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="text-gray-400" />
          </div>
        </div>
      )}

      <div
        className={`${
          filteredClasses.length > 0 ? "grid" : ""
        } grid-cols-1 md:grid-cols-2 gap-8 max-h-[calc(100vh-160px)] overflow-y-auto pr-2 pb-6`}
      >
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls, index) => {
            return (
              <Link
                to={`/student/classroom/${cls._id}`}
                key={cls._id}
                className="rounded-lg cursor-pointer rounded-t-xl bg-white border border-gray-200 hover:shadow-lg transition h-fit"
              >
                <div className="relative">
                  <div className="background-img relative">
                    <img
                      src={getRandomImage(index)}
                      className="h-40 rounded-t-xl object-cover w-full"
                      alt="banner"
                    />
                    <div className="absolute top-0 rounded-t-xl right-0 bottom-0 left-0 bg-black/20"></div>
                  </div>
                  <div className="text-container text-white absolute top-[20%] left-[4%]">
                    <p className="text-sm font-medium">{cls.className}</p>
                    <h2 className="text-2xl font-semibold mt-1">
                      {cls.subjectName}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${cls.staffName}&background=D9EBFE&color=0B56A4&bold=true`}
                      alt="teacher"
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                    <p className="text-lg font-medium text-gray-700">
                      {cls.staffName}
                    </p>
                  </div>

                  <div className="flex gap-4 text-gray-500">
                    <button className="hover:opacity-70 transition">
                      <img
                        src={archiveIcon}
                        className="w-7 h-7"
                        alt="archive"
                      />
                    </button>
                    <button className="hover:opacity-70 transition">
                      <img src={folderIcon} className="w-7 h-7" alt="folder" />
                    </button>
                    <button className="hover:opacity-70 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="black"
                        className="bi bi-three-dots-vertical"
                        viewBox="0 0 16 16"
                      >
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          /* Empty state for both "No classes assigned" and "No search results" */
          <div className="w-full flex items-center justify-center col-span-2">
            <div className="m-auto w-[400px] text-center p-6">
              <img
                src={noDatafoundImg}
                className="w-[400px] h-[370px]"
                alt="No data"
              />
              <div className="content-container mt-[-20px]">
                <h1 className="mt-[-10px] text-[#0B56A4] font-medium text-xl">
                  {searchQuery ? "No matches found!" : "No Classes Assigned!"}
                </h1>
                <p className="text-[#646464] text-sm mt-2">
                  {searchQuery
                    ? `We couldn't find anything for "${searchQuery}"`
                    : "You haven't been enrolled in any classes yet."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentClassroom;
