import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import deleteIcon from "../assets/delete.svg";
import editIcon from "../assets/edit.svg";
import TopicDeleteModal from "./TopicDeleteModal";

export default function SubjectSubTopicsTable({ selectedUnit }) {
  const [searchParams] = useSearchParams();
  const query_data = JSON.parse(searchParams.get("data") || "{}");
  const subjectId = query_data.subjectId;
  console.log("query_data", query_data);
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [unitData, setUnitData] = useState([]);
  const [currentTopics, setCurrentTopics] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTopicId, setEditTopicId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    topicName: "",
    teachingLanguage: "English",
    date: "",
    hours: "",
    teachingAid: "",
    referenceBook: "",
  });

  useEffect(() => {
    if (subjectId) {
      getTopics();
    }
  }, [subjectId]);

  useEffect(() => {
    if (unitData.length > 0) {
      const selectedUnitData = unitData.find(
        (u) => u.unitName === selectedUnit,
      );
      setCurrentTopics(selectedUnitData ? selectedUnitData.topics : []);
    } else {
      setCurrentTopics([]);
    }
  }, [selectedUnit, unitData]);

  const getTopics = async () => {
    console.log("Fetching topics for subjectId:", subjectId);
    try {
      const res = await axios.get(
        `${apiUrl}api/subject-planning/topics/${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Full backend response:", res.data);
      setUnitData(res.data.units || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setEditTopicId(null);
    setFormData({
      topicName: "",
      teachingLanguage: "English",
      date: "",
      hours: "",
      teachingAid: "",
      referenceBook: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    console.log("Editing topic:", item._id);
    setIsEditing(true);
    setEditTopicId(item._id);
    setFormData({
      topicName: item.topicName,
      teachingLanguage: item.teachingLanguage,
      date: item.date,
      hours: item.hours,
      teachingAid: item.teachingAid,
      referenceBook: item.referenceBook,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (topicId) => {
    setDeleteId(topicId);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.topicName ||
      !formData.date ||
      !formData.hours ||
      !formData.teachingAid ||
      !formData.referenceBook
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Mapping to backend format
      const dataToSubmit = {
        subjectId,
        unitName: selectedUnit,
        topicName: formData.topicName,
        teachingLanguage: formData.teachingLanguage,
        date: formData.date,
        hours: isNaN(formData.hours)
          ? formData.hours
          : parseInt(formData.hours),
        teachingAid: formData.teachingAid,
        referenceBook: formData.referenceBook,
      };

      if (isEditing) {
        const putData = {
          unitName: selectedUnit,
          topicName: formData.topicName,
          hours: isNaN(formData.hours)
            ? formData.hours
            : parseInt(formData.hours),
          teachingAid: formData.teachingAid,
        };

        const response = await axios.put(
          `${apiUrl}api/staff/subject-planning/topic/${editTopicId}`,
          putData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.status === 200) {
          alert("Topic updated successfully!");
          getTopics();
          setIsModalOpen(false);
        }
      } else {
        const response = await axios.post(
          `${apiUrl}api/staff/subject-planning/topic`,
          dataToSubmit,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.status === 200 || response.status === 201) {
          alert("Topic added successfully!");
          getTopics();
          setIsModalOpen(false);
        }
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
          <div
            className="fixed inset-0 bg-black/20 z-50"
            onClick={handleCancel}
          ></div>
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl z-60 w-[80%] md:w-[800px] p-6">
            <div className="flex justify-between items-center mb-6  border-b border-gray-300 pb-2">
              <h2 className="text-xl font-medium">
                {isEditing ? "Edit Topic" : "Add New Topic"}
              </h2>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-sm font-medium">
                    Teaching Language
                  </label>
                  <select
                    name="teachingLanguage"
                    value={formData.teachingLanguage}
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
                    name="teachingAid"
                    value={formData.teachingAid}
                    onChange={handleInputChange}
                    className="w-full mt-1 border border-gray-300 rounded px-3 py-2 outline-none focus:border-1"
                    placeholder="e.g., White Board"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">Reference Book</label>
                  <input
                    type="text"
                    name="referenceBook"
                    value={formData.referenceBook}
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
                {isEditing ? "Update Topic" : "Save Topic"}
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
              {/* <th className="px-4 py-3">Actions</th> */}
            </tr>
          </thead>

          <tbody>
            {currentTopics?.map((item, index) => (
              <tr
                key={index}
                className={`${index % 2 !== 0 ? "bg-[#E6E9F5]" : "bg-white"} text-[14px]`}
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{item.topicName}</td>
                <td className="px-4 py-3">{item.teachingLanguage}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">{item.hours}</td>
                <td className="px-4 py-3">{item.teachingAid}</td>
                <td className="px-4 py-3">{item.referenceBook}</td>
                {/* <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className=" cursor-pointer hover:bg-gray-100 rounded-full p-2 "
                    >
                      <img src={editIcon} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="cursor-pointer hover:bg-gray-100 rounded-full p-2"
                    >
                      <img src={deleteIcon} className="w-6 h-6" />
                    </button>
                  </div>
                </td> */}
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

      {isDeleteModalOpen && (
        <TopicDeleteModal
          setIsDelete={setIsDeleteModalOpen}
          deleteId={deleteId}
          unitName={selectedUnit}
          onSuccess={getTopics}
        />
      )}
    </div>
  );
}
