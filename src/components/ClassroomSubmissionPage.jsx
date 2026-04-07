import React, { useState } from "react";
import { useParams } from "react-router-dom";
import FilesLogo from "/files.png";

import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Files,
  MessageSquare,
  ChevronDown,
  HelpCircle,
  Search,
  Plus
} from "lucide-react";

const ClassroomSubmissionPage = () => {

  const { courseId, assignmentId, userId } = useParams();
  console.log(courseId,assignmentId,userId);

  const [grade, setGrade] = useState("50");
  const [comment, setComment] = useState("");

  const [activeTab, setActiveTab] = useState("files");

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden text-gray-800">

      {/* TOP NAV */}
      <div className="h-16 border-b flex items-center justify-between px-4">
        <h1 className="text-xl text-gray-700">test5</h1>
      </div>

      {/* STUDENT BAR */}
      <div className="h-16 border-b flex items-center justify-between px-4">

        <div className="flex items-center gap-4 flex-1">

          <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-1.5 min-w-[350px]">

            <div className="bg-[#004d40] text-white w-8 h-8 rounded-full flex items-center justify-center text-xs">
              K
            </div>

            <span className="text-sm flex-1">User ID: {userId}</span>

            <div className="flex items-center border-l pl-3 gap-1">
              <span className="text-[#007b5e] font-bold text-sm">
                {grade}/100
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>

          </div>

          <div className="flex items-center gap-1 text-gray-500">
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={20} />
            </button>

            <button className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronRight size={20} />
            </button>
          </div>

        </div>

        <div className="flex items-center gap-4">
          <span className="text-red-600 text-sm">Not returned</span>

          <div className="flex">
            <button className="bg-[#1a73e8] text-white px-6 py-2 rounded-l text-sm">
              Return
            </button>

            <button className="bg-[#1a73e8] text-white px-2 py-2 rounded-r">
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">

        {/* CENTER VIEW */}
        <div className="flex-1 bg-[#e8eaed] flex items-center justify-center">

          <div className="text-center">

            <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center shadow mb-4">
              <img src={FilesLogo} alt="Files Logo" />
            </div>

            <p className="text-gray-700 text-lg">No files attached</p>

          </div>

        </div>

        {/* RIGHT SIDEBAR SYSTEM */}
        <div className="flex border-l">

          {/* ICON COLUMN */}
          <div className="w-16 border-r flex flex-col justify-between items-center py-4">

            {/* TOP ICONS */}
            <div className="flex flex-col gap-4 items-center">

              <button
                onClick={() => setActiveTab("files")}
                className={`p-2 rounded-full ${
                  activeTab === "files"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Files size={22} />
              </button>

              <button
                onClick={() => setActiveTab("comments")}
                className={`p-2 rounded-full ${
                  activeTab === "comments"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <MessageSquare size={22} />
              </button>

            </div>

            {/* BOTTOM ICONS (VERTICAL like Classroom) */}
            <div className="flex flex-col items-center gap-6 text-gray-500">

              <HelpCircle size={22} className="cursor-pointer" />

              <ChevronRight size={22} className="cursor-pointer" />

            </div>

          </div>

          {/* PANEL */}
          <div className="w-[340px] flex flex-col bg-white">

            {/* FILES PANEL */}
            {activeTab === "files" && (
              <div className="p-6 flex-1 overflow-y-auto">

                <section className="mb-8">

                  <div className="flex justify-between mb-3">
                    <h3 className="text-base">Files</h3>
                    <button className="text-sm text-blue-600">
                      See history
                    </button>
                  </div>

                  <p className="text-sm text-gray-600">
                    No files attached
                  </p>

                </section>

                <hr className="my-6" />

                {/* GRADE */}
                <section className="mb-8">

                  <h3 className="text-base mb-4">Grade</h3>

                  <div className="flex items-center gap-2">

                    <div className="border rounded-md px-4 py-3 flex-1 flex justify-center items-center">

                      <input
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full text-right outline-none text-lg"
                      />

                      <span className="text-gray-600 text-lg">
                        /100
                      </span>

                    </div>

                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreVertical size={18} />
                    </button>

                  </div>

                </section>

                <hr className="my-6" />

                {/* PRIVATE COMMENTS */}
                <section>

                  <h3 className="text-base mb-4">
                    Private comments
                  </h3>

                  <textarea
                    placeholder="Add private comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded-lg p-3 text-sm min-h-[90px] outline-none"
                  />

                  <div className="flex justify-end mt-3">

                    <button
                      disabled={!comment}
                      className={`px-6 py-2 rounded text-sm ${
                        comment
                          ? "bg-gray-100 hover:bg-gray-200"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      Post
                    </button>

                  </div>

                </section>

              </div>
            )}

            {/* COMMENT BANK PANEL */}
            {activeTab === "comments" && (
              <div className="p-6 flex-1 flex flex-col">

                <h2 className="text-xl mb-6">
                  Comment bank
                </h2>

                <div className="flex items-center justify-between mb-6">

                  <button className="flex items-center gap-2 text-blue-600">
                    <Plus size={22} />
                    Add to bank
                  </button>

                  <Search size={22} className="text-gray-500" />

                </div>

                <div className="flex-1 flex items-center justify-center text-center">

                  <div>

                    <h3 className="text-xl mb-2">
                      Your comment bank is empty
                    </h3>

                    <p className="text-gray-600 max-w-[250px]">
                      Add comments here to quickly reuse across students and assignments
                    </p>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ClassroomSubmissionPage;