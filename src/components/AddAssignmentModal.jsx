import { useState } from "react";
import { X, Paperclip, Link, Youtube, Plus, Upload } from "lucide-react";

export default function AddAssignmentModal({ onClose, setIsAssignmentModalOpen }) {
    const [formData, setFormData] = useState({
        title: "",
        instruction: "",
        dueDate: "",
        assignTo: "All Students",
        attachments: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Assignment Data:", formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white absolute top-0 right-0 w-[40%] h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-lg font-medium">Assignment</h2>
                    <button onClick={() => setIsAssignmentModalOpen(false)}>
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                    {/* Title */}
                    <div>
                        <label className="text-md text-gray-600 font-medium">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#000000]"
                        />
                    </div>

                    {/* Instruction */}
                    <div>
                        <label className="text-md text-gray-600 font-medium">Instruction</label>
                        <textarea
                            name="instruction"
                            value={formData.instruction}
                            onChange={handleChange}
                            rows={5}
                            className="w-full border border-gray-400 rounded px-3 py-2 mt-1 resize-none focus:outline-none focus:ring-1 focus:ring-[#000000]"
                        />
                    </div>

                    {/* Attach */}
                    <div>
                        <p className="text-md text-gray-600 font-medium mb-2">Attach Any</p>
                        <div className="flex gap-6 text-xs text-gray-600">
                            <div className="flex flex-col items-center gap-1 cursor-pointer">
                                <Link className="w-4 h-4" />
                                Link
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer">
                                <Paperclip className="w-4 h-4" />
                                Drive
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer">
                                <Youtube className="w-4 h-4" />
                                Youtube
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer">
                                <Plus className="w-4 h-4" />
                                Create
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer">
                                <Upload className="w-4 h-4" />
                                Upload
                            </div>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="text-sm text-gray-600">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:outline-none"
                        />
                    </div>

                    {/* Assign To */}
                    <div>
                        <label className="text-sm text-gray-600">Assign to</label>
                        <select
                            name="assignTo"
                            value={formData.assignTo}
                            onChange={handleChange}
                            className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:outline-none"
                        >
                            <option>All Students</option>
                            <option>Section A</option>
                            <option>Section B</option>
                        </select>
                    </div>


                </form>
                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 py-5 px-6 ">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded cursor-pointer bg-[#D9D9D9] text-black hover:opacity-90"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 cursor-pointer rounded bg-[#0B56A4] text-white hover:opacity-90"
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
}
