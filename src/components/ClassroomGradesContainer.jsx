import React, { useState } from "react";
import ClassroomGradesTable from "./ClassroomGradesTable";
import ClassroomGradesAssignmentTable from "./ClassrromGradesAssignmentTable";
import ClassroomGradesInternalTable from "./ClassrromGradesInternalTable";
const ClassroomGradesContainer = () => {
  const [activeTab, setActiveTab] = useState("classwork");

  const classworkAssignments = [
    "Assignment",
    "Assignment",
    "Assignment",
    "Assignment",
    "Assignment",
    "Assignment",
  ];

  const ciaAssignments = [
    "CIA 1",
    "CIA 2",
    "CIA 3",
    "Presentation",
    "Model Exam",
  ];

  const [classworkStudents, setClassworkStudents] = useState([
    { name: "Surya Chandran", marks: ["", "", "", "", "", ""] },
    { name: "Surya Chandran", marks: ["10", "10", "10", "10", "10", "10"] },
    { name: "Surya Chandran", marks: ["40", "", "", "", "", ""] },
     { name: "Surya Chandran", marks: ["", "", "", "", "", ""] },
    { name: "Surya Chandran", marks: ["10", "10", "10", "10", "10", "10"] },
    { name: "Surya Chandran", marks: ["40", "", "", "", "", ""] }
  ]);

  const [ciaStudents, setCiaStudents] = useState([
    { name: "Surya Chandran", marks: ["", "", "", "", ""] },
    { name: "Surya Chandran", marks: ["10", "10", "10", "10", "10"] },
    { name: "Surya Chandran", marks: ["", "", "", "", ""] },
    { name: "Surya Chandran", marks: ["10", "10", "10", "10", "10"] },
  ]);

  return (
    <section className="w-full p-6 h-full border border-[#DBDBDB] rounded-lg">

      {/* Tabs */}
      <div className="flex mb-6 bg-[#E5E7EB] rounded-full p-1">

        <button
          onClick={() => setActiveTab("classwork")}
          className={`flex-1 py-2 rounded-full font-medium ${
            activeTab === "classwork" ? "bg-[#1E5DA8] text-white" : ""
          }`}
        >
          Classwork
        </button>

        <button
          onClick={() => setActiveTab("cia")}
          className={`flex-1 py-2 rounded-full font-medium ${
            activeTab === "cia" ? "bg-[#1E5DA8] text-white" : ""
          }`}
        >
          CIA & Others
        </button>

      </div>

      {activeTab === "classwork" ? (
        <ClassroomGradesAssignmentTable
          students={classworkStudents}
          setStudents={setClassworkStudents}
          assignments={classworkAssignments}
        />
      ) : (
        <ClassroomGradesInternalTable
          students={ciaStudents}
          setStudents={setCiaStudents}
          internals={ciaAssignments}
        />
      )}

    </section>
  );
};

export default ClassroomGradesContainer;