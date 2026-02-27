import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CoursePlanTab from "./CoursePlanTab";
import CourseDetailsForm from "./CourseDetailsForm";
import CoPoMapping from "./CoPoMapping";
import ReferenceTab from "./ReferenceTab";
import SubjectSubTopicsTable from "./SubjectSubTopicsTable";

const ClassroomSubjectPlanningComponent = () => {
  const { classId, sectionId } = useParams();
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [planningData, setPlanningData] = useState(null);

  const fetchAllData = useCallback(async () => {
    if (!classId || !sectionId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}api/course-plan/all/${sectionId}/${classId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.data) {
        setPlanningData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching all data:", err);
    } finally {
      setLoading(false);
    }
  }, [classId, sectionId, apiUrl, token]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const updateLivePlanningData = useCallback((key, updatedValue) => {
    setPlanningData((prev) => ({
      ...prev,
      [key]: updatedValue,
    }));
  }, []);

  const tabStats = useMemo(() => {
    if (!planningData)
      return { individualProgress: [0, 0, 0, 0, 0], overallProgress: 0 };

    const details = planningData.courseDetails || {};

    // FIX: Check if courseObjectives is already an array from live updates
    const rawObjectives = details.courseObjectives;
    const objectivesArray = Array.isArray(rawObjectives)
      ? rawObjectives
      : typeof rawObjectives === "string"
        ? rawObjectives.split("\n")
        : [];

    const detailsValues = [
      details.courseType,
      details.coRequisites,
      details.preRequisites,
      details.courseDescription,
      ...objectivesArray,
      ...(details.courseOutcomes?.map((o) => o.statement) || []),
    ];
    const detailsFilled = detailsValues.filter((v) => v?.trim()).length;
    const detailsPercent = Math.round(
      (detailsFilled / Math.max(detailsValues.length, 1)) * 100,
    );

    const mapping = planningData.coPoMapping || {};
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
        if (mapping[co]?.[k]?.justification?.trim()) mapCount++;
      }),
    );
    const mappingPercent = Math.round(
      (mapCount / (mappingKeys.length * cos.length)) * 100,
    );

    const refs = planningData.references || {};
    const refValues = [
      ...(refs.textBooks || []),
      ...(refs.referenceBooks || []),
      ...(refs.journals || []),
      ...(refs.webResources || []),
      ...(refs.moocCourses?.map((m) => m.courseName) || []),
      ...(refs.projects || []),
    ];
    const refFilled = refValues.filter((v) => v?.trim()).length;
    const refPercent = Math.min(Math.round((refFilled / 6) * 100), 100);

    const individualProgress = [
      detailsPercent,
      mappingPercent,
      refPercent,
      0,
      0,
    ];
    const overallProgress = Math.round(
      individualProgress.reduce((a, b) => a + b, 0) / 5,
    );

    return { individualProgress, overallProgress };
  }, [planningData]);

  if (loading && !planningData)
    return <div className="p-10">Loading Planning Data...</div>;

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
            data={planningData?.courseDetails}
            refreshData={fetchAllData}
            updateLivePlanningData={(val) =>
              updateLivePlanningData("courseDetails", val)
            }
            onNext={() => setActiveTab(1)}
          />
        )}
        {activeTab === 1 && (
          <CoPoMapping
            data={planningData?.coPoMapping}
            refreshData={fetchAllData}
            updateLivePlanningData={(val) =>
              updateLivePlanningData("coPoMapping", val)
            }
            onNext={() => setActiveTab(2)}
            onPrev={() => setActiveTab(0)}
          />
        )}
        {activeTab === 2 && (
          <ReferenceTab
            data={planningData?.references}
            refreshData={fetchAllData}
            updateLivePlanningData={(val) =>
              updateLivePlanningData("references", val)
            }
            onNext={() => setActiveTab(3)}
            onPrev={() => setActiveTab(1)}
          />
        )}
        {activeTab === 3 && (
          <div className="text-gray-400 text-center mt-20">
            <SubjectSubTopicsTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomSubjectPlanningComponent;
