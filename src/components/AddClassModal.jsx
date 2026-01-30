import { X } from "lucide-react";
import { useState } from "react";

export default function AddClassModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        className: "",
        section: "",
        subjectName: "",
        year: "",
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/staff/classroom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create class");

            onSuccess && onSuccess();
            onClose();
            setFormData({ className: "", section: "", subjectName: "", year: "" });
        } catch (error) {
            console.error(error);
            alert("Something went wrong while creating class");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-500 px-6 py-4">
                    <h2 className="text-lg font-medium text-[#333333]">Create New Class</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full cursor-pointer bg-gray-200 px-1 py-1 text-gray-600 hover:bg-gray-200"
                    >
                        <X />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4 px-6 py-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Class Name</label>
                        <input
                            type="text"
                            name="className"
                            value={formData.className}
                            onChange={handleChange}
                            placeholder="Eg: BSc IT"
                            className="w-full rounded-md border border-gray-400 px-3 py-2 focus:border-blackfocus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Subject Name</label>
                        <input
                            type="text"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleChange}
                            placeholder="Eg: Web Technology"
                            className="w-full rounded-md border border-gray-400 px-3 py-2 focus:border-blackfocus:outline-none"
                        />
                    </div>


                    <div>
                        <label className="mb-1 block text-sm font-medium">Year</label>
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-400 px-3 py-2 focus:border-blackfocus:outline-none"
                        >
                            <option value="">Select Year</option>
                            <option value="1">First Year</option>
                            <option value="2">Second Year</option>
                            <option value="3">Third Year</option>
                            <option value="4">Fourth Year</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Section</label>
                        <select
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-400 px-3 py-2 focus:border-blackfocus:outline-none"
                        >
                            <option value="">Select Section</option>
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                            <option value="C">Section C</option>
                            <option value="D">Section D</option>
                        </select>
                    </div>



                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-gray-400 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="rounded-md bg-[#0B56A4] px-4 py-2 text-sm text-white cursor-pointer hover:bg-[#0b56a4ce] transition"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
