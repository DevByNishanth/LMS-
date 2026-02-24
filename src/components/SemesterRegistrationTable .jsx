import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Pencil } from "lucide-react";
import AddSubjectCanvas from "./AddSubjectCanvas";
import axios from "axios";
import noData from '../assets/nodata.svg'
import { useLocation } from "react-router-dom";

const SemesterRegistrationTable = () => {
  const [search, setSearch] = useState("");
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fullDeptName = queryParams.get("dept");
  const selectedDept = fullDeptName?.match(/\(([^)]+)\)/)?.[1] || fullDeptName;

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");

  useEffect(() => {
    if (selectedDept) {
      fetchSubjects();
    }
  }, [selectedDept]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}api/subjects/${selectedDept}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;

    try {
      const response = await axios.delete(
        `${apiUrl}api/subjects/subjects/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        alert("Subject deleted successfully!");
        fetchSubjects();
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Failed to delete subject");
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setIsCanvasOpen(true);
  };

  const filteredSubjects = Array.isArray(subjects)
    ? subjects.filter((item) => {
      const matchesSearch =
        (item.subject &&
          item.subject.toLowerCase().includes(search.toLowerCase())) ||
        (item.code && item.code.toLowerCase().includes(search.toLowerCase()));

      return matchesSearch;
    })
    : [];

  return (
    <>
      <section className="border border-gray-300 rounded-lg m-6">
        <div className="p-3 ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">
              Subject Details {selectedDept && <span className="text-[#0B56A4]">- {selectedDept}</span>}
            </h2>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search subject or code"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#08384F]"
                />
              </div>

              <button
                onClick={() => setIsCanvasOpen(true)}
                className="flex items-center gap-2 bg-[#08384F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0b3a53] cursor-pointer shadow-sm active:scale-95 transition-all outline-none"
              >
                <Plus size={16} className="text-white" />
                Add Subject
              </button>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-180px)]">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#08384F] text-white text-sm">
                  <th className="text-left px-4 py-3 first:rounded-tl-lg">
                    Subject Code
                  </th>
                  <th className="text-left px-4 py-3">Subject Name</th>
                  <th className="text-left px-4 py-3">Department</th>
                  <th className="text-center px-4 py-3 last:rounded-tr-lg">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-600">
                      Loading subjects...
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className={`text-sm border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">{item.code}</td>
                      <td className="px-4 py-3 text-gray-600">{item.subject}</td>
                      <td className="px-4 py-3 text-gray-600">{item.department}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 cursor-pointer transition-colors shadow-sm"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600 cursor-pointer transition-colors shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

                {!loading && filteredSubjects.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                      <div className="flex flex-col items-center">
                        <img src={noData} className="w-[180px] h-auto mb-4 opacity-80" alt="No data" />
                        <p className="text-lg font-medium">No subjects found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <AddSubjectCanvas
        isOpen={isCanvasOpen}
        editingSubject={editingSubject}
        selectedDept={selectedDept}
        onClose={() => {
          setIsCanvasOpen(false);
          setEditingSubject(null);
          fetchSubjects();
        }}
      />
    </>
  );
};

export default SemesterRegistrationTable;