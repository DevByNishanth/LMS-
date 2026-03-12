import { useState } from "react";
import {
  X,
  Paperclip,
  Link,
  Youtube,
  Plus,
  Upload,
  Trash2,
  FileText,
} from "lucide-react";
import AssignmentResourceModal from "./AssignmentResourceModal";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AddAssignmentModal({
  onClose,
  setIsAssignmentModalOpen,
}) {
  const { classId, sectionId } = useParams();
  const [selectedAttachmentOption, setSelectedAttachmentOption] =
    useState(null);

  const [openingFrom, setOpeningFrom] = useState("AssignmentModal");

  const [formData, setFormData] = useState({
    title: "",
    instruction: "",
    questions: "",
    dueDate: "",
    marks: "",
  });

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "marks") {
      const numValue = parseInt(value);
      if (numValue > 100) return;
      if (numValue < 0) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleResourceSubmit = (resource) => {
    setResources((prev) => [...prev, resource]);
    setSelectedAttachmentOption(null);
  };

  const removeResource = (index) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.instruction.trim())
      newErrors.instruction = "Instruction is required";
    if (!formData.dueDate) newErrors.dueDate = "Due Date is required";
    if (!formData.marks) newErrors.marks = "Marks are required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const data = new FormData();
    data.append("subjectId", classId);
    data.append("sectionId", sectionId);
    data.append("title", formData.title);
    data.append("instruction", formData.instruction);
    data.append("questions", formData.questions);
    data.append("dueDate", formData.dueDate);
    data.append("marks", formData.marks);

    const linkResource = resources.find((r) => r.type === "link");
    const youtubeResource = resources.find((r) => r.type === "youtube link");

    if (linkResource) {
      data.append("link", linkResource.value);
    }

    if (youtubeResource) {
      data.append("youtubeLink", youtubeResource.value);
    }

    resources.forEach((r) => {
      if (r.type === "upload") {
        data.append("attachments", r.value);
      }
    });

    try {
      const token = localStorage.getItem("LmsToken");
      await axios.post(`${import.meta.env.VITE_API_URL}api/assignment`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setIsAssignmentModalOpen(false);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white absolute top-0 right-0 w-[90%] md:w-[40%] h-full">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-medium">Assignment</h2>
          <button
            onClick={() => setIsAssignmentModalOpen(false)}
            className="btn-container bg-gray-200 w-8 h-8 flex items-center hover:bg-gray-300 justify-center rounded-full cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-5 py-4 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto"
        >
          <div>
            <label className="text-md text-gray-600 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border ${errors.title ? "border-red-500" : "border-gray-400"} rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#000000]`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="text-md text-gray-600 font-medium mb-2">
              Marks (Max 100)
            </label>
            <input
              type="number"
              name="marks"
              min="0"
              max="100"
              value={formData.marks}
              onChange={handleChange}
              className={`w-full border ${errors.marks ? "border-red-500" : "border-gray-400"} rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#000000]`}
            />
            {errors.marks && (
              <p className="text-red-500 text-xs mt-1">{errors.marks}</p>
            )}
          </div>

          <div>
            <label className="text-md text-gray-600 font-medium mb-2">
              Instruction
            </label>
            <textarea
              name="instruction"
              value={formData.instruction}
              onChange={handleChange}
              rows={3}
              className={`w-full border ${errors.instruction ? "border-red-500" : "border-gray-400"} rounded px-3 py-2 mt-1 resize-none focus:outline-none focus:ring-1 focus:ring-[#000000]`}
            />
            {errors.instruction && (
              <p className="text-red-500 text-xs mt-1">{errors.instruction}</p>
            )}
          </div>

          <div>
            <label className="text-md text-gray-600 font-medium mb-2">
              Questions
            </label>
            <textarea
              name="questions"
              value={formData.questions}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-400 rounded px-3 py-2 mt-1 resize-none focus:outline-none focus:ring-1 focus:ring-[#000000]"
              placeholder="Enter your questions here..."
            />
          </div>

          <div>
            <p className="text-md text-gray-600 font-medium mb-4">Attach Any</p>
            <div className="flex gap-6 text-xs text-gray-600">
              <div
                onClick={() => setSelectedAttachmentOption("link")}
                className="flex flex-col items-center gap-1 cursor-pointer hover:text-black hover:font-medium"
              >
                <div className="icon-container bg-[#FAFAFA] border border-gray-400 rounded-full w-10 h-10 flex items-center justify-center">
                  <Link className="w-4 h-4" />
                </div>
                Link
              </div>
              <div
                onClick={() => setSelectedAttachmentOption("drive")}
                className="flex flex-col items-center gap-1 cursor-pointer hover:text-black hover:font-medium"
              >
                <div className="icon-container bg-[#FAFAFA] border border-gray-400 rounded-full w-10 h-10 flex items-center justify-center">
                  <Paperclip className="w-4 h-4" />
                </div>
                Drive
              </div>
              <div
                onClick={() => setSelectedAttachmentOption("youtube link")}
                className="flex flex-col items-center gap-1 cursor-pointer hover:text-black hover:font-medium"
              >
                <div className="icon-container bg-[#FAFAFA] border border-gray-400 rounded-full w-10 h-10 flex items-center justify-center">
                  <Youtube className="w-4 h-4" />
                </div>
                Youtube
              </div>
              <div
                onClick={() => setSelectedAttachmentOption("upload")}
                className="flex flex-col items-center gap-1 cursor-pointer hover:text-black hover:font-medium"
              >
                <div className="icon-container bg-[#FAFAFA] border border-gray-400 rounded-full w-10 h-10 flex items-center justify-center">
                  <Upload className="w-4 h-4 " />
                </div>
                Upload
              </div>
            </div>
          </div>

          {resources.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">
                Attached Resources
              </p>
              {resources.map((res, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-2"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {res.type === "link" && (
                      <Link className="w-4 h-4 text-blue-500 shrink-0" />
                    )}
                    {res.type === "youtube link" && (
                      <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    {res.type === "upload" && (
                      <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                    )}

                    <span className="text-sm text-gray-700 truncate">
                      {res.type === "upload" ? res.value.name : res.value}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeResource(idx)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="text-sm text-gray-600 mb-2">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full border ${errors.dueDate ? "border-red-500" : "border-gray-400"} rounded px-3 py-2 mt-1 focus:outline-none`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
            )}
          </div>
        </form>

        <div className="flex justify-end gap-3 py-5 px-6 absolute bottom-0 w-full bg-white border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsAssignmentModalOpen(false)}
            className="px-4 py-2 border border-gray-400 rounded cursor-pointer bg-[#FAFAFA] text-black hover:opacity-90"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            className="px-4 py-2 cursor-pointer rounded bg-[#08384F] text-white hover:opacity-90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {selectedAttachmentOption && (
        <AssignmentResourceModal
          selectedAttachmentOption={selectedAttachmentOption}
          setSelectedAttachmentOption={setSelectedAttachmentOption}
          openingFrom={openingFrom}
          setOpeningFrom={setOpeningFrom}
          onSubmit={handleResourceSubmit}
        />
      )}
    </div>
  );
}