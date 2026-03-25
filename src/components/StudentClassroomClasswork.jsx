import React, { useState, useRef } from "react";
import {
  BookOpenIcon,
  ClipboardCheck,
  FileQuestionMark,
  FileText,
  X,
  ChevronDown,
  Search,
  LayoutList,
} from "lucide-react";
import assignmentWorkIcon from "../assets/assignmentWorkIcon.svg";
import StudentClassworkDetailView from "./StudentClassworkDetailView";
import StudentQuizDetailView from "./StudentQuizDetailView";

const StudentClassroomClasswork = () => {
  // Static data matching the teacher's component structure
  const assignments = [
    {
      _id: "1",
      title: "Chapter 1 Assignment",
      instruction: "Complete exercises 1-5 from Chapter 1. Focus on understanding the fundamental concepts of data structures.",
      marks: 10,
      createdAt: "2024-03-20T10:00:00Z",
      attachments: ["https://example.com/assignment1.pdf"],
      link: "https://docs.google.com/document/assignment1",
      youtubeLink: "https://youtube.com/watch?v=assignment1",
      itemType: "assignment",
      dueDate: "2024-03-25T23:59:59Z"
    },
    {
      _id: "2",
      title: "Chapter 2 Assignment",
      instruction: "Complete all questions from Chapter 2. Pay special attention to the implementation details.",
      marks: 15,
      createdAt: "2024-03-22T14:30:00Z",
      attachments: ["https://example.com/assignment2.pdf", "https://example.com/assignment2-extra.pdf"],
      itemType: "assignment",
      dueDate: "2024-03-27T23:59:59Z"
    }
  ];

  const questions = [
    {
      _id: "3",
      title: "Lab Exercise 1",
      instruction: "Practical lab work on data structures. Implement the given algorithms.",
      questionType: "lab",
      createdAt: "2024-03-15T09:00:00Z",
      itemType: "question",
      dueDate: "2024-03-28T23:59:59Z"
    },
    {
      _id: "4",
      title: "Discussion Question",
      instruction: "Discuss the differences between stack and queue data structures.",
      questionType: "discussion",
      createdAt: "2024-03-18T11:00:00Z",
      itemType: "question",
      dueDate: "2024-03-22T23:59:59Z"
    }
  ];

  const quizzes = [
    {
      _id: "5",
      title: "Midterm Quiz",
      instruction: "Quiz covering Units 1-3. You have 30 minutes to complete this quiz.",
      marks: 20,
      createdAt: "2024-03-18T08:00:00Z",
      questions: [
        {
          _id: "q1",
          questionText: "What is the time complexity of binary search?",
          type: "single",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correctAnswers: [1]
        },
        {
          _id: "q2",
          questionText: "Which data structure uses LIFO principle?",
          type: "single",
          options: ["Queue", "Stack", "Array", "Linked List"],
          correctAnswers: [1]
        }
      ],
      itemType: "quiz",
      dueDate: "2024-03-30T23:59:59Z"
    },
    {
      _id: "6",
      title: "Unit 1 Quiz",
      instruction: "Basic concepts quiz for Unit 1.",
      marks: 10,
      createdAt: "2024-03-10T10:00:00Z",
      questions: [
        {
          _id: "q3",
          questionText: "Which of the following are linear data structures?",
          type: "multiple",
          options: ["Array", "Stack", "Queue", "Tree"],
          correctAnswers: [0, 1, 2]
        }
      ],
      itemType: "quiz",
      dueDate: "2024-03-15T23:59:59Z"
    }
  ];

  const materials = [
    {
      _id: "7",
      title: "Course Material - Unit 1",
      instruction: "Reference material for Unit 1 topics. Read this before attempting assignments.",
      createdAt: "2024-03-10T12:00:00Z",
      attachments: ["https://example.com/unit1-material.pdf"],
      itemType: "material"
    },
    {
      _id: "8",
      title: "Lecture Slides - Week 2",
      instruction: "Slides from the second week of lectures.",
      createdAt: "2024-03-12T15:00:00Z",
      attachments: ["https://example.com/week2-slides.pdf"],
      itemType: "material"
    }
  ];

  // State management
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [isDetailview, setIsDetailview] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isQuizDetailView, setIsQuizDetailView] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All Classwork");
  const [searchQuery, setSearchQuery] = useState("");

  const filterRef = useRef(null);

  // Handle detail view for different item types
  const handleDetailView = (item) => {
    if (item.itemType === "quiz") {
      setSelectedQuiz(item);
      setIsQuizDetailView(true);
    } else {
      setSelectedAssignment(item);
      setIsDetailview(true);
    }
  };

  // Combine all classwork items and sort by creation date
  const classworkList = [
    ...assignments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    ...quizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    ...questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    ...materials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  ];

  // Filter classwork based on selected filter and search query
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

  // Handle clicks outside dropdowns
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setFilterDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get icon for different item types
  const getIcon = (type) => {
    switch (type) {
      case "question":
        return <FileQuestionMark className="text-white w-5 h-5" />;
      case "material":
        return <BookOpenIcon className="text-white w-5 h-5" />;
      case "quiz":
        return <ClipboardCheck className="text-white w-5 h-5" />;
      default:
        return <img src={assignmentWorkIcon} className="w-5 h-5" alt="Icon" />;
    }
  };

  return (
    <>
      {!isDetailview && !isQuizDetailView ? (
        <section className="w-full p-6 h-full border border-[#DBDBDB] rounded-lg">
          {classworkList.length === 0 ? (
            <div className="w-full h-full flex flex-col justify-center items-center gap-4 relative">
              <div className="img-container h-[260px]">
                <img
                  src="https://via.placeholder.com/300x260?text=No+Classwork"
                  className="w-[300px] h-full m-auto"
                  alt="No Data"
                />
              </div>
              <div className="text-container text-center ">
                <h1 className="font-medium text-lg text-[#0B56A4]">
                  No Classwork Available
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                  Your instructor will post assignments, quizzes, and materials here.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="header-container mb-4">
                <div className="section-1 flex items-center justify-between ">
                  <h1 className="text-[#282526] font-medium text-lg">
                    Classwork List
                  </h1>
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
                  {filteredClasswork.map((item) => (
                    <div
                      onClick={() => handleDetailView(item)}
                      className="card cursor-pointer hover:border-[#0B56A4] flex items-center rounded-xl bg-[#F9F9F9] px-4 justify-between border border-gray-300 py-4 group"
                      key={item._id}
                    >
                      <div className="flex items-center gap-3 ">
                        <div className="img-container bg-[#08384F] w-9 h-9 rounded-full flex items-center justify-center">
                          {getIcon(item.itemType)}
                        </div>
                        <h1 className="font-medium text-gray-800 group-hover:text-[#0B56A4] transition-colors">
                          {item.title}
                        </h1>
                      </div>
                      <div className="flex items-center gap-4">
                        <h1 className="text-[#646464] text-xs">
                          Posted on :{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
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
        <StudentQuizDetailView
          selectedAssignment={selectedQuiz}
          setIsDetailview={() => {
            setIsQuizDetailView(false);
            setSelectedQuiz(null);
          }}
        />
      ) : (
        <StudentClassworkDetailView
          selectedAssignment={selectedAssignment}
          setIsDetailview={setIsDetailview}
        />
      )}
    </>
  );
};

export default StudentClassroomClasswork;
