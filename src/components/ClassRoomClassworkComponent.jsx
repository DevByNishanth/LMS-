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
import ClassworkDetailView from "./ClassworkDetailView";
import AddMaterialModal from "./AddMaterialModal";

// const classWorkData1 = [];

const ClassRoomClassworkComponent = () => {
  // states
  const { classId, sectionId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isDropdown, setIsDropdown] = useState(false);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [quizAssignmentModalOpen, setIsQuizAssignmentModalOpen] =
    useState(false);
  const [isDetailview, setIsDetailview] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Classwork");
  const [searchQuery, setSearchQuery] = useState("");
  const [materials, setMaterials] = useState([]);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  // refs
  const dropdownRef = useRef(null);
  const filterRef = useRef(null);

  // useEffect calls

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("LmsToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/assignment/subject/${classId}/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Assignments:", response.data.assignments);
      setAssignments(
        response.data.assignments.map((a) => ({
          ...a,
          itemType: "assignment",
        })),
      );
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("LmsToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/question/${classId}/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Questions:", response.data.questions);
      setQuestions(
        response.data.questions.map((q) => ({ ...q, itemType: "question" })),
      );
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem("LmsToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/material/subject/${classId}/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Materials:", response.data.data);
      setMaterials(
        response.data.data.map((m) => ({ ...m, itemType: "material" })),
      );
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchAllClasswork = () => {
    fetchAssignments();
    fetchQuestions();
    fetchMaterials();
  };

  async function handleDetailView(item) {
    setSelectedAssignment(item);
    setIsDetailview(true);
  }

  // useEffect calls

  useEffect(() => {
    fetchAllClasswork();
  }, [classId]);

  const classworkList = [...assignments, ...questions, ...materials].sort(
    (a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    },
  );

  const filteredClasswork = classworkList.filter((item) => {
    const matchesFilter =
      selectedFilter === "All Classwork" ||
      (selectedFilter === "Assignment" && item.itemType === "assignment") ||
      (selectedFilter === "Question" && item.itemType === "question") ||
      (selectedFilter === "Material" && item.itemType === "material");

    // Filter by search query
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // dropdown click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdown(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {!isDetailview ? (
        <section className="w-full p-6 h-full border border-[#DBDBDB] rounded-lg">
          {classworkList.length === 0 ? (
            // Initial Empty State: No classwork at all
            <div className="w-full h-full flex flex-col justify-center items-center gap-4 relative">
              <div className="img-container h-[260px]">
                <img
                  src={noDataImg}
                  className="w-[300px] h-full m-auto"
                  alt="No Data"
                />
              </div>
              <div className="text-container text-center ">
                <h1 className="font-medium text-lg text-[#0B56A4]">
                  Add a Classwork to get Started !
                </h1>
                <h1 className="text-[#777777] w-[80%] m-auto">
                  Start by adding classwork to share lessons, assignments, and
                  resources with your class.
                </h1>
                <div
                  ref={dropdownRef}
                  className="btn-container absolute top-0 right-0"
                >
                  <button
                    onClick={() => setIsDropdown(!isDropdown)}
                    className="bg-[#08384F]  bghover:bg-[#0b55a4db] cursor-pointer transition-all duration-300 text-white flex items-center gap-3 py-2 px-4 rounded-lg w-fit m-auto mt-2"
                  >
                    <Plus
                      className={`text-white ${isDropdown ? "rotate-135" : "rotate-0"} transition-all duration-300`}
                    />
                    Create new Classwork
                  </button>
                  {isDropdown && (
                    <div className="dropdown-container transition-all duration-300 space-y-3 w-full absolute top-full left-0 bg-[#ffffff] border border-gray-200 shadow-lg rounded z-40">
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
                      <button
                        onClick={() => setIsQuestionModalOpen(true)}
                        className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full"
                      >
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
          ) : (
            // Data exists, handle filtering
            <>
              <div className="header-container mb-4">
                <div className="section-1 flex items-center justify-between ">
                  <h1 className="text-[#282526] font-medium text-lg">
                    Classwork List
                  </h1>
                  <div ref={dropdownRef} className="btn-container relative">
                    <button
                      onClick={() => setIsDropdown(!isDropdown)}
                      className="bg-[#08384F]  text-white flex items-center gap-3 py-2 px-4 rounded-lg w-fit cursor-pointer hover:bg-[#0b55a4db]"
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
                          className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full text-sm font-medium"
                        >
                          <FileText className="text-gray-600 w-4 h-4" />
                          Assignment
                        </button>
                        <button
                          onClick={() => setIsQuestionModalOpen(true)}
                          className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full text-sm font-medium"
                        >
                          <FileQuestionMark className="text-gray-600 w-4 h-4" />
                          Question
                        </button>
                        <button
                          onClick={() => setIsMaterialModalOpen(true)}
                          className="flex items-center gap-2 py-3 px-3 cursor-pointer hover:bg-gray-100 w-full text-sm font-medium"
                        >
                          <BookOpenIcon className="text-gray-600 w-4 h-4" />
                          Material
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="search-container flex items-center gap-2 justify-between mt-4 ">
                  <div className="search-bar border border-gray-300 rounded-lg flex items-center justify-between gap-2 px-2 py-2 w-[60%] focus-within:border-[#0B56A4] transition-colors">
                    <input
                      type="text"
                      placeholder="Search classwork by title.."
                      className="outline-none w-full text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="text-gray-400 w-5 h-5" />
                  </div>

                  <div
                    ref={filterRef}
                    className="filter-container relative border border-gray-300 rounded-lg w-[34%] flex items-center justify-between"
                  >
                    <button
                      onClick={() => setFilterDropdown(!filterDropdown)}
                      className="w-full flex py-2 px-3 cursor-pointer items-center justify-between"
                    >
                      {selectedFilter}
                      <span>
                        <ChevronDown
                          className={`rotate-0 transition-all duration-300 ${filterDropdown ? "rotate-180" : "rotate-0"}`}
                        />
                      </span>
                    </button>
                    {filterDropdown && (
                      <div className="dropdown-container w-full absolute top-full left-0 bg-[#ffffff] z-30 border border-gray-200 shadow-lg rounded overflow-hidden">
                        {[
                          "All Classwork",
                          "Assignment",
                          "Question",
                          "Material",
                        ].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSelectedFilter(option);
                              setFilterDropdown(false);
                            }}
                            className="w-full px-3 py-3 hover:bg-gray-50 cursor-pointer text-left text-sm font-medium border-b border-gray-100 last:border-b-0"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* List Section */}
              {filteredClasswork.length > 0 ? (
                <div className="card-container space-y-2 max-h-[calc(100vh-320px)] overflow-auto ">
                  {filteredClasswork.map((item, index) => {
                    const isQuestion = item.questionType !== undefined;
                    return (
                      <div
                        onClick={() => handleDetailView(item)}
                        className="card cursor-pointer hover:border-[#0B56A4] flex items-center rounded-xl bg-[#F9F9F9] px-4 justify-between border border-gray-300 py-4 group"
                        key={index}
                      >
                        <div className="flex items-center gap-3 ">
                          <div className="img-container bg-[#08384F]  bgw-9 h-9 rounded-full flex items-center justify-center">
                            {item.itemType === "question" ? (
                              <FileQuestionMark className="text-white w-5 h-5" />
                            ) : item.itemType === "material" ? (
                              <BookOpenIcon className="text-white w-5 h-5" />
                            ) : (
                              <img
                                src={assignmentWorkIcon}
                                className="w-5 h-5"
                                alt="Icon"
                              />
                            )}
                          </div>
                          <h1 className="font-medium text-gray-800 group-hover:text-[#0B56A4] transition-colors">
                            {item.title}
                          </h1>
                        </div>
                        <div className="flex items-center gap-4">
                          <h1 className="text-[#646464] text-xs">
                            Posted on :{" "}
                            {new Date(
                              item.createdAt || Date.now(),
                            ).toLocaleDateString()}
                          </h1>
                          <button className="hover:text-[#0B56A4] cursor-pointer">
                            <span className="">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="currentColor"
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
              ) : (
                // Filtered Empty State: Classwork exists but nothing matches filter/search
                <div className="flex flex-col items-center justify-center py-10 px-4">
                  <div className="img-container h-[180px] mb-4">
                    <img
                      src={noDataImg}
                      className="w-[200px] h-full m-auto opacity-60"
                      alt="No Results"
                    />
                  </div>
                  <h2 className="text-lg font-medium text-gray-800 ">
                    No matches found
                  </h2>
                  <p className="text-gray-500 text-center max-w-xs text-sm">
                    We couldn't find any classwork matching "{searchQuery}" in{" "}
                    {selectedFilter.toLowerCase()}s. Try changing your search
                    query or filter.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedFilter("All Classwork");
                      setSearchQuery("");
                    }}
                    className="mt-2 text-[#0B56A4] font-medium hover:underline cursor-pointer"
                  >
                    Reset all
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      ) : (
        <ClassworkDetailView
          selectedAssignment={selectedAssignment}
          setIsDetailview={setIsDetailview}
        />
      )}

      {isAssignmentModalOpen && (
        <AddAssignmentModal
          setIsAssignmentModalOpen={setIsAssignmentModalOpen}
          onClose={() => {
            setIsAssignmentModalOpen(false);
            fetchAssignments();
          }}
        />
      )}

      {isQuestionModalOpen && (
        <QuestionAssignmentCanvas
          setIsAssignmentModalOpen={setIsQuestionModalOpen}
          onClose={() => {
            setIsQuestionModalOpen(false);
            fetchQuestions(); // Refresh questions list
          }}
        />
      )}

      {quizAssignmentModalOpen && (
        <QuizAssignmentCanvas
          setIsAssignmentModalOpen={setIsQuizAssignmentModalOpen}
        />
      )}

      {isMaterialModalOpen && (
        <AddMaterialModal
          setIsMaterialModalOpen={setIsMaterialModalOpen}
          onClose={() => {
            setIsMaterialModalOpen(false);
            fetchMaterials();
          }}
        />
      )}
    </>
  );
};

export default ClassRoomClassworkComponent;
