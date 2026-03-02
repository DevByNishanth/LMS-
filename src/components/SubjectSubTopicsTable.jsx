import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  X,
  Edit2,
  Trash2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { useSearchParams, useParams } from "react-router-dom";

const UNITS = [
  { label: "Unit 1", key: "UNIT1" },
  { label: "Unit 2", key: "UNIT2" },
  { label: "Unit 3", key: "UNIT3" },
  { label: "Unit 4", key: "UNIT4" },
  { label: "Unit 5", key: "UNIT5" },
  { label: "Others", key: "OTHERS" },
];

export default function SubjectSubTopicsTable({
  data,
  refreshData,
  onNext,
  onPrev,
  updateLivePlanningData,
}) {
  const { classId, sectionId } = useParams();
  const [searchParams] = useSearchParams();
  const query_data = JSON.parse(searchParams.get("data") || "{}");
  const subjectId = query_data.subjectId || classId;
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [selectedUnit, setSelectedUnit] = useState("UNIT1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTopicIndex, setEditTopicIndex] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [unitTitle, setUnitTitle] = useState("");

  const [formData, setFormData] = useState({
    topicName: "",
    teachingLanguage: "English",
    date: "",
    hours: "",
    teachingAid: "",
    referenceBook: "",
  });

  useEffect(() => {
    setUnitTitle(data?.[selectedUnit]?.title || "");
    setIsEditingTitle(false);
  }, [selectedUnit, data]);

  const currentTopics = useMemo(() => {
    if (!data || !data[selectedUnit]) return [];
    return Array.isArray(data[selectedUnit].topics)
      ? data[selectedUnit].topics
      : [];
  }, [data, selectedUnit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditTopicIndex(null);
    setFormData({
      topicName: "",
      teachingLanguage: "English",
      date: "",
      hours: "",
      teachingAid: "",
      referenceBook: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item, index) => {
    setIsEditing(true);
    setEditTopicIndex(index);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handlePatchUpdate = async (updatedData) => {
    setLoading(true);
    try {
      const payload = { subjectId, sectionId, data: updatedData };
      const response = await axios.patch(
        `${apiUrl}api/course-plan/theoryPlanner`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200 || response.status === 201) {
        updateLivePlanningData("theoryPlanner", updatedData);
        await refreshData();
        return true;
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to update planner");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleTitleSubmit = async () => {
    const updatedData = { ...data };
    if (!updatedData[selectedUnit])
      updatedData[selectedUnit] = { title: "", topics: [] };
    updatedData[selectedUnit].title = unitTitle;
    const success = await handlePatchUpdate(updatedData);
    if (success) setIsEditingTitle(false);
  };

  const handleSubmit = async () => {
    if (!formData.topicName || !formData.date || !formData.hours) {
      alert("Please fill required fields.");
      return;
    }

    const updatedData = { ...data };
    if (!updatedData[selectedUnit])
      updatedData[selectedUnit] = { title: "", topics: [] };

    const unitTopics = [...(updatedData[selectedUnit].topics || [])];
    if (isEditing && editTopicIndex !== null) {
      unitTopics[editTopicIndex] = { ...formData };
    } else {
      unitTopics.push({ ...formData });
    }

    updatedData[selectedUnit].topics = unitTopics;
    const success = await handlePatchUpdate(updatedData);
    if (success) setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const payload = {
        sectionId,
        subjectId,
        unit: selectedUnit,
        topicIndex: deleteIndex,
      };
      await axios.delete(`${apiUrl}api/course-plan/theoryPlanner/deleteTopic`, {
        headers: { Authorization: `Bearer ${token}` },
        data: payload,
      });
      await refreshData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      alert("Failed to delete topic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <h2 className="font-medium text-lg mb-2 text-[#08384F]">
        Theory Planner
      </h2>

      <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {UNITS.map((unit) => (
            <button
              key={unit.key}
              onClick={() => setSelectedUnit(unit.key)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-200 whitespace-nowrap ${
                selectedUnit === unit.key
                  ? "bg-[#08384f] text-white shadow-md border-[#08384f]"
                  : "bg-[#f1f5f9] text-[#08384f] border-gray-200 hover:bg-gray-200"
              }`}
            >
              <BookOpen size={16} />
              <span className="text-sm font-semibold">{unit.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#08384F] text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-[#062c3e] transition-all shadow-md text-sm font-bold whitespace-nowrap ml-4"
        >
          <Plus size={18} /> Add Topic
        </button>
      </div>

      <div className="mb-4 px-1 flex justify-center w-full">
        <div className="w-2/3 text-center">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={unitTitle}
                onChange={(e) => setUnitTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                className="flex-1 border-b-2 border-[#08384F] outline-none text-md font-medium py-1 text-center bg-transparent"
              />
              <button
                onClick={handleTitleSubmit}
                className="p-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => setIsEditingTitle(false)}
                className="p-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="group cursor-pointer flex items-center justify-center gap-2"
            >
              <h3
                className={`text-md font-medium transition-colors ${unitTitle ? "text-gray-800" : "text-gray-300 italic"}`}
              >
                {unitTitle || "Click to add unit title..."}
              </h3>
              <Edit2
                size={14}
                className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto border border-gray-200 rounded-2xl bg-gray-50/30">
        <table className="w-full text-sm min-w-[1100px] border-collapse">
          <thead>
            <tr className="bg-[#08384F] text-white text-left">
              <th className="px-5 py-4 font-bold w-16 text-center">#</th>
              <th className="px-5 py-4 font-bold min-w-[200px]">Topic Name</th>
              <th className="px-5 py-4 font-bold min-w-[120px]">Language</th>
              <th className="px-5 py-4 font-bold min-w-[120px]">Date</th>
              <th className="px-5 py-4 font-bold min-w-[100px]">Duration</th>
              <th className="px-5 py-4 font-bold min-w-[150px]">
                Teaching Aid
              </th>
              <th className="px-5 py-4 font-bold min-w-[200px]">
                Reference Book
              </th>
              <th className="px-5 py-4 font-bold text-center sticky right-0 bg-[#08384F] shadow-[-4px_0_10px_rgba(0,0,0,0.2)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentTopics.length > 0 ? (
              currentTopics.map((item, idx) => (
                <tr
                  key={idx}
                  className="bg-white hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-5 py-4 text-gray-400 font-bold text-center">
                    {idx + 1}
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-800 break-words max-w-[250px]">
                    {item.topicName}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {item.teachingLanguage}
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-mono text-xs">
                    {item.date}
                  </td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                    {item.hours}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {item.teachingAid}
                  </td>
                  <td className="px-5 py-4 text-gray-600 italic">
                    {item.referenceBook}
                  </td>
                  <td className="px-5 py-4 sticky right-0 bg-white shadow-[-4px_0_10px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openEditModal(item, idx)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteIndex(idx);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-20 text-center text-gray-400 italic font-medium"
                >
                  No topics added for {selectedUnit} yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 bg-white">
        <button
          onClick={onPrev}
          className="bg-gray-100 text-gray-700 font-medium px-6 py-2 rounded-md hover:bg-gray-200 border border-gray-200"
        >
          Prev
        </button>
        <button
          onClick={onNext}
          className="bg-[#08384F] text-white font-medium px-8 py-2 rounded-md shadow-md hover:bg-[#062c3e]"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] md:w-[650px] overflow-hidden text-black animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditing ? "Update Topic" : `New Topic - ${selectedUnit}`}
              </h2>
              <X
                className="cursor-pointer text-gray-400 hover:text-red-500"
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto max-h-[70vh]">
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Topic Name
                </label>
                <input
                  name="topicName"
                  value={formData.topicName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm focus:border-[#08384F] outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Language
                </label>
                <select
                  name="teachingLanguage"
                  value={formData.teachingLanguage}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                  placeholder="e.g. 1 or 45 Minutes"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Teaching Aid
                </label>
                <input
                  name="teachingAid"
                  value={formData.teachingAid}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Reference Book
                </label>
                <input
                  name="referenceBook"
                  value={formData.referenceBook}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-sm font-bold text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#08384F] text-white px-8 py-2 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Topic"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b  text-black">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle size={20} />
                <h2>Confirm Delete</h2>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 hover:bg-[#08384f] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-[#08384f] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <p className="text-gray-600">
                Are you sure you want to delete this topic from{" "}
                <span className="font-bold text-gray-800">{selectedUnit}</span>?
              </p>
              <p className="text-xs text-gray-400 mt-2 italic">
                This action is irreversible.
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border cursor-pointer border-gray-400 rounded-lg text-sm font-medium text-gray-800 hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#08384f] text-white rounded-lg text-sm font-medium cursor-pointer shadow-lg hover:bg-[#08384f] transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
