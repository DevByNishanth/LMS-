import { Clipboard, Search, X, CheckSquare, Square } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import copyIcon from "../assets/copyIcon.svg";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

const ClassroomAddStudentsModal = ({ onClose, selectedTab }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");

  const location = useLocation();
  const classData = location.state;
  const sectionId = classData?.sectionId;

  const { classId } = useParams();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [studentsData, setStudentsData] = useState([]);

  const toggleSelection = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const displayedUsers = useMemo(() => {
    const data = selectedTab === "Teachers" ? faculties : studentsData;
    const users = Array.isArray(data) ? data : [];

    if (!search) return users;

    return users.filter((user) => {
      const name = user.firstName || user.name || "";
      const email = user.email || "";
      return `${name} ${email}`.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, faculties, studentsData, selectedTab]);

  const isAllSelected = useMemo(() => {
    return (
      displayedUsers.length > 0 &&
      displayedUsers.every((user) => selectedEmails.includes(user.email))
    );
  }, [displayedUsers, selectedEmails]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      const displayedEmails = displayedUsers.map((u) => u.email);
      setSelectedEmails((prev) => prev.filter((email) => !displayedEmails.includes(email)));
    } else {
      const newEmails = displayedUsers.map((u) => u.email);
      setSelectedEmails((prev) => [...new Set([...prev, ...newEmails])]);
    }
  };

  const getRandomColor = (name) => {
    const colors = ["#ca0505ff", "#025e58ff", "#00758fff", "#b53f10ff", "#048d6aff", "#9d800cff", "#7d09aeff", "#086597ff", "#a24909ff", "#038267ff"];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const fetchFaculties = async () => {
    try {
      const res = await axios.get(`${apiUrl}api/faculty`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaculties(res.data && Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching faculties:", err.message);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${apiUrl}api/students/filter`, {
        params: {
          department: classData.department,
          year: classData.year,
          section: classData.sectionName.replace("Section", "") || classData.section,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentsData(res.data && Array.isArray(res.data.students) ? res.data.students : []);
    } catch (err) {
      console.error("Error fetching students:", err.message);
    }
  };

  const handleInvite = async () => {
    if (selectedEmails.length === 0) return;
    const role = selectedTab === "Teachers" ? "faculty" : "student";
    const payload = { emails: selectedEmails, role: role };

    try {
      setLoading(true);
      await axios.post(`${apiUrl}api/staff/classroom/${sectionId}/invite`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose();
    } catch (err) {
      console.error("Error sending invites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === "Teachers") fetchFaculties();
    else fetchStudents();
  }, [token, selectedTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[420px] rounded-xl bg-white px-5 py-2 shadow-xl">
        <div className="header py-2 border-b border-gray-200 mb-2 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Invite {selectedTab}</h2>
          <button onClick={onClose} className="bg-gray-100 cursor-pointer hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <p className="mb-1 text-sm font-medium text-gray-700">Invite Link</p>
          <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-blue-600">
            <span className="truncate">https://www.classs_invite.com...</span>
            <button className="text-gray-500 hover:text-gray-700">
              <img src={copyIcon} className="w-6 h-6 cursor-pointer" alt="copy" />
            </button>
          </div>
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search Name or E-mail"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 text-sm outline-none focus:border-2 focus:border-gray-600"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <Search className="text-gray-600" size={18} />
          </span>
        </div>

        {displayedUsers.length > 0 && (
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs text-gray-500 font-medium">
              {displayedUsers.length} {selectedTab === "Teachers" ? "Faculties" : "Students"} available
            </span>
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1 text-xs font-semibold text-[#0B56A4] hover:underline cursor-pointer"
            >
              {isAllSelected ? (
                <>
                  <CheckSquare size={14} /> Deselect All
                </>
              ) : (
                <>
                  <Square size={14} /> Select All
                </>
              )}
            </button>
          </div>
        )}

        <div className="max-h-[220px] space-y-2 overflow-y-auto">
          {displayedUsers.length === 0 && (
            <p className="text-center text-sm text-gray-500">No {selectedTab.toLowerCase()} found</p>
          )}

          {displayedUsers.map((user) => {
            const isSelected = selectedEmails.includes(user.email);
            const displayName = user.firstName || user.name || "Unknown";

            return (
              <div
                key={user.email}
                className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                  isSelected ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => toggleSelection(user.email)}
              >
                <div className="flex items-center gap-3">
                  <p
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: getRandomColor(displayName) }}
                  >
                    {displayName.charAt(0)}
                  </p>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{displayName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                  {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md border border-gray-400 cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={selectedEmails.length === 0 || loading}
            className={`rounded-md px-5 py-2 text-sm font-medium text-white ${
              selectedEmails.length === 0 || loading ? "bg-gray-300 cursor-not-allowed" : "bg-[#08384F] hover:bg-[#0B56A4]/80 cursor-pointer"
            }`}
          >
            {loading ? "Inviting..." : `Invite (${selectedEmails.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassroomAddStudentsModal;