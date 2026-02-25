import React, { useMemo, useState } from "react";
import CoursePlanTab from "./CoursePlanTab";
import CourseDetailsForm from "./CourseDetailsForm";

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

  const [mappingData, setMappingData] = useState([]);
  const [referenceData, setReferenceData] = useState([]);

  const tabProgress = useMemo(() => {
    // Tab 0: Course Details Logic
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
      (v) => v && v.toString().trim() !== "",
    ).length;
    const detailsPercent = Math.round(
      (detailsFilled / detailsValues.length) * 100,
    );

    const mappingPercent = mappingData.length > 0 ? 100 : 0;
    const refPercent = referenceData.length > 0 ? 100 : 0;
    const theoryPercent = 0;
    const labPercent = 0;

    const allTabs = [
      detailsPercent,
      mappingPercent,
      refPercent,
      theoryPercent,
      labPercent,
    ];
    const overallProgress = Math.round(
      allTabs.reduce((a, b) => a + b, 0) / allTabs.length,
    );

    return {
      individual: allTabs,
      overall: overallProgress,
    };
  }, [formData, mappingData, referenceData]);

  return (
    <div className="main-container w-full flex gap-2 min-h-[calc(100vh-160px)] max-h-[calc(100vh-150px)] ">
      <div className="w-[30%] border border-gray-300 rounded-md ">
        <CoursePlanTab
          tabProgress={tabProgress.individual}
          overallProgress={tabProgress.overall}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="form-container border overflow-auto w-[80%] border-gray-300 rounded-md py-2 px-4 hide-scrollbar">
        {activeTab === 0 && (
          <CourseDetailsForm
            formData={formData}
            setFormData={setFormData}
            onNext={() => setActiveTab(1)}
          />
        )}
        {activeTab !== 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>Content for Tab {activeTab + 1} coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomSubjectPlanningComponent;
