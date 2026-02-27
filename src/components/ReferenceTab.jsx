import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ReferenceTab = ({
  data,
  refreshData,
  onNext,
  onPrev,
  updateLivePlanningData,
}) => {
  const { classId, sectionId } = useParams();
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  const initialStructure = {
    textBooks: [""],
    referenceBooks: [""],
    journals: [""],
    webResources: [""],
    moocCourses: [{ platform: "", courseName: "" }],
    projects: [""],
    termWork: { enabled: false, activities: [""] },
    gapIdentification: { enabled: false, entries: [""] },
  };

  const [references, setReferences] = useState(initialStructure);

  useEffect(() => {
    if (data) {
      setReferences({
        textBooks: data.textBooks?.length ? data.textBooks : [""],
        referenceBooks: data.referenceBooks?.length
          ? data.referenceBooks
          : [""],
        journals: data.journals?.length ? data.journals : [""],
        webResources: data.webResources?.length ? data.webResources : [""],
        moocCourses: data.moocCourses?.length
          ? data.moocCourses
          : [{ platform: "", courseName: "" }],
        projects: data.projects?.length ? data.projects : [""],
        termWork: data.termWork || initialStructure.termWork,
        gapIdentification:
          data.gapIdentification || initialStructure.gapIdentification,
      });
    }
  }, [data]);

  const handleLiveUpdate = (updatedState) => {
    setReferences(updatedState);
    updateLivePlanningData(updatedState);
  };

  const updateField = (path, index, value, subField = null) => {
    const newData = JSON.parse(JSON.stringify(references));
    const keys = path.split(".");
    let target = newData;
    for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
    const lastKey = keys[keys.length - 1];

    if (subField) target[lastKey][index][subField] = value;
    else target[lastKey][index] = value;

    handleLiveUpdate(newData);
  };

  const addField = (path, index) => {
    const keys = path.split(".");
    let target = references;
    keys.forEach((key) => {
      target = target[key];
    });

    const currentItem = target[index];
    const isEmpty =
      typeof currentItem === "object"
        ? !currentItem.platform?.trim() || !currentItem.courseName?.trim()
        : !currentItem?.trim();

    if (isEmpty) {
      alert("Please fill the current field before adding a new one.");
      return;
    }

    const newData = JSON.parse(JSON.stringify(references));
    let innerTarget = newData;
    for (let i = 0; i < keys.length - 1; i++)
      innerTarget = innerTarget[keys[i]];
    const lastKey = keys[keys.length - 1];

    const newItem =
      lastKey === "moocCourses" ? { platform: "", courseName: "" } : "";
    innerTarget[lastKey] = [...innerTarget[lastKey], newItem];
    handleLiveUpdate(newData);
  };

  const removeField = (path, index) => {
    const newData = JSON.parse(JSON.stringify(references));
    const keys = path.split(".");
    let target = newData;
    for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
    const lastKey = keys[keys.length - 1];

    if (target[lastKey].length > 1) {
      target[lastKey].splice(index, 1);
      handleLiveUpdate(newData);
    }
  };

  const toggleSection = (key, value) => {
    const newData = {
      ...references,
      [key]: { ...references[key], enabled: value },
    };
    handleLiveUpdate(newData);
  };

  const handleSaveAndNext = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${apiUrl}api/course-plan/references`,
        {
          subjectId: classId,
          sectionId,
          data: references,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        await refreshData();
        onNext();
      }
    } catch (err) {
      console.error("Error saving references:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSimpleFields = (label, path, placeholder, prefix) => (
    <div className="mb-4">
      <label className="text-sm font-medium mb-1 block text-gray-700">
        {label}
      </label>
      {references[path].map((val, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <div className="flex flex-1 items-center border border-gray-300 rounded overflow-hidden bg-white">
            {prefix && (
              <span className="bg-[#e6e9f5] px-3 py-2 text-xs font-bold border-r border-gray-300 text-gray-600 min-w-[45px] text-center">
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
                className="px-2 text-red-400 hover:bg-red-50"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {idx === references[path].length - 1 && (
            <button
              onClick={() => addField(path, idx)}
              className="text-[#08384f] border border-[#08384f] rounded-full p-0.5 hover:bg-gray-100"
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
          <label className="text-sm font-medium mb-1 block text-gray-700">
            MOOC/NPTEL/SWAYAM Courses
          </label>
          {references.moocCourses.map((course, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <div className="flex flex-1 gap-2">
                <input
                  className="w-1/3 border border-gray-300 rounded px-3 py-2 text-sm outline-none"
                  placeholder="Platform"
                  value={course.platform}
                  onChange={(e) =>
                    updateField("moocCourses", idx, e.target.value, "platform")
                  }
                />
                <input
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none"
                  placeholder="Course Name"
                  value={course.courseName}
                  onChange={(e) =>
                    updateField(
                      "moocCourses",
                      idx,
                      e.target.value,
                      "courseName",
                    )
                  }
                />
              </div>
              {idx === references.moocCourses.length - 1 && (
                <button
                  onClick={() => addField("moocCourses", idx)}
                  className="text-[#08384f] border border-[#08384f] rounded-full p-0.5"
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
          <div key={sec.key} className="mb-6">
            <label className="text-sm font-medium block text-gray-700 mb-2">
              {sec.label}
            </label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={references[sec.key].enabled}
                  onChange={() => toggleSection(sec.key, true)}
                />{" "}
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={!references[sec.key].enabled}
                  onChange={() => toggleSection(sec.key, false)}
                />{" "}
                No
              </label>
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
                    {references[sec.key][sec.list].length > 1 && (
                      <button
                        onClick={() =>
                          removeField(`${sec.key}.${sec.list}`, idx)
                        }
                        className="px-2 text-red-400"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {idx === references[sec.key][sec.list].length - 1 && (
                    <button
                      onClick={() => addField(`${sec.key}.${sec.list}`, idx)}
                      className="text-[#08384f] border border-[#08384f] rounded-full p-0.5"
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
        <button
          onClick={onPrev}
          className="bg-gray-100 px-6 py-2 rounded text-sm text-gray-700"
        >
          Previous
        </button>
        <button
          onClick={handleSaveAndNext}
          disabled={loading}
          className="bg-[#08384f] text-white px-6 py-2 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default ReferenceTab;
