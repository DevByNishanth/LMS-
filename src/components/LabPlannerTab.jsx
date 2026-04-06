import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  X,
  Edit2,
  Trash2,
  FlaskConical,
  Check,
  AlertTriangle,
} from "lucide-react";

const UNITS = [
  { label: "CO 1", key: "CO1" },
  { label: "CO 2", key: "CO2" },
  { label: "CO 3", key: "CO3" },
  { label: "CO 4", key: "CO4" },
  { label: "CO 5", key: "CO5" },
  { label: "Others", key: "OTHERS" },
];

export default function LabPlannerTab({
  data,
  updateLivePlanningData,
  onNext,
  onPrev,
}) {
  const [selectedUnit, setSelectedUnit] = useState("CO1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTopicIndex, setEditTopicIndex] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [unitTitle, setUnitTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [formData, setFormData] = useState({
    experimentName: "",
    date: "",
  });

  // Sync unit title with the prop 'data' when unit changes
  useEffect(() => {
    setUnitTitle(data?.[selectedUnit]?.title || "");
    setIsEditingTitle(false);
  }, [selectedUnit, data]);

  // Memoize experiments for the currently selected unit
  const currentExperiments = useMemo(() => {
    if (!data || !data[selectedUnit]) return [];
    return Array.isArray(data[selectedUnit].experiments)
      ? data[selectedUnit].experiments
      : [];
  }, [data, selectedUnit]);

  // Helper to push updates to the parent state (ClassroomSubjectPlanningComponent)
  const syncWithParent = (updatedFullLabData) => {
    updateLivePlanningData(updatedFullLabData);
  };

  const handleTitleSubmit = () => {
    const updatedData = { ...data };
    if (!updatedData[selectedUnit]) {
      updatedData[selectedUnit] = { title: "", experiments: [] };
    }
    updatedData[selectedUnit].title = unitTitle;
    syncWithParent(updatedData);
    setIsEditingTitle(false);
  };

  const handleSubmit = () => {
    if (!formData.experimentName || !formData.date) {
      alert("Please fill required fields.");
      return;
    }

    const updatedData = { ...data };
    // Initialize unit object if it's empty/missing
    if (!updatedData[selectedUnit]) {
      updatedData[selectedUnit] = { title: "", experiments: [] };
    }

    const unitExperiments = [...(updatedData[selectedUnit].experiments || [])];

    if (isEditing && editTopicIndex !== null) {
      // Update existing index
      unitExperiments[editTopicIndex] = { ...formData };
    } else {
      // Add new entry
      unitExperiments.push({ ...formData });
    }

    updatedData[selectedUnit].experiments = unitExperiments;
    syncWithParent(updatedData);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    const updatedData = { ...data };
    if (updatedData[selectedUnit]?.experiments) {
      const filtered = updatedData[selectedUnit].experiments.filter(
        (_, i) => i !== deleteIndex
      );
      updatedData[selectedUnit].experiments = filtered;
      syncWithParent(updatedData);
    }
    setIsDeleteModalOpen(false);
  };

  // --- MODAL CONTROLS ---
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ experimentName: "", date: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item, index) => {
    setIsEditing(true);
    setEditTopicIndex(index);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {UNITS.map((unit) => (
            <button
              key={unit.key}
              onClick={() => setSelectedUnit(unit.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all whitespace-nowrap text-sm font-bold ${
                selectedUnit === unit.key
                  ? "bg-[#08384f] text-white shadow-md border-[#08384f]"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <FlaskConical size={14} />
              {unit.label}
            </button>
          ))}
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#08384F] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#062c3e] transition-all shadow-sm text-sm font-bold"
        >
          <Plus size={18} /> Add Experiment
        </button>
      </div>

      {/* Unit Objective Editor */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl text-center">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border border-blue-200">
              <input
                autoFocus
                type="text"
                value={unitTitle}
                onChange={(e) => setUnitTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                className="flex-1 outline-none text-sm font-medium bg-transparent px-2"
                placeholder="Unit description..."
              />
              <button onClick={handleTitleSubmit} className="p-1 text-green-600 hover:bg-green-100 rounded-md">
                <Check size={18} />
              </button>
              <button onClick={() => setIsEditingTitle(false)} className="p-1 text-gray-400 hover:bg-gray-100 rounded-md">
                <X size={18} />
              </button>
            </div>
          ) : (
            <div onClick={() => setIsEditingTitle(true)} className="group cursor-pointer inline-flex items-center gap-3 hover:bg-gray-50 p-2 rounded-md transition-all">
              <h3 className={`text-sm font-semibold ${unitTitle ? "text-gray-700" : "text-gray-300 italic"}`}>
                {unitTitle || "Click to add unit objective..."}
              </h3>
              <Edit2 size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
      </div>

      {/* Experiment Table */}
      <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-4 text-center font-semibold ">#</th>
                <th className="px-6 py-4 text-left font-semibold">Experiment Name</th>
                <th className="w-40 px-6 py-4 text-left font-semibold ">Planned Date</th>
                <th className="w-28 px-4 py-4 text-center font-semibold ">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentExperiments.length > 0 ? (
                currentExperiments.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 text-center font-medium">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium break-words leading-relaxed">{item.experimentName}</td>
                    <td className="px-6 py-4  ">{item.date}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-1">
                        <button onClick={() => openEditModal(item, idx)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => { setDeleteIndex(idx); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400 italic">
                    No experiments added yet for this unit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onPrev} className="px-6 py-2 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-all text-sm">
          Prev
        </button>
        <button onClick={onNext} className="px-8 py-2 bg-[#08384F] text-white font-bold rounded-lg hover:bg-[#062c3e] shadow-md transition-all text-sm">
          Next
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-bold text-gray-800">{isEditing ? "Update" : "New"} Experiment</h2>
              <X className="cursor-pointer text-gray-400 hover:text-red-500" size={20} onClick={() => setIsModalOpen(false)} />
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Experiment Name</label>
                <input
                  name="experimentName"
                  value={formData.experimentName}
                  onChange={(e) => setFormData({...formData, experimentName: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#08384F]/20 focus:border-[#08384F]"
                  placeholder="e.g. Study of Logic Gates"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Planned Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#08384F]/20 focus:border-[#08384F]"
                />
              </div>
            </div>
            <div className="p-5 bg-gray-50 flex justify-end gap-3 rounded-b-xl border-t">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-gray-500 text-sm">Cancel</button>
              <button onClick={handleSubmit} className="bg-[#08384F] text-white px-6 py-2 rounded-lg font-bold shadow-lg text-sm">
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
     {isDeleteModalOpen && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-[210] flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-[380px] overflow-hidden border border-slate-200">
      
      {/* Header Area with subtle red accent */}
      <div className="flex items-start gap-4 p-6">
        <div className="flex-shrink-0 w-10 h-10 bg-red-50 text-red-600 rounded-md flex items-center justify-center border border-red-100">
          <AlertTriangle size={20} strokeWidth={2.5} />
        </div>
        
        <div className="flex-1">
          <h2 className="text-slate-900 text-lg font-semibold leading-tight mb-1">
            Delete Experiment
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Are you sure you want to remove this experiment? This action will update your local plan immediately.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
        <button 
          onClick={() => setIsDeleteModalOpen(false)}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded transition-colors"
        >
          Keep it
        </button>
        
        <button 
          onClick={confirmDelete}
          className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow-sm transition-all active:scale-[0.98]"
        >
          Confirm Delete
        </button>
      </div>
      
    </div>
  </div>
)}
    </div>
  );
}