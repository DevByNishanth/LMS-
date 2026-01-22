import { UploadCloud, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
const AddSubjectCanvas = ({ setAddSubject }) => {
  // states
  const [activeTab, setActiveTab] = useState("single");
  const [file, setFile] = useState(null);

  //   ref's
  const panelRef = useRef(null);

  //   useEffect's
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setAddSubject(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);
  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-50"></div>
      <section
        ref={panelRef}
        className="w-[40%] bg-white h-[100vh] z-[60] fixed right-0 top-0 shadow-xl transition-all duration-300 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200">
          <h1 className="font-medium text-lg text-gray-800">
            Add Subject Details
          </h1>
          <div
            onClick={() => setAddSubject(false)}
            className="cursor-pointer rounded-full w-8 h-8 flex justify-center items-center bg-slate-100 hover:bg-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#E6E9F5] rounded-full mx-6 mt-2 p-1">
          <button
            onClick={() => setActiveTab("single")}
            className={`w-1/2 py-2 text-md font-medium rounded-full cursor-pointer transition-all duration-200 ${
              activeTab === "single"
                ? "bg-[#0B56A4] text-white"
                : "text-gray-600"
            }`}
          >
            Single Subject Entry
          </button>
          <button
            onClick={() => setActiveTab("multiple")}
            className={`w-1/2 py-2 text-md font-medium rounded-full cursor-pointer transition-all duration-200 ${
              activeTab === "multiple"
                ? "bg-[#0B56A4] text-white"
                : "text-gray-600"
            }`}
          >
            Multiple Upload
          </button>
        </div>

        <div className="form-container mx-7 mt-6">
          {activeTab.toLowerCase() == "multiple" && (
            <div
              className="border border-dashed border-gray-400 rounded-md py-10 flex flex-col items-center justify-center text-gray-600 text-sm bg-gray-50"
              // onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()} // Prevent default behavior to allow drop
            >
              <UploadCloud className="w-10 h-10 mb-2 text-gray-500" />
              <p>
                Drag & drop files or{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  // onClick={() => fileInputRef.current.click()}
                >
                  Browse
                </span>
              </p>
              <input
                type="file"
                accept=".xls,.xlsx"
                //   ref={fileInputRef}
                //   onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {file && (
                <div className="mt-4 text-center">
                  <p className="text-gray-700 text-sm">{file.name}</p>
                  <button
                    //   onClick={handleCancel}
                    className="mt-2 text-red-500 text-xs hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AddSubjectCanvas;
