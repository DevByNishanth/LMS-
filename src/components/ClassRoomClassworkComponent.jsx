import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import noDataImg from "../assets/noData.svg";
import {
  BookOpenIcon,
  ChevronDown,
  ClipboardCheck,
  FileQuestionMark,
  FileText,
  Plus,
  Search,
} from "lucide-react";
import assignmentWorkIcon from "../assets/assignmentWorkIcon.svg";
import AddAssignmentModal from "./AddAssignmentModal";
import QuizAssignmentCanvas from "./QuizAssignmentCanvas";
import QuestionAssignmentCanvas from "./QuestionAssignmentCanvas";


// const classWorkData1 = [];


const ClassRoomClassworkComponent = () => {
  // states
  const { classId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [isDropdown, setIsDropdown] = useState(false);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [quizAssignmentModalOpen, setIsQuizAssignmentModalOpen] =
    useState(false);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // refs
  const dropdownRef = useRef(null);

  // useEffect calls

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("LmsToken");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}api/assignment/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data.data);
      setAssignments(response.data.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [classId]);

  // dropdown click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <section className="w-full p-6 h-full border border-[#DBDBDB] rounded-lg">
        {assignments.length !== 0 ? (
          <>
            <div className="header-container  mb-4">
              <div className="section-1 flex items-center justify-between ">
                <h1 className="text-[#282526] font-medium text-lg">
                  Classwork List
                </h1>

                <div ref={dropdownRef} className="btn-container relative">
                  <button
                    onClick={() => setIsDropdown(!isDropdown)}
                    className={`bg-[#0B56A4] text-white flex items-center gap-3 py-2 px-4 rounded-lg w-fit cursor-pointer hover:bg-[#0b55a4db] ${isDropdown ? "" : ""}`}
                  >
                    <Plus
                      className={`text-white ${isDropdown ? "rotate-135" : "rotate-0"} transition-all duration-300`}
                    />
                    Create new Classwork
                  </button>
                  {isDropdown && (
                    <div className="dropdown-container transition-all duration-300 space-y-3 w-full absolute top-full left-0 bg-[#ffffff] z-30 border border-gray-200 shadow-lg rounded">
                      <button
                        onClick={() => setIsAssignmentModalOpen(true)}
                        className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full"
                      >
                        <FileText className="text-gray-600" />
                        Assignment
                      </button>
                      <button
                        onClick={() => setIsQuizAssignmentModalOpen(true)}
                        className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full"
                      >
                        <ClipboardCheck className="text-gray-600" />
                        Quiz Assignment
                      </button>
                      <button onClick={()=>setIsQuestionModalOpen(true)} className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full">
                        <FileQuestionMark className="text-gray-600" />
                        Question
                      </button>
                      <button className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full">
                        <BookOpenIcon className="text-gray-600" />
                        Material
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="search-container flex items-center gap-2 justify-between mt-4 ">
                <div className="search-bar border border-gray-300 rounded-lg flex items-center justify-between gap-2 px-2 py-2 w-[60%]">
                  <input
                    type="text"
                    placeholder="Search classwork.."
                    className="outline-none w-full"
                  />
                  <Search className="text-gray-400" />
                </div>

                <div className="filter-container relative border border-gray-300 rounded-lg w-[34%] flex items-center justify-between">
                  <button onClick={() => setFilterDropdown(!filterDropdown)} className="w-full flex py-2 px-3 cursor-pointer items-center justify-between">
                    Assignment <span>
                      <ChevronDown className={`rotate-0 transition-all duration-300 ${filterDropdown ? "rotate-180" : "rotate-0"}`} />
                    </span>
                  </button>
                  {filterDropdown && <div className="dropdown-container absolute top-full left-0 bg-[#ffffff] border border-gray-200 shadow-lg rounded">
                    <button className="w-full px-2 py-3 hover:bg-gray-50 cursor-pointer text-left">Assignment</button>
                    <button className="w-full px-2 py-3 hover:bg-gray-50 cursor-pointer text-left">Quiz Assignment</button>
                    <button className="w-full px-2 py-3 hover:bg-gray-50 cursor-pointer text-left">Question</button>
                    <button className="w-full px-2 py-3 hover:bg-gray-50 cursor-pointer text-left">Material</button>
                  </div>}
                </div>
              </div>
            </div>

            {/* card section  */}
            <div className="card-container space-y-2 max-h-[calc(100vh-320px)] overflow-auto ">
              {assignments.map((item, index) => {
                return (
                  <div
                    className="card cursor-pointer hover:border-[#0B56A4] flex items-center rounded-xl bg-[#F9F9F9] px-4 justify-between border border-gray-300 py-4"
                    key={index}
                  >
                    <div className="flex items-center gap-3 ">
                      <div className="img-container bg-[#0B56A4] w-9 h-9 rounded-full flex items-center justify-center">
                        <img src={assignmentWorkIcon} className="w-6 h-6" />
                      </div>
                      <h1 className="font-medium">{item.title}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-[#646464]">
                        Posted on : {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                      </h1>
                      <button className="hover:text-gray-700 cursor-pointer">
                        <span className="">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="black"
                            className="bi bi-three-dots-vertical"
                            viewBox="0 0 16 16"
                          >
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="w-full h-full flex flex-col justify-center items-center gap-4 relative">
              <div className="img-container h-[260px]">
                <img src={noDataImg} className="w-[300px] h-full m-auto" />
              </div>
              <div className="text-container text-center ">
                <h1 className="font-medium text-lg text-[#0B56A4]">
                  Add a Classwork to get Started !
                </h1>
                <h1 className="text-[#777777] w-[80%] m-auto">
                  Start by adding classwork to share lessons, assignments, and
                  resources with your class.
                </h1>
                <div ref={dropdownRef} className="btn-container absolute top-0 right-0">
                  <button onClick={() => setIsDropdown(!isDropdown)} className="bg-[#0B56A4]  hover:bg-[#0b55a4db] cursor-pointer transition-all duration-300 text-white flex items-center gap-3 py-2 px-4 rounded-lg w-fit m-auto mt-2">
                    <Plus c className={`text-white ${isDropdown ? "rotate-135" : "rotate-0"} transition-all duration-300`} />
                    Create new Classwork
                  </button>
                  {isDropdown && (
                    <div className="dropdown-container transition-all duration-300 space-y-3 w-full absolute top-full left-0 bg-[#ffffff] border border-gray-200 shadow-lg rounded">
                      <button
                        onClick={() => setIsAssignmentModalOpen(true)}
                        className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full"
                      >
                        <FileText className="text-gray-600" />
                        Assignment
                      </button>
                      <button
                        onClick={() => setIsQuizAssignmentModalOpen(true)}
                        className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full"
                      >
                        <ClipboardCheck className="text-gray-600" />
                        Quiz Assignment
                      </button>
                      <button className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full">
                        <FileQuestionMark className="text-gray-600" />
                        Question
                      </button>
                      <button className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full">
                        <BookOpenIcon className="text-gray-600" />
                        Material
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
      {isAssignmentModalOpen && (
        <AddAssignmentModal
          setIsAssignmentModalOpen={setIsAssignmentModalOpen}
          onClose={() => {
            setIsAssignmentModalOpen(false);
            fetchAssignments();
          }}
        />
      )}

      {isQuestionModalOpen && <QuestionAssignmentCanvas setIsAssignmentModalOpen={setIsQuestionModalOpen} />}

      {quizAssignmentModalOpen && <QuizAssignmentCanvas setIsAssignmentModalOpen={setIsQuizAssignmentModalOpen} />}
    </>
  );
};

export default ClassRoomClassworkComponent;
