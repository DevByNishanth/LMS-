import { Plus, X, CheckCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ReferenceTab = ({ onNext, onPrev }) => {
  const { classId, sectionId } = useParams();
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [references, setReferences] = useState({
    textBooks: [""],
    referenceBooks: [""],
    journals: [""],
    webResources: [""],
    moocCourses: [{ platform: "", name: "" }],
    projects: [""],
    termWork: { enabled: false, activities: [""] },
    gapIdentification: { enabled: false, entries: [""] },
  });

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}api/staff/subject-planning/references/${sectionId}/${classId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.data?.data) setReferences(res.data.data);
      } catch (err) {
        console.error("Error fetching references:", err.message);
      }
    };
    if (classId && sectionId) fetchReferences();
  }, [classId, sectionId, apiUrl, token]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${apiUrl}api/staff/subject-planning/references`,
        { subjectId: classId, sectionId, references },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error saving references:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const addField = (path, index) => {
    const keys = path.split(".");
    let current = references;
    keys.forEach((key) => {
      current = current[key];
    });

    const valueToVerify =
      path === "moocCourses" ? current[index].name : current[index];

    if (valueToVerify.trim() === "") {
      alert("Please fill the current field before adding a new one.");
      return;
    }

    setReferences((prev) => {
      const newData = { ...prev };
      let target = newData;
      for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
      const lastKey = keys[keys.length - 1];
      const newItem =
        lastKey === "moocCourses" ? { platform: "", name: "" } : "";
      target[lastKey] = [...target[lastKey], newItem];
      return newData;
    });
  };

  const removeField = (path, index) => {
    setReferences((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let target = newData;
      for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
      const lastKey = keys[keys.length - 1];
      if (target[lastKey].length > 1) {
        target[lastKey] = target[lastKey].filter((_, i) => i !== index);
      }
      return newData;
    });
  };

  const updateField = (path, index, value, subField = null) => {
    setReferences((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let target = newData;
      for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
      const lastKey = keys[keys.length - 1];
      if (subField) target[lastKey][index][subField] = value;
      else target[lastKey][index] = value;
      return newData;
    });
  };

  const renderSimpleFields = (label, path, placeholder, prefix) => (
    <div className="mb-4">
      <label className="text-sm font-medium mb-1 block">{label}</label>
      {references[path].map((val, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <div className="flex flex-1 items-center border border-gray-300 rounded overflow-hidden">
            {prefix && (
              <span className="bg-[#e6e9f5] px-3 py-2 text-xs font-bold border-r border-gray-300">
                {prefix}
                {idx + 1}
              </span>
            )}
            <input
              type="text"
              className="flex-1 px-3 py-2 text-sm outline-none"
              placeholder={placeholder}
              value={val}
              onChange={(e) => updateField(path, idx, e.target.value)}
            />
            {references[path].length > 1 && (
              <button
                onClick={() => removeField(path, idx)}
                className="px-2 text-red-500 hover:bg-red-50"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {idx === references[path].length - 1 && (
            <button
              onClick={() => addField(path, idx)}
              className="text-blue-900 border border-blue-900 rounded-full p-0.5 hover:bg-blue-50"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col p-2 bg-white relative">
      <div className="flex-1 overflow-auto pr-2 hide-scrollbar">
        {renderSimpleFields(
          "TextBook",
          "textBooks",
          "Enter TextBook Name",
          "T",
        )}
        {renderSimpleFields(
          "ReferenceBook",
          "referenceBooks",
          "Enter ReferenceBook Name",
          "R",
        )}
        {renderSimpleFields("Journals", "journals", "Enter Journals Name")}
        {renderSimpleFields(
          "Web Resources",
          "webResources",
          "Enter Web Resources Name",
        )}

        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">
            MOOC/NPTEL/SWAYAM Courses
          </label>
          {references.moocCourses.map((course, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <div className="flex flex-1 gap-2">
                <input
                  className="w-1/3 border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Platform"
                  value={course.platform}
                  onChange={(e) =>
                    updateField("moocCourses", idx, e.target.value, "platform")
                  }
                />
                <input
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Course Name"
                  value={course.name}
                  onChange={(e) =>
                    updateField("moocCourses", idx, e.target.value, "name")
                  }
                />
              </div>
              {idx === references.moocCourses.length - 1 && (
                <button
                  onClick={() => addField("moocCourses", idx)}
                  className="text-blue-900 border border-blue-900 rounded-full p-0.5"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {renderSimpleFields(
          "List of Projects",
          "projects",
          "Enter Project Name",
        )}

        {[
          {
            label: "Term Work (TW) Activities",
            key: "termWork",
            list: "activities",
          },
          {
            label: "Gap Identification",
            key: "gapIdentification",
            list: "entries",
          },
        ].map((sec) => (
          <div key={sec.key} className="mb-4">
            <label className="text-sm font-medium block">{sec.label}</label>
            <div className="flex gap-4 my-2">
              {["Yes", "No"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-1 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name={sec.key}
                    checked={(opt === "Yes") === references[sec.key].enabled}
                    onChange={() =>
                      setReferences((p) => ({
                        ...p,
                        [sec.key]: { ...p[sec.key], enabled: opt === "Yes" },
                      }))
                    }
                  />{" "}
                  {opt}
                </label>
              ))}
            </div>
            {references[sec.key].enabled &&
              references[sec.key][sec.list].map((val, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <div className="flex flex-1 border border-gray-300 rounded overflow-hidden">
                    <input
                      className="flex-1 px-3 py-2 text-sm outline-none"
                      value={val}
                      onChange={(e) =>
                        updateField(
                          `${sec.key}.${sec.list}`,
                          idx,
                          e.target.value,
                        )
                      }
                    />
                    <button
                      onClick={() => removeField(`${sec.key}.${sec.list}`, idx)}
                      className="px-2 text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {idx === references[sec.key][sec.list].length - 1 && (
                    <button
                      onClick={() => addField(`${sec.key}.${sec.list}`, idx)}
                      className="text-blue-900 border border-blue-900 rounded-full p-0.5"
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onPrev}
          className="bg-gray-200 px-6 py-2 rounded text-sm hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#08384f] text-white px-6 py-2 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Finish"}
        </button>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center gap-4 max-w-sm w-full mx-4">
            <CheckCircle2 size={60} className="text-green-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Plan Saved Successfully!
            </h2>
            <p className="text-gray-500 text-center text-sm">
              Your subject planning data has been updated on the server.
            </p>
            <button
              onClick={onNext}
              className="w-full bg-[#08384f] text-white py-2 rounded mt-2 hover:bg-[#0a4661]"
            >
              Proceed to Lesson Planner
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferenceTab;
