import React, { useState } from "react";
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
  { firstName: "Kishor", lastName: "raguram", email: "kishorraguram1@gmail.com", marks: ["", "", "", "", "", ""] },
  { firstName: "Kishor", lastName: "Raguram", email: "kishorraguram@gmail.com", marks: ["10", "85", "10", "90", "10", "10"] },
  { firstName: "Surya", lastName: "Chandran", email: "surya.c@example.com", marks: ["40", "", "75", "", "", ""] },
  { firstName: "Arjun", lastName: "Das", email: "arjun.das@example.com", marks: ["", "95", "", "60", "", ""] },
  { firstName: "Manoj", lastName: "Kumar", email: "manoj.k@example.com", marks: ["10", "10", "10", "10", "10", "10"] },
  { firstName: "Priya", lastName: "Dharshini", email: "priya.d@example.com", marks: ["40", "", "", "100", "", ""] }
]);

  const [ciaStudents, setCiaStudents] = useState([
    { firstName: "Surya",lastName:"Chandran", rollNo: "22CS001", registerNo: "722822104001", marks: ["70", "70", "70", "70", "70"] },
    { firstName: "Adhavan",lastName:"P", rollNo: "22CS002", registerNo: "722822104002", marks: ["10", "10", "10", "10", "10"] },
    { firstName: "Aarthi",lastName:"M", rollNo: "22CS003", registerNo: "722822104003", marks: ["92", "92", "92", "92", "92"] },
    { firstName: "Charubala",lastName:"B", rollNo: "22CS033", registerNo: "722822104033", marks: ["85", "85", "85", "85", "85"] },
  ]);

  return (
    <section className="w-full p-6 h-full border border-[#DBDBDB] rounded-lg">

      {/* Tabs */}
      <div className="flex mb-6 bg-[#E5E7EB] rounded-full p-1">

        <button
          onClick={() => setActiveTab("classwork")}
          className={`flex-1 py-2 rounded-full font-medium ${
            activeTab === "classwork" ? "bg-[#08394f] text-white" : ""
          }`}
        >
          Classwork
        </button>

        <button
          onClick={() => setActiveTab("cia")}
          className={`flex-1 py-2 rounded-full font-medium ${
            activeTab === "cia" ? "bg-[#08394f] text-white" : ""
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