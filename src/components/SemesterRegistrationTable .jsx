import React, { useState, useEffect } from "react";
import { Search, Plus, Check, Trash2 } from "lucide-react";
import AddSubjectCanvas from "./AddSubjectCanvas";
import axios from "axios";

const SemesterRegistrationTable = () => {
    const [search, setSearch] = useState("");
    const [isCanvasOpen, setIsCanvasOpen] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("LmsToken");

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}api/subjects`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            // Adapt to the backend response structure if needed
            setSubjects(response.data.subjects || response.data.subjects || []);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subject?")) return;

        try {
            const response = await axios.delete(`${apiUrl}api/subjects/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert("Subject deleted successfully!");
                fetchSubjects();
            }
        } catch (error) {
            console.error("Error deleting subject:", error);
            alert("Failed to delete subject");
        }
    };

    const filteredSubjects = Array.isArray(subjects) ? subjects.filter(
        (item) =>
            (item.subject && item.subject.toLowerCase().includes(search.toLowerCase())) ||
            (item.code && item.code.includes(search))
    ) : [];

    return (
        <>
            <section className="border border-gray-300 rounded-lg m-6">
                <div className="p-3 ">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Subject Details
                        </h2>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search Subject and code"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1"
                                />
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={() => setIsCanvasOpen(true)}
                                className="flex items-center gap-2 bg-[#0B56A4] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0b55a4da] cursor-pointer shadow-sm active:scale-95 transition-all outline-none"
                            >
                                <Plus size={16} className="text-white" />
                                Add Subject
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-240px)]">
                        <table className="w-full  ">
                            <thead className="sticky top-0">
                                <tr className="bg-[#0b3a53] text-white text-sm">
                                    <th className="text-left px-4 py-3 rounded-tl-lg">
                                        Subject Code
                                    </th>
                                    <th className="text-left px-4 py-3">Subject Name</th>
                                    <th className="text-left px-4 py-3">Department</th>
                                    <th className="text-center px-4 py-3 rounded-tr-lg">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-6">Loading subjects...</td>
                                    </tr>
                                ) : filteredSubjects.map((item, index) => (
                                    <tr
                                        key={item._id || index}
                                        className={`text-sm ${index % 2 === 0 ? "bg-[#e6e9f5a2]" : "bg-gray-50"
                                            }`}
                                    >
                                        <td className="px-4 py-3">{item.code}</td>
                                        <td className="px-4 py-3">{item.subject}</td>
                                        <td className="px-4 py-3">{item.department}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-3">
                                                <button className="bg-green-400 text-white p-2 rounded-full hover:bg-green-400 cursor-pointer transition-colors shadow-sm">
                                                    <Check className="text-white w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="bg-red-400 text-white p-2 rounded-full hover:bg-red-400 cursor-pointer transition-colors shadow-sm"
                                                >
                                                    <Trash2 className="text-white w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {!loading && filteredSubjects.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-6 text-gray-500"
                                        >
                                            No subjects found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Add Subject Canvas */}
            <AddSubjectCanvas
                isOpen={isCanvasOpen}
                onClose={() => {
                    setIsCanvasOpen(false);
                    fetchSubjects(); // Refresh table after closing
                }}
            />
        </>
    );
};

export default SemesterRegistrationTable;
