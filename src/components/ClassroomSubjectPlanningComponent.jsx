import React, { useMemo, useState } from "react";
import CoursePlanTab from "./CoursePlanTab";
import CourseDetailsForm from "./CourseDetailsForm";
import CoPoMapping from "./CoPoMapping";
import ReferenceTab from "./ReferenceTab"; // Import the new tab

const ClassroomSubjectPlanningComponent = ({ subjectId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    courseType: "",
    coRequisites: "",
    preRequisites: "",
    courseDescription: "",
    courseObjectives: [""],
    courseOutcomes: [
      { unit: "Unit 1", statement: "", rtbl: "" },
      { unit: "Unit 2", statement: "", rtbl: "" },
      { unit: "Unit 3", statement: "", rtbl: "" },
      { unit: "Unit 4", statement: "", rtbl: "" },
      { unit: "Unit 5", statement: "", rtbl: "" },
    ],
  });

  const [coPoMapping, setCoPoMapping] = useState({});
  const [referenceData, setReferenceData] = useState({ textBooks: [] }); // Track for progress

  const tabStats = useMemo(() => {
    // 1. Details %
    const detailsValues = [
      formData.courseType,
      formData.coRequisites,
      formData.preRequisites,
      formData.courseDescription,
      ...formData.courseObjectives,
      ...formData.courseOutcomes.map((o) => o.statement),
    ];
    const detailsFilled = detailsValues.filter((v) => v?.trim() !== "").length;
    const detailsPercent = Math.round(
      (detailsFilled / detailsValues.length) * 100,
    );

    // 2. Mapping %
    const mappingKeys = [
      "PO0",
      "PO1",
      "PO2",
      "PO3",
      "PO4",
      "PO5",
      "PO6",
      "PO7",
      "PO8",
      "PO9",
      "PO10",
      "PO11",
      "PSO1",
      "PSO2",
      "PSO3",
    ];
    const cos = ["CO1", "CO2", "CO3", "CO4", "CO5"];
    let mapCount = 0;
    cos.forEach((co) =>
      mappingKeys.forEach((k) => {
        if (coPoMapping[co]?.[k]?.justification?.trim()) mapCount++;
      }),
    );
    const mappingPercent = Math.round(
      (mapCount / (mappingKeys.length * cos.length)) * 100,
    );

    const individualProgress = [detailsPercent, mappingPercent, 0, 0, 0];
    const overallProgress = Math.round(
      individualProgress.reduce((a, b) => a + b, 0) / 5,
    );

    return { individualProgress, overallProgress };
  }, [formData, coPoMapping]);

  return (
    <div className="main-container w-full flex gap-2 min-h-[calc(100vh-160px)] max-h-[calc(100vh-150px)]">
      <div className="w-[30%] border border-gray-300 rounded-md">
        <CoursePlanTab
          tabs={[
            "Course Details",
            "CO-PO Mapping",
            "References",
            "Theory Planner",
            "Lab Planner",
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabProgress={tabStats.individualProgress}
          overallProgress={tabStats.overallProgress}
        />
      </div>
      <div className="form-container border overflow-auto w-[80%] border-gray-300 rounded-md py-2 pl-4 hide-scrollbar">
        {activeTab === 0 && (
          <CourseDetailsForm
            formData={formData}
            setFormData={setFormData}
            onNext={() => setActiveTab(1)}
          />
        )}
        {activeTab === 1 && (
          <CoPoMapping
            coPoMapping={coPoMapping}
            setCoPoMapping={setCoPoMapping}
            onNext={() => setActiveTab(2)}
            onPrev={() => setActiveTab(0)}
          />
        )}
        {activeTab === 2 && (
          <ReferenceTab
            onNext={() => setActiveTab(3)}
            onPrev={() => setActiveTab(1)}
          />
        )}
        {activeTab > 2 && (
          <div className="text-gray-400 text-center mt-20">Coming Soon...</div>
        )}
      </div>
    </div>
  );
};

export default ClassroomSubjectPlanningComponent;
