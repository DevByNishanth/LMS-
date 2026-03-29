import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CoursePlanTab from "./CoursePlanTab";
import CourseDetailsForm from "./CourseDetailsForm";
import CoPoMapping from "./CoPoMapping";
import ReferenceTab from "./ReferenceTab";
import SubjectSubTopicsTable from "./SubjectSubTopicsTable";
import DownloadPdf from "./DownloadPdf";
import LabPlannerTab from "./LabPlannerTab";
import SubjectPlanner from "./SubjectPlanner";

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

  const getNextTab = useCallback((current, direction) => {
    const type = planningData?.courseDetails?.courseType || "";
    const hasTheory = ["T", "TP", "TPJ"].some(t => type.includes(t)) || type === "I";
    const hasLab = ["P", "PJ", "TPJ", "TP"].some(p => type.includes(p)) || type === "I";

    let next = current + direction;

    // Skip Theory Planner (Index 3) if not a Theory type
    if (next === 3 && !hasTheory) next += direction;

    // Skip Lab Planner (Index 4) if not a Lab/Practical type
    if (next === 4 && !hasLab) next += direction;

    // Bound checks
    return Math.max(0, Math.min(next, 6));
  }, [planningData]);

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
      "PO12",
      "PSO1",
      "PSO2",
      "PSO3",
    ];
    const cos = ["CO1", "CO2", "CO3", "CO4", "CO5"];
    let mapCount = 0;
    cos.forEach((co) =>
      mappingKeys.forEach((k) => {
        const entry = mapping[co]?.[k];
        if (entry?.credit > 0 && entry?.justification?.trim()) mapCount++;
      }),
    );
    const mappingPercent = Math.round(
      (mapCount / (mappingKeys.length * cos.length)) * 100,
    );

    const refs = planningData.references || {};
    const refCategories = [
      (refs.textBooks || []).some((v) => v?.trim()),
      (refs.referenceBooks || []).some((v) => v?.trim()),
      (refs.journals || []).some((v) => v?.trim()),
      (refs.webResources || []).some((v) => v?.trim()),
      (refs.moocCourses || []).some(
        (m) => m.courseName?.trim() && m.platform?.trim(),
      ),
      (refs.projects || []).some((v) => v?.trim()),
    ];
    const categoriesFilled = refCategories.filter(Boolean).length;
    const refPercent = Math.round((categoriesFilled / 6) * 100);

    const tp = planningData.theoryPlanner || {};
    const theoryUnitsToCheck = ["UNIT1", "UNIT2", "UNIT3", "UNIT4", "UNIT5"];
    const unitsFilled = theoryUnitsToCheck.filter((u) => {
      const unitEntry = tp[u];
      const topics = Array.isArray(unitEntry) ? unitEntry : unitEntry?.topics;
      return Array.isArray(topics) && topics.length > 0;
    }).length;
    const theoryPercent = Math.round((unitsFilled / 5) * 100);

    const individualProgress = [
      detailsPercent,
      mappingPercent,
      refPercent,
      theoryPercent,
      0,
    ];
    const overallProgress = Math.round(
      individualProgress.reduce((a, b) => a + b, 0) / 5,
    );

    return { individualProgress, overallProgress };
  }, [planningData]);

  if (loading && !planningData)
    return (
      <div className="p-10 text-center font-medium">
        Loading Planning Data...
      </div>
    );

  return (
    <div className="main-container w-full flex gap-2 min-h-[calc(100vh-160px)] max-h-[calc(100vh-150px)] p-2">
      <div className="w-[25%] border border-gray-300 rounded-md bg-white">
        <CoursePlanTab
          tabs={[
            "Course Details",
            "CO-PO Mapping",
            "References",
            "Theory Planner",
            "Lab Planner",
            "Subject Planner",
            "Get Course Plan",
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabProgress={tabStats.individualProgress}
          overallProgress={tabStats.overallProgress}
          courseType={planningData?.courseDetails?.courseType}
        />
      </div>
      <div className="form-container border overflow-auto w-[75%] border-gray-300 rounded-md py-4 px-4 bg-white hide-scrollbar">
        {activeTab === 0 && (
          <CourseDetailsForm
            data={planningData?.courseDetails}
            refreshData={fetchAllData}
            updateLivePlanningData={(val) =>
              updateLivePlanningData("courseDetails", val)
            }
            onNext={() => setActiveTab(getNextTab(0, 1))}
          />
        )}
        {activeTab === 1 && (
          <CoPoMapping
            data={planningData?.coPoMapping}
            refreshData={fetchAllData}
            updateLivePlanningData={(val) =>
              updateLivePlanningData("coPoMapping", val)
            }
            onNext={() => setActiveTab(getNextTab(1, 1))}
            onPrev={() => setActiveTab(getNextTab(1, -1))}
          />
        )}
        {activeTab === 2 && (
          <ReferenceTab
            refreshData={fetchAllData}
            onNext={() => setActiveTab(getNextTab(2, 1))}
            onPrev={() => setActiveTab(getNextTab(2, -1))}
          />
        )}
        {activeTab === 3 && (
          <SubjectSubTopicsTable
            data={planningData?.theoryPlanner}
            references={planningData?.references}
            refreshData={fetchAllData}
            updateLivePlanningData={(val) =>
              updateLivePlanningData("theoryPlanner", val)
            }
            onNext={() => setActiveTab(getNextTab(3, 1))}
            onPrev={() => setActiveTab(getNextTab(3, -1))}
          />
        )}
        {activeTab === 4 && (
          <LabPlannerTab
              data={planningData?.labPlanner}
              refreshData={fetchAllData}
              updateLivePlanningData={(val) =>
                updateLivePlanningData("labPlanner", val)
              }
              onNext={() => setActiveTab(getNextTab(4, 1))}
              onPrev={() => setActiveTab(getNextTab(4, -1))}
          />
        )}
        {
          activeTab===5 && (
            <SubjectPlanner
              onNext={() => setActiveTab(getNextTab(5, 1))}
              onPrev={() => setActiveTab(getNextTab(5, -1))}
            />
          )
        }
        {activeTab == 6 && <DownloadPdf />}
      </div>
    </div>
  );
};

export default ClassroomSubjectPlanningComponent;
