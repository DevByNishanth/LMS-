import { useState } from "react";
import { X, Paperclip, Link, Youtube, Upload, Trash2, FileText } from "lucide-react";
import AssignmentResourceModal from "./AssignmentResourceModal";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AddMaterialModal({
    onClose,
    setIsMaterialModalOpen,
}) {
    const { classId } = useParams();
    const [selectedAttachmentOption, setSelectedAttachmentOption] = useState(null);
    const [openingFrom, setOpeningFrom] = useState("MaterialModal");

    const [formData, setFormData] = useState({
        title: "",
        instruction: "",
    });

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
        if (!formData.instruction.trim()) newErrors.instruction = "Instruction is required";
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

        const linkResource = resources.find(r => r.type === 'link');
        const youtubeResource = resources.find(r => r.type === 'youtube link');

        if (linkResource) {
            data.append("link", linkResource.value);
        }

        if (youtubeResource) {
            data.append("youtubeLink", youtubeResource.value);
        }

        resources.forEach(r => {
            if (r.type === 'upload') {
                data.append("attachments", r.value);
            }
        });

        try {
            const token = localStorage.getItem("LmsToken");
            await axios.post(`${import.meta.env.VITE_API_URL}api/material`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            setIsMaterialModalOpen(false);
            if (onClose) onClose();
        } catch (error) {
            console.error("Error creating material:", error);
            alert("Failed to create material");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white absolute top-0 right-0 w-[90%] md:w-[40%] h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-lg font-medium">Material</h2>
                    <button
                        onClick={() => setIsMaterialModalOpen(false)}
                        className="bg-gray-200 w-8 h-8 flex items-center hover:bg-gray-300 justify-center rounded-full cursor-pointer transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    className="px-5 py-4 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto"
                >
                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Unit 1 Study Material"
                            className={`w-full border ${errors.title ? "border-red-500" : "border-gray-200"} rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B56A4]/20 focus:border-[#0B56A4] transition-all`}
                        />
                        {errors.title && <p className="text-red-500 text-xs font-medium">{errors.title}</p>}
                    </div>

                    {/* Instruction */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Description (optional)
                        </label>
                        <textarea
                            name="instruction"
                            value={formData.instruction}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Add more details about this material..."
                            className={`w-full border ${errors.instruction ? "border-red-500" : "border-gray-200"} rounded-lg px-4 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#0B56A4]/20 focus:border-[#0B56A4] transition-all`}
                        />
                        {errors.instruction && <p className="text-red-500 text-xs font-medium">{errors.instruction}</p>}
                    </div>

                    {/* Attach */}
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-700">Attachments</p>
                        <div className="flex gap-4">
                            {[
                                { id: "link", icon: Link, label: "Link" },
                                { id: "drive", icon: Paperclip, label: "Drive" },
                                { id: "youtube link", icon: Youtube, label: "YouTube" },
                                { id: "upload", icon: Upload, label: "Upload" },
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedAttachmentOption(item.id)}
                                    className="group flex flex-col items-center gap-2 cursor-pointer transition-all"
                                >
                                    <div className="w-11 h-11 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:bg-[#0B56A4]/5 group-hover:border-[#0B56A4] group-hover:text-[#0B56A4] transition-all">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-medium text-gray-500 group-hover:text-gray-900">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resources Preview */}
                    {resources.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Attached Content</p>
                            <div className="grid grid-cols-1 gap-2">
                                {resources.map((res, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="shrink-0">
                                                {res.type === 'link' && <Link className="w-4 h-4 text-blue-500" />}
                                                {res.type === 'youtube link' && <Youtube className="w-4 h-4 text-red-500" />}
                                                {res.type === 'upload' && <FileText className="w-4 h-4 text-gray-400" />}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 truncate">
                                                {res.type === 'upload' ? res.value.name : res.value}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeResource(idx)}
                                            className="text-gray-400 hover:text-red-500 p-1 rounded-md"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400 hover:text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 py-5 px-6 absolute bottom-0 w-full border-t border-gray-100 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                    <button
                        type="button"
                        onClick={() => setIsMaterialModalOpen(false)}
                        className="px-6 py-2 text-sm font-semibold border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="px-8 py-2 text-sm font-semibold rounded-lg bg-[#0B56A4] text-white hover:bg-[#094a8f] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                <span>Saving...</span>
                            </div>
                        ) : "Post Material"}
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
