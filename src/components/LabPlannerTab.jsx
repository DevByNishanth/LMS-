import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, ClipboardList, X, GripVertical } from "lucide-react";;
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const CO_OPTIONS = ["CO1", "CO2", "CO3", "CO4", "CO5"];

const LabPlannerTab = ({ data, updateLivePlanningData, onNext, onPrev }) => {
  const [experiments, setExperiments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    co: "CO1",
    name: "",
    plannedDate: ""
  });

  useEffect(() => {
    if (data?.experiments) {
      setExperiments(data.experiments);
    }
  }, [data]);

  // Handle Drag End Logic
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(experiments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setExperiments(items);
    updateLivePlanningData({ experiments: items });
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData({ co: item.co, name: item.name, plannedDate: item.plannedDate });
      setEditingId(item.id);
    } else {
      setFormData({ co: "CO1", name: "", plannedDate: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveExperiment = () => {
    if (!formData.name.trim()) return alert("Please enter experiment name");

    let updatedList;
    if (editingId) {
      updatedList = experiments.map(exp => 
        exp.id === editingId ? { ...formData, id: editingId } : exp
      );
    } else {
      updatedList = [...experiments, { ...formData, id: Date.now() }];
    }
    
    setExperiments(updatedList);
    updateLivePlanningData({ experiments: updatedList });
    closeModal();
  };

  const deleteRow = (id) => {
    const updated = experiments.filter(exp => exp.id !== id);
    setExperiments(updated);
    updateLivePlanningData({ experiments: updated });
  };

  return (
    <div className="h-full flex flex-col bg-white p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-m font-semibold text-[#08384F] flex items-center gap-2 relative bottom-5">
          Lab Experiment Planner
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-[#08384F] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#062c3e] transition-all shadow-sm"
        >
          <Plus size={18} /> Add Experiment
        </button>
      </div>

      <div className="flex-1 overflow-auto border border-gray-200 rounded-xl shadow-sm">
        <DragDropContext onDragEnd={onDragEnd}>
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <th className="w-10 px-2"></th> {/* Drag Handle Column */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-32">CO</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Experiment Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-40">Planned Date</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase w-24">Actions</th>
              </tr>
            </thead>
            <Droppable droppableId="experiments-list">
              {(provided) => (
                <tbody 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="divide-y divide-gray-100"
                >
                  {experiments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-gray-400">No experiments added.</td>
                    </tr>
                  ) : (
                    experiments.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <tr 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? "bg-blue-50 shadow-lg border-2 border-blue-200" : "bg-white"} transition-colors`}
                          >
                            <td className="px-2 align-middle">
                              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                                <GripVertical size={20} />
                              </div>
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-700">{item.co}</td>
                            <td className="px-4 py-3 text-gray-600 whitespace-pre-wrap">{item.name}</td>
                            <td className="px-4 py-3 text-gray-600">{item.plannedDate || "-"}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-1">
                                <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => deleteRow(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>

      <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-100">
        <button onClick={() => onPrev && onPrev()} className="px-6 py-2 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-all">Previous</button>
        <button onClick={() => onNext && onNext()} className="px-8 py-2 bg-[#08384F] text-white font-medium rounded-lg hover:bg-[#062c3e] transition-all shadow-md">Next</button>
      </div>

      {/* --- MODAL POP-UP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#08384F] p-4 flex justify-between items-center text-white">
              <h3 className="font-semibold text-lg">{editingId ? "Edit Experiment" : "Add New Experiment"}</h3>
              <button onClick={closeModal} className="hover:bg-white/20 p-1 rounded-full"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Outcome</label>
                <select name="co" value={formData.co} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08384F] outline-none">
                  {CO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experiment Name</label>
                <textarea name="name" value={formData.name} onChange={handleFormChange} rows={4} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08384F] outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Planned Date</label>
                <input type="date" name="plannedDate" value={formData.plannedDate} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08384F] outline-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={handleSaveExperiment} className="flex-1 px-4 py-2 bg-[#08384F] text-white rounded-lg hover:bg-[#062c3e] shadow-md font-medium">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabPlannerTab;