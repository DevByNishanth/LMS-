import React, { useMemo, useState } from "react";
import CoursePlanTab from "./CoursePlanTab";
import CourseDetailsForm from "./CourseDetailsForm";
import CoPoMapping from "./CoPoMapping";

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

  const tabStats = useMemo(() => {
    const detailsValues = [
      formData.courseType,
      formData.coRequisites,
      formData.preRequisites,
      formData.courseDescription,
      ...formData.courseObjectives,
      ...formData.courseOutcomes.map((o) => o.statement),
      ...formData.courseOutcomes.map((o) => o.rtbl),
    ];
    const detailsFilled = detailsValues.filter(
      (v) => v && v.trim() !== "",
    ).length;
    const detailsPercent = Math.round(
      (detailsFilled / detailsValues.length) * 100,
    );

    const mappingKeys = [
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
    const cos = ["C01", "C02", "C03", "C04", "C05"];
    let mappingFilledCount = 0;
    cos.forEach((co) => {
      mappingKeys.forEach((key) => {
        if (coPoMapping[co]?.[key]?.justification?.trim()) mappingFilledCount++;
      });
    });
    const mappingTotal = mappingKeys.length * cos.length;
    const mappingPercent = Math.round(
      (mappingFilledCount / mappingTotal) * 100,
    );

    const individualProgress = [detailsPercent, mappingPercent, 0, 0, 0];
    const overallProgress = Math.round(
      individualProgress.reduce((a, b) => a + b, 0) / individualProgress.length,
    );

    return { individualProgress, overallProgress };
  }, [formData, coPoMapping]);

  const tabs = [
    "Course Details",
    "CO-PO and CO-PSO Mapping",
    "Reference and others",
    "Lesson Planner ( Theory )",
    "Lesson Planner ( Lab )",
  ];

  return (
    <div className="main-container w-full flex gap-2 min-h-[calc(100vh-160px)] max-h-[calc(100vh-150px)] ">
      <div className="w-[30%] border border-gray-300 rounded-md ">
        <CoursePlanTab
          tabs={tabs}
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
        {activeTab > 1 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Content for {tabs[activeTab]} coming soon...
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomSubjectPlanningComponent;
