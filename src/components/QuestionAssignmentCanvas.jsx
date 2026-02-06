import React, { useState } from "react";
import { X, Paperclip, Link, Youtube, Plus, Upload, Trash2, FileText } from "lucide-react";
import AssignmentResourceModal from "./AssignmentResourceModal";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function QuestionAssignmentCanvas({
    setIsAssignmentModalOpen,
    onClose
}) {
    const { classId } = useParams();
    const [selectedAttachmentOption, setSelectedAttachmentOption] = useState(null);
    const [openingFrom, setOpeningFrom] = useState("QuestionModal");

    const [formData, setFormData] = useState({
        title: "",
        questionType: "Short Answer", // Default to Short Answer
        instruction: "",
        dueDate: "",
    });

    const [options, setOptions] = useState(["", ""]); // Default 2 empty options for Multiple Choice
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, ""]);
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
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
        if (!formData.title.trim()) newErrors.title = "Question Title is required";
        if (!formData.instruction.trim()) newErrors.instruction = "Instruction is required";
        if (!formData.dueDate) newErrors.dueDate = "Due Date is required";

        // Validate options if Multiple Choice
        // Validate options if Multiple Choice
        if (formData.questionType === "Multiple Choice") {
            if (options.some(opt => !opt.trim())) {
                newErrors.options = "All options/choices must be filled";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const data = new FormData();
        data.append("subjectId", classId);
        data.append("title", formData.title);
        data.append("instruction", formData.instruction);
        data.append("dueDate", formData.dueDate);

        // Map UI questionType to Backend expected values if needed. 
        // Assuming backend expects "Descriptive" for "Short Answer" based on user table example
        // and maybe "Multiple Choice" for others.
        // However, user prompt logic says:
        // | questionType | Text | Descriptive |
        // If Short Answer => Descriptive
        // If Multiple Choice => Multiple Choice (Assumed)

        const backendQuestionType = formData.questionType === "Short Answer" ? "Single Choice" : "Multiple Choice";
        data.append("questionType", backendQuestionType);

        // Append options for all types
        options.forEach((opt, index) => {
            data.append(`options[${index}]`, opt);
        });

        // Separate resources
        const linkResource = resources.find(r => r.type === 'link');
        const youtubeResource = resources.find(r => r.type === 'youtube link');

        if (linkResource) {
            data.append("link", linkResource.value);
        }

        if (youtubeResource) {
            data.append("youtubeLink", youtubeResource.value);
        }

        // Append files
        resources.forEach(r => {
            if (r.type === 'upload') {
                data.append("attachments", r.value);
            }
        });

        try {
            const token = localStorage.getItem("LmsToken");
            await axios.post(`${import.meta.env.VITE_API_URL}api/staff/question`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            // Success
            setIsAssignmentModalOpen(false);
            if (onClose) onClose();
        } catch (error) {
            console.error("Error creating question assignment:", error);
            alert("Failed to create question assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white absolute top-0 right-0 w-[90%] md:w-[40%] h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-lg font-medium">Question</h2>
                    <button
                        onClick={() => setIsAssignmentModalOpen(false)}
                        className="btn-container bg-gray-200 w-8 h-8 flex items-center hover:bg-gray-300 justify-center rounded-full cursor-pointer"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    className="px-5 py-4 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto"
                >
                    {/* Title */}
                    <div>
                        <label className="text-md text-gray-600 font-medium mb-2">
                            Question Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full border ${errors.title ? "border-red-500" : "border-gray-400"} rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#000000]`}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    {/* Question Type */}
                    <div>
                        <label className="text-md text-gray-600 font-medium mb-2">
                            Question Type
                        </label>
                        <select
                            name="questionType"
                            value={formData.questionType}
                            onChange={handleChange}
                            className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#000000]"
                        >
                            <option value="Short Answer">Short Answer</option>
                            <option value="Multiple Choice">Multiple Choice</option>
                        </select>
                    </div>

                    {/* Instruction */}
                    <div>
                        <label className="text-md text-gray-600 font-medium mb-2">
                            Instruction
                        </label>
                        <textarea
                            name="instruction"
                            value={formData.instruction}
                            onChange={handleChange}
                            rows={5}
                            className={`w-full border ${errors.instruction ? "border-red-500" : "border-gray-400"} rounded px-3 py-2 mt-1 resize-none focus:outline-none focus:ring-1 focus:ring-[#000000]`}
                        />
                        {errors.instruction && <p className="text-red-500 text-xs mt-1">{errors.instruction}</p>}
                    </div>

                    {/* Multiple Choice Options */}
                    {formData.questionType === "Multiple Choice" && (
                        <div className="space-y-2">
                            <label className="text-md text-gray-600 font-medium mb-2">
                                Options
                            </label>
                            {options.map((option, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <div className="w-4 h-4 rounded-full border border-gray-400 shrink-0"></div>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1 border-b border-gray-300 py-1 focus:border-[#0B56A4] focus:outline-none"
                                    />
                                    {options.length > 2 && (
                                        <button type="button" onClick={() => removeOption(index)}>
                                            <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addOption}
                                className="text-[#0B56A4] text-sm font-medium hover:underline mt-2 flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add Option
                            </button>
                            {errors.options && <p className="text-red-500 text-xs mt-1">{errors.options}</p>}
                        </div>
                    )}

                    {/* Attach */}
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
                                    <Upload className="w-4 h-4" />
                                </div>
                                Upload
                            </div>
                        </div>
                    </div>

                    {/* Resources Preview */}
                    {resources.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-600">Attached Resources</p>
                            {resources.map((res, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-2">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {res.type === 'link' && <Link className="w-4 h-4 text-blue-500 shrink-0" />}
                                        {res.type === 'youtube link' && <Youtube className="w-4 h-4 text-red-500 shrink-0" />}
                                        {res.type === 'upload' && <FileText className="w-4 h-4 text-gray-500 shrink-0" />}

                                        <span className="text-sm text-gray-700 truncate">
                                            {res.type === 'upload' ? res.value.name : res.value}
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

                    {/* Due Date */}
                    <div>
                        <label className="text-sm text-gray-600 mb-2">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className={`w-full border ${errors.dueDate ? "border-red-500" : "border-gray-400"} rounded px-3 py-2 mt-1 focus:outline-none`}
                        />
                        {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
                    </div>

                </form>
                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 py-5 px-6 absolute bottom-0 w-full ">
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
                        className="px-4 py-2 cursor-pointer rounded bg-[#0B56A4] text-white hover:opacity-90 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            {/* modal  */}

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
