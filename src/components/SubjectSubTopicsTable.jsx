import { useState } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";

export default function SubjectSubTopicsTable() {
    const token = localStorage.getItem("LmsToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    const [topics, setTopics] = useState([
        {
            sno: "1.1",
            topicName: "Introduction",
            language: "English",
            date: "11-07-2021",
            hours: "45 Minutes",
            aid: "White Board",
            reference: "AI / Dr.Prabhakaran",
        },
        {
            sno: "1.2",
            topicName: "Introduction",
            language: "English",
            date: "11-07-2021",
            hours: "45 Minutes",
            aid: "Smart Board",
            reference: "AI / Dr.Prabhakaran",
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        sno: "",
        topicName: "",
        language: "English",
        date: "",
        hours: "",
        aid: "",
        reference: "",
    });

    const handleAdd = () => {
        setFormData({
            sno: "",
            topicName: "",
            language: "English",
            date: "",
            hours: "",
            aid: "",
            reference: "",
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.sno || !formData.topicName || !formData.date || !formData.hours || !formData.aid || !formData.reference) {
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await axios.post(
                `${apiUrl}api/staff/subject-planning/topic`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert("Topic added successfully!");
                setTopics([...topics, formData]);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error adding topic:", error);
            alert("Failed to add topic");
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="table-container w-[84%]">
            {/* Modal */}
            {isModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-50" onClick={handleCancel}></div>
                    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl z-60 w-[80%] md:w-[800px] p-6">
                        <div className="flex justify-between items-center mb-6  border-b border-gray-300 pb-2">
                            <h2 className="text-xl font-medium">Add New Topic</h2>
                            <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">S.No</label>
                                    <input
                                        type="text"
                                        name="sno"
                                        value={formData.sno}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 outline-none focus:border-1"
                                        placeholder="e.g., 1.1"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Topic Name</label>
                                    <input
                                        type="text"
                                        name="topicName"
                                        value={formData.topicName}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 outline-none focus:border-1"
                                        placeholder="Enter topic name"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Teaching Language</label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 outline-none focus:border-1"
                                    >
                                        <option value="English">English</option>
                                        <option value="Tamil">Tamil</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 outline-none focus:border-1"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Hours</label>
                                    <input
                                        type="text"
                                        name="hours"
                                        value={formData.hours}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 outline-none focus:border-1"
                                        placeholder="e.g., 45 Minutes"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Teaching Aid</label>
                                    <input
                                        type="text"
                                        name="aid"
                                        value={formData.aid}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 outline-none focus:border-1"
                                        placeholder="e.g., White Board"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="text-sm font-medium">Reference Book</label>
                                    <input
                                        type="text"
                                        name="reference"
                                        value={formData.reference}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2 outline-none focus:border-1"
                                        placeholder="e.g., AI / Dr.Prabhakaran"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-[#0B56A4] text-white rounded-lg hover:bg-[#0a4a8d]"
                            >
                                Save Topic
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-160px)] border border-gray-300 rounded-t-lg">
                <table className="w-full text-sm ">
                    <thead className="sticky top-0">
                        <tr className="bg-[#08384F] text-white text-left">
                            <th className="px-4 py-3">S.No</th>
                            <th className="px-4 py-3">Topic Name</th>
                            <th className="px-4 py-3">Teaching Language</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Hours</th>
                            <th className="px-4 py-3">Teaching Aid</th>
                            <th className="px-4 py-3">Reference Book</th>
                        </tr>
                    </thead>

                    <tbody>
                        {topics.map((item, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 !== 0 ? "bg-[#E6E9F5]" : "bg-white"} text-[14px]`}
                            >
                                <td className="px-4 py-3">{item.sno}</td>
                                <td className="px-4 py-3">{item.topicName}</td>
                                <td className="px-4 py-3">{item.language}</td>
                                <td className="px-4 py-3">{item.date}</td>
                                <td className="px-4 py-3">{item.hours}</td>
                                <td className="px-4 py-3">{item.aid}</td>
                                <td className="px-4 py-3">{item.reference}</td>
                            </tr>
                        ))}

                        {/* Button Row */}
                        <tr>
                            <td colSpan={7} className="px-4 py-5">
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleAdd}
                                        className="bg-[#0B56A4] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:cursor-pointer transition"
                                    >
                                        <Plus className="w-6 h-6" />
                                        Add New Topics
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>


        </div>
    );
}
