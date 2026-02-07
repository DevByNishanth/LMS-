import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Video, MessageSquare } from "lucide-react";

const ClassroomDetails = () => {
  const { id } = useParams();

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/student/classroom"
          className="p-2 hover:bg-gray-200 rounded-full transition"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#18283b]">Classroom {id}</h1>
          <p className="text-gray-500">View your lectures and assignments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Announcements</h2>
            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              Welcome to the new semester! Please check the syllabus.
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Recent Materials</h2>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="text-blue-500" size={20} />
                    <span className="text-sm font-medium">
                      Lecture_Note_{i}.pdf
                    </span>
                  </div>
                  <button className="text-[#0B56A4] text-xs font-bold">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 gap-2">
              <button className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-blue-50 text-gray-700 transition">
                <Video size={18} /> Join Live Class
              </button>
              <button className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-blue-50 text-gray-700 transition">
                <MessageSquare size={18} /> Discussion Forum
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetails;
