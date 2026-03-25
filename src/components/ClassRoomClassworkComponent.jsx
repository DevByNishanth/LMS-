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
  LayoutList,
} from "lucide-react";
import assignmentWorkIcon from "../assets/assignmentWorkIcon.svg";
import AddAssignmentModal from "./AddAssignmentModal";
import QuizAssignmentCanvas from "./QuizAssignmentCanvas";
import QuestionAssignmentCanvas from "./QuestionAssignmentCanvas";
import QuizDetailView from "./QuizDetailView";
import ClassworkDetailView from "./ClassworkDetailView";
import AddMaterialModal from "./AddMaterialModal";

const ClassRoomClassworkComponent = () => {
  const { classId, sectionId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [isDropdown, setIsDropdown] = useState(false);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [quizAssignmentModalOpen, setIsQuizAssignmentModalOpen] =
    useState(false);
  const [isDetailview, setIsDetailview] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isQuizDetailView, setIsQuizDetailView] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Classwork");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  const dropdownRef = useRef(null);
  const filterRef = useRef(null);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("LmsToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/assignment/subject/${classId}/${sectionId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAssignments(
        (response.data.assignments || []).map((a) => ({
          ...a,
          itemType: "assignment",
        })),
      );
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  console.log("assignments : ", assignments)

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("LmsToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/question/${classId}/${sectionId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setQuestions(
        (response.data.questions || []).map((q) => ({
          ...q,
          itemType: "question",
        })),
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMaterials(
        (response.data.data || []).map((m) => ({ ...m, itemType: "material" })),
      );
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("LmsToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/quiz/${classId}/${sectionId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Access response.data.data because that's where the quiz array lives
      setQuizzes(
        (response.data.data || []).map((q) => ({ ...q, itemType: "quiz" })),
      );
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const fetchAllClasswork = () => {
    fetchAssignments();
    fetchQuestions();
    fetchMaterials();
    fetchQuizzes();
  };

  async function handleDetailView(item) {
    setSelectedAssignment(item);
    setIsDetailview(true);
  }

  const handleQuizDetailView = async (quizId) => {
    try {
      const token = localStorage.getItem("LmsToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/quiz/${classId}/${sectionId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const quiz = response.data.data.find((q) => q._id === quizId);
      if (quiz) {
        setSelectedQuiz(quiz);
        setIsQuizDetailView(true);
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  useEffect(() => {
    fetchAllClasswork();
  }, [classId, sectionId]);

  const classworkList = [
    ...assignments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    ),
    ...quizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    ...questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    ...materials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  ];

  const filteredClasswork = classworkList.filter((item) => {
    const matchesFilter =
      selectedFilter === "All Classwork" ||
      (selectedFilter === "Assignment" && item.itemType === "assignment") ||
      (selectedFilter === "Question" && item.itemType === "question") ||
      (selectedFilter === "Quiz" && item.itemType === "quiz") ||
      (selectedFilter === "Material" && item.itemType === "material");

    const matchesSearch = (item.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsDropdown(false);
      if (filterRef.current && !filterRef.current.contains(e.target))
        setFilterDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {!isDetailview && !isQuizDetailView ? (
        <section className="w-full p-6 h-full border border-[#DBDBDB] rounded-lg">
          {classworkList.length === 0 ? (
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
                <div
                  ref={dropdownRef}
                  className="btn-container absolute top-0 right-0"
                >
                  <button
                    onClick={() => setIsDropdown(!isDropdown)}
                    className="bg-[#08384F] cursor-pointer text-white flex items-center gap-3 py-2 px-4 rounded-lg w-fit m-auto mt-2"
                  >
                    <Plus
                      className={`${isDropdown ? "rotate-135" : "rotate-0"} transition-all duration-300`}
                    />
                    Create new Classwork
                  </button>
                  {isDropdown && (
                    <div className="dropdown-container space-y-1 w-full absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded z-40 py-1">
                      <button
                        onClick={() => setIsAssignmentModalOpen(true)}
                        className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 w-full text-sm font-medium"
                      >
                        <FileText className="text-gray-600 w-4 h-4" />{" "}
                        Assignment
                      </button>
                      <button
                        onClick={() => setIsQuizAssignmentModalOpen(true)}
                        className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 w-full text-sm font-medium"
                      >
                        <ClipboardCheck className="text-gray-600 w-4 h-4" />{" "}
                        Quiz Assignment
                      </button>
                      <button
                        onClick={() => setIsQuestionModalOpen(true)}
                        className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 w-full text-sm font-medium"
                      >
                        <FileQuestionMark className="text-gray-600 w-4 h-4" />{" "}
                        Question
                      </button>
                      <button
                        onClick={() => setIsMaterialModalOpen(true)}
                        className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 w-full text-sm font-medium"
                      >
                        <BookOpenIcon className="text-gray-600 w-4 h-4" />{" "}
                        Material
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="header-container mb-4">
                <div className="section-1 flex items-center justify-between ">
                  <h1 className="text-[#282526] font-medium text-lg">
                    Classwork List
                  </h1>
                  <div ref={dropdownRef} className="btn-container relative">
                    <button
                      onClick={() => setIsDropdown(!isDropdown)}
                      className="bg-[#08384F] text-white flex items-center gap-3 py-2 px-4 rounded-lg w-fit cursor-pointer hover:bg-[#0b55a4db]"
                    >
                      <Plus
                        className={`${isDropdown ? "rotate-135" : "rotate-0"} transition-all duration-300`}
                      />
                      Create new Classwork
                    </button>
                    {isDropdown && (
                      <div className="dropdown-container space-y-1 w-full absolute top-full left-0 bg-white z-30 border border-gray-200 shadow-lg rounded py-1">
                        <button
                          onClick={() => setIsAssignmentModalOpen(true)}
                          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 w-full text-sm font-medium"
                        >
                          <FileText className="text-gray-600 w-4 h-4" />{" "}
                          Assignment
                        </button>
                        <button
                          onClick={() => setIsQuizAssignmentModalOpen(true)}
                          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 w-full text-sm font-medium"
                        >
                          <ClipboardCheck className="text-gray-600 w-4 h-4" />{" "}
                          Quiz Assignment
                        </button>
                        <button
                          onClick={() => setIsQuestionModalOpen(true)}
                          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 w-full text-sm font-medium"
                        >
                          <FileQuestionMark className="text-gray-600 w-4 h-4" />{" "}
                          Question
                        </button>
                        <button
                          onClick={() => setIsMaterialModalOpen(true)}
                          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 w-full text-sm font-medium"
                        >
                          <BookOpenIcon className="text-gray-600 w-4 h-4" />{" "}
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
                    className="filter-container relative border border-gray-300 rounded-lg w-[34%]"
                  >
                    <button
                      onClick={() => setFilterDropdown(!filterDropdown)}
                      className="w-full flex py-2 px-3 cursor-pointer items-center justify-between text-sm"
                    >
                      {selectedFilter}
                      <ChevronDown
                        className={`${filterDropdown ? "rotate-180" : "rotate-0"} transition-all duration-300`}
                      />
                    </button>
                    {filterDropdown && (
                      <div className="dropdown-container w-full absolute top-full left-0 bg-white z-30 border border-gray-200 shadow-lg rounded overflow-hidden">
                        {[
                          "All Classwork",
                          "Assignment",
                          "Quiz",
                          "Question",
                          "Material",
                        ].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSelectedFilter(option);
                              setFilterDropdown(false);
                            }}
                            className="w-full px-3 py-2.5 hover:bg-gray-50 cursor-pointer text-left text-sm font-medium border-b border-gray-100 last:border-b-0"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {filteredClasswork.length > 0 ? (
                <div className="card-container space-y-2 max-h-[calc(100vh-320px)] overflow-auto ">
                  {filteredClasswork.map((item, index) => (
                    <div
                      onClick={() =>
                        item.itemType === "quiz"
                          ? handleQuizDetailView(item._id)
                          : handleDetailView(item)
                      }
                      className="card cursor-pointer hover:border-[#0B56A4] flex items-center rounded-xl bg-[#F9F9F9] px-4 justify-between border border-gray-300 py-4 group"
                      key={index}
                    >
                      <div className="flex items-center gap-3 ">
                        <div className="img-container bg-[#08384F] w-9 h-9 rounded-full flex items-center justify-center">
                          {item.itemType === "question" ? (
                            <FileQuestionMark className="text-white w-5 h-5" />
                          ) : item.itemType === "material" ? (
                            <BookOpenIcon className="text-white w-5 h-5" />
                          ) : item.itemType === "quiz" ? (
                            <ClipboardCheck className="text-white w-5 h-5" />
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4">
                  <h2 className="text-lg font-medium text-gray-800 ">
                    No matches found
                  </h2>
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
      ) : isQuizDetailView ? (
        <QuizDetailView
          selectedAssignment={selectedQuiz}
          setIsDetailview={() => {
            setIsQuizDetailView(false);
            setSelectedQuiz(null);
          }}
        />
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
            fetchQuestions();
          }}
        />
      )}

      {quizAssignmentModalOpen && (
        <QuizAssignmentCanvas
          setIsAssignmentModalOpen={setIsQuizAssignmentModalOpen}
          onClose={() => {
            setIsQuizAssignmentModalOpen(false);
            fetchQuizzes();
          }}
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
