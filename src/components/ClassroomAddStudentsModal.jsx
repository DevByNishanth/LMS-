import { Clipboard, Search, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import axios from 'axios';
import copyIcon from "../assets/copyIcon.svg";

const ClassroomAddStudentsModal = ({ onClose }) => {
    const [search, setSearch] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [studentsData, setStudentsData] = useState([]);

    const token = localStorage.getItem("LmsToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        getStudents();
    }, [])

    const getStudents = async () => {
        try {
            const res = await axios.get(`${apiUrl}api/student/allStudents`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStudentsData(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    // 🔍 Search logic (name OR email)
    const filteredStudents = useMemo(() => {
        return studentsData.filter((student) =>
            `${student.name} ${student.email}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {/* Modal */}
            <div className="w-[420px] rounded-xl bg-white px-5 py-2 shadow-xl">
                {/* Header */}
                <div className="header py-2 border-b border-gray-200 mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                        Invite Students
                    </h2>
                    <button onClick={onClose} className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"><X /></button>
                </div>

                {/* Invite Link */}
                <div className="mb-4">
                    <p className="mb-1 text-sm font-medium text-gray-700">
                        Invite Link
                    </p>
                    <div className="flex items-center justify-between rounded-lg  px-3 py-2 text-sm text-blue-600">
                        <span className="truncate">
                            https://www.classs_invite.com......................
                        </span>
                        <button className="text-gray-500 hover:text-gray-700">
                            <img
                                src={copyIcon}
                                className="w-6 h-6 cursor-pointer"
                            />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <input
                        type="text"
                        placeholder="Search Name or E-mail"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 text-sm outline-none focus:border-2 focus:border-gray-600"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400">
                        <Search className="text-gray-600" />
                    </span>
                </div>

                {/* Students List */}
                <div className="max-h-[220px] space-y-2 overflow-y-auto">
                    {filteredStudents.length === 0 && (
                        <p className="text-center text-sm text-gray-500">
                            No students found
                        </p>
                    )}

                    {filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            className="flex items-center justify-between rounded-lg border border-gray-300 p-3"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={student.avatar || "https://i.pravatar.cc/150?img=12"}
                                    alt={student.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {student.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {student.email}
                                    </p>
                                </div>
                            </div>

                            {/* Radio */}
                            <button
                                onClick={() => setSelectedStudentId(student.id)}
                                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedStudentId === student.id
                                    ? "border-blue-600"
                                    : "border-gray-300"
                                    }`}
                            >
                                {selectedStudentId === student.id && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-5 flex justify-end gap-3">
                    <button className="rounded-md border border-gray-400 cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Cancel
                    </button>
                    <button className="rounded-md bg-[#0B56A4] cursor-pointer px-5 py-2 text-sm font-medium hover:bg-[#0B56A4]/80 text-white">
                        Invite
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassroomAddStudentsModal;
