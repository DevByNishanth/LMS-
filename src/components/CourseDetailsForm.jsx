import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CourseDetailsForm = ({
  data,
  refreshData,
  onNext,
  updateLivePlanningData,
}) => {
  const { classId, sectionId } = useParams();
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    courseType: "",
    coRequisites: "",
    preRequisites: "",
    courseDescription: "",
    courseObjectives: [""],
    courseOutcomes: [
      { unit: "Unit 1", statement: "", rtbl: "K1" },
      { unit: "Unit 2", statement: "", rtbl: "K1" },
      { unit: "Unit 3", statement: "", rtbl: "K1" },
      { unit: "Unit 4", statement: "", rtbl: "K1" },
      { unit: "Unit 5", statement: "", rtbl: "K1" },
    ],
  });

  useEffect(() => {
    if (data) {
      let objectives = [""];
      if (Array.isArray(data.courseObjectives)) {
        objectives = data.courseObjectives.length
          ? data.courseObjectives
          : [""];
      } else if (
        typeof data.courseObjectives === "string" &&
        data.courseObjectives.trim()
      ) {
        objectives = data.courseObjectives.split("\n");
      }

      setFormData({
        courseType: data.courseType || "",
        coRequisites: data.coRequisites || "",
        preRequisites: data.preRequisites || "",
        courseDescription: data.courseDescription || "",
        courseObjectives: objectives,
        courseOutcomes: data.courseOutcomes?.length
          ? data.courseOutcomes
          : formData.courseOutcomes,
      });
    }
  }, [data]);

  const handleLiveUpdate = (updatedState) => {
    setFormData(updatedState);
    updateLivePlanningData(updatedState);
  };

  const handleChange = (field, value) => {
    handleLiveUpdate({ ...formData, [field]: value });
  };

  const handleObjectiveChange = (index, value) => {
    const updated = [...formData.courseObjectives];
    updated[index] = value;
    handleLiveUpdate({ ...formData, courseObjectives: updated });
  };

  const addObjective = () => {
    handleLiveUpdate({
      ...formData,
      courseObjectives: [...formData.courseObjectives, ""],
    });
  };

  const removeObjective = (index) => {
    const updated = formData.courseObjectives.filter((_, i) => i !== index);
    handleLiveUpdate({
      ...formData,
      courseObjectives: updated.length ? updated : [""],
    });
  };

  const handleOutcomeChange = (index, field, value) => {
    const updated = [...formData.courseOutcomes];
    updated[index] = { ...updated[index], [field]: value };
    handleLiveUpdate({ ...formData, courseOutcomes: updated });
  };

  const handleSaveAndNext = async () => {
    setLoading(true);
    try {
      const payload = {
        subjectId: classId,
        sectionId: sectionId,
        data: {
          ...formData,
          courseObjectives: formData.courseObjectives
            .filter((obj) => obj && obj.trim())
            .join("\n"),
        },
      };
      const res = await axios.patch(
        `${apiUrl}api/course-plan/courseDetails`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        await refreshData();
        onNext();
      }
    } catch (err) {
      console.error("Error updating course details:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        className="h-[91%] mb-2 overflow-auto pr-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="form-content">
          <h1 className="font-medium text-lg bg-white sticky top-0 pb-2">
            Course Details
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm">Course Type</label>
              <select
                value={formData.courseType}
                onChange={(e) => handleChange("courseType", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Select type</option>
                {["T", "TP", "TPJ", "P", "PJ", "I"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm">co-requisites</label>
              <input
                type="text"
                value={formData.coRequisites}
                onChange={(e) => handleChange("coRequisites", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm">Pre-requisites</label>
            <input
              type="text"
              value={formData.preRequisites}
              onChange={(e) => handleChange("preRequisites", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm">Course Description</label>
            <textarea
              value={formData.courseDescription}
              onChange={(e) =>
                handleChange("courseDescription", e.target.value)
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm mb-1 block">Course Objective</label>
            {formData.courseObjectives.map((obj, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder={`Objective ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded"
                >
                  <X size={18} />
                </button>
                {index === formData.courseObjectives.length - 1 &&
                  obj.trim() !== "" && (
                    <button
                      type="button"
                      onClick={addObjective}
                      className="bg-[#08384f] text-white rounded p-2"
                    >
                      <Plus size={18} />
                    </button>
                  )}
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="text-sm mb-2 block">Course Outcome</label>
            {formData.courseOutcomes.map((outcome, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                <input
                  type="text"
                  value={outcome.unit}
                  disabled
                  className="col-span-2 border border-gray-300 rounded px-2 py-2 text-sm bg-[#e6e9f5]"
                />
                <input
                  type="text"
                  placeholder="Enter Course Statement"
                  value={outcome.statement}
                  onChange={(e) =>
                    handleOutcomeChange(index, "statement", e.target.value)
                  }
                  className="col-span-8 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <select
                  value={outcome.rtbl}
                  onChange={(e) =>
                    handleOutcomeChange(index, "rtbl", e.target.value)
                  }
                  className="col-span-2 border border-gray-300 rounded px-2 py-2 text-sm"
                >
                  {["K1", "K2", "K3", "K4", "K5", "K6"].map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </form>
      <div className="flex justify-end">
        <button
          onClick={handleSaveAndNext}
          disabled={loading}
          className="bg-[#08384f] text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
    </>
  );
};

export default CourseDetailsForm;
