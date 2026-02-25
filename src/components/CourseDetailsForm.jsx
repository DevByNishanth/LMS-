import { Plus } from "lucide-react";
import React from "react";

const CourseDetailsForm = ({ formData, setFormData, onNext }) => {
  const courseTypeOptions = ["T", "TP", "TPJ", "P", "PJ", "I"];
  const rtblOptions = ["K1", "K2", "K3", "K4", "K5", "K6"];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleObjectiveChange = (index, value) => {
    const updated = [...formData.courseObjectives];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, courseObjectives: updated }));
  };

  const addObjective = () => {
    setFormData((prev) => ({
      ...prev,
      courseObjectives: [...prev.courseObjectives, ""],
    }));
  };

  const handleOutcomeChange = (index, field, value) => {
    const updated = [...formData.courseOutcomes];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, courseOutcomes: updated }));
  };

  return (
    <>
      <form
        className="h-[91%] mb-2 overflow-auto"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="form-content  ">
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
                {courseTypeOptions.map((type) => (
                  <option key={type}>{type}</option>
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
                placeholder="Select co-requisites"
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
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
                {index === formData.courseObjectives.length - 1 && (
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
                  className="col-span-7 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <select
                  value={outcome.rtbl}
                  onChange={(e) =>
                    handleOutcomeChange(index, "rtbl", e.target.value)
                  }
                  className="col-span-3 border border-gray-300 rounded px-2 py-2 text-sm"
                >
                  <option value="">RTBL</option>
                  {rtblOptions.map((rtbl) => (
                    <option key={rtbl}>{rtbl}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </form>
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-[#08384f] text-white px-6 py-2 rounded"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default CourseDetailsForm;
