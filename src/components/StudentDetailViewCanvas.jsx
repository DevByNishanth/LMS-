import React, { useRef, useEffect } from "react";
import manImg from "../assets/man.svg";
import {
  Badge,
  Book,
  Building2,
  Calendar1Icon,
  IdCardLanyard,
  Key,
  X,
} from "lucide-react";

const StudentDetailViewCanvas = ({ setIsDetailCanvas, canvasData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (canvasRef.current && !canvasRef.current.contains(e.target)) {
        setIsDetailCanvas(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsDetailCanvas]);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"></div>
      <section
        ref={canvasRef}
        className="w-[45%] bg-white h-screen z-[60] fixed right-0 top-0 shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto"
      >
        {/* Header/Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            Student Profile
          </h2>
          <button
            onClick={() => setIsDetailCanvas(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="content-container p-6 space-y-8">
          {/* Top Profile Section */}
          <div className="flex gap-6 items-start">
            <div className="w-[180px] h-[180px] flex-shrink-0">
              {canvasData?.profileImg ? (
                <img
                  src={manImg}
                  alt="Profile"
                  className="h-full w-full object-cover rounded-2xl shadow-md border-2 border-white"
                />
              ) : (
                <div className="bg-indigo-50 border-2 border-indigo-100 text-indigo-600 rounded-2xl h-full w-full flex items-center justify-center shadow-inner">
                  <p className="text-5xl font-bold">
                    {canvasData?.firstName?.slice(0, 1)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Personal Information
              </h3>
              <table className="w-full text-sm border-separate border-spacing-y-3">
                <tbody>
                  <tr>
                    <td className="text-gray-500 font-medium w-32">
                      Full Name
                    </td>
                    <td className="text-gray-800 font-semibold">{`${canvasData?.firstName || ""} ${canvasData?.lastName || ""}`}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 font-medium">Email Address</td>
                    <td className="text-[#0B56A4] font-medium break-all">
                      {canvasData?.email || "--"}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 font-medium">Gender</td>
                    <td className="text-gray-800 capitalize">
                      {canvasData?.gender || "--"}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 font-medium">Date of Birth</td>
                    <td className="text-gray-800">
                      {canvasData?.dateOfBirth || "--"}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500 font-medium">Phone</td>
                    <td className="text-gray-800">
                      {canvasData?.mobileNumber || "--"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <h3 className="text-lg font-bold text-gray-800">
                Academic Overview
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: IdCardLanyard,
                  label: "Register Number",
                  value: canvasData?.registerNumber,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: Book,
                  label: "Academic Year",
                  value: canvasData?.year,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  icon: Building2,
                  label: "Department",
                  value: canvasData?.department,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  icon: Key,
                  label: "Section",
                  value: canvasData?.section,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
                {
                  icon: Calendar1Icon,
                  label: "Regulation",
                  value: canvasData?.regulation,
                  color: "text-indigo-600",
                  bg: "bg-indigo-50",
                },
                {
                  icon: Badge,
                  label: "Status",
                  value: canvasData?.status,
                  color: "text-rose-600",
                  bg: "bg-rose-50",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2.5 ${item.bg} rounded-lg`}>
                    <item.icon className={`${item.color} w-5 h-5`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {item.value || "--"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Decoration */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#08384F] to-[#0B56A4]"></div>
      </section>
    </>
  );
};

export default StudentDetailViewCanvas;
