import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Search,
  Trash2Icon,
} from "lucide-react";
import axios from "axios";
import StaffDeleteModal from "./StaffDeleteModal";

export default function SubjectRow({
  item,
  facultyDetails,
  selectedDept,
  selectedType,
  selectedSemester,
  selectedRegulation,
  setSelectedDept,
  setSelectedType,
  setSelectedSemester,
  setSelectedRegulation,
}) {
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [searchText, setSearchText] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSectionIndex, setModalSectionIndex] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const [semesterType, setSemesterType] = useState(null);
  const [openModalTwo, setOpenModalTwo] = useState(false);
  const [sectionId, setSectionId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsModalOpen(false);
        setOpenModalTwo(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const filteredStaff = facultyDetails.filter((staff) =>
    staff.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpen = (sec) => {
    setSubjectId(item.id);
    setSemesterType(item.semesterType);
    setSelectedSection(sec.sectionName);
    setSelectedSubjectName(item.subject);
    setIsModalOpen(true);
  };

  function handleOpenTwo(sec) {
    setSectionId(sec.sectionId);
    setSubjectId(item.id);
    setSemesterType(item.semesterType);
    setSelectedSection(sec.sectionName);
    setSelectedSubjectName(item.subject);
    setOpenModalTwo(true);
  }

  function handleStaffDelete(sec) {
    setSectionId(sec.sectionId);
    setSubjectId(item.id);
    setSemesterType(item.semesterType);
    setSelectedSection(sec.sectionName);
    setSelectedSubjectName(item.subject);
    setDeleteModal(true);
  }

  async function handleDelete() {
    try {
      await axios.delete(
        `${apiUrl}api/admin-allocation/delete-staff/${sectionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (err) {
      console.error("Error occurred while deleting staff: ", err);
    }
  }

  async function handleSave() {
    if (!selectedStaff) {
      alert("Please select a staff!");
      return;
    }

    const payload = {
      department: selectedDept,
      subjectType: selectedType,
      semester: Number(selectedSemester),
      regulation: selectedRegulation,
      subjectId: subjectId,
      sectionName: selectedSection,
      staffId: selectedStaff.id,
      semesterType: semesterType,
    };

    try {
      await axios.post(
        `${apiUrl}api/admin-allocation/admin-allocation`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error posting staff data:", error);
    }
  }

  async function handleSaveTwo() {
    if (!selectedStaff) {
      alert("Please select a staff!");
      return;
    }

    const payload = {
      staffId: selectedStaff.id,
    };

    try {
      await axios.patch(
        `${apiUrl}api/admin-allocation/update-staff/${sectionId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error updating staff data:", error);
    }
  }

  return (
    <>
      {item.sections.map((sec, secIndex) => (
        <tr key={secIndex} className="border border-gray-300 text-sm">
          {secIndex === 0 && (
            <td
              rowSpan={item.sections.length}
              className="border-r font-medium border-gray-300 px-4 py-6 align-top w-[30%]"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {item.code}
                </span>
                <span className="text-[15px] text-gray-800">
                  {item.subject}
                </span>
              </div>
            </td>
          )}

          <td className="px-4 py-3 w-[35%] font-medium text-gray-700">
            {sec.sectionName}
          </td>

          <td
            className={`px-4 py-3 w-[100%] flex items-center gap-2 ${
              !sec.staff ? "bg-gray-50" : "bg-white"
            }`}
          >
            {sec.staff ? (
              <div className="flex items-center justify-between w-full group">
                <span className="font-semibold text-gray-700">
                  {sec.staff.name}
                </span>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil
                    onClick={() => handleOpenTwo(sec)}
                    className="w-4 h-4 text-green-600 cursor-pointer hover:scale-110 transition-transform"
                  />
                  <Trash2Icon
                    onClick={() => handleStaffDelete(sec)}
                    className="text-red-400 w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setModalSectionIndex(secIndex);
                  handleOpen(sec);
                }}
                className="w-9 h-9 p-2 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Plus className="text-[#08384f] w-5 h-5" />
              </button>
            )}
          </td>
        </tr>
      ))}

      {/* Staff Selection Modals (Add & Edit) */}
      {(isModalOpen || openModalTwo) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            ref={dropdownRef}
            className="w-[420px] bg-white shadow-2xl rounded-xl py-6 px-4 animate-in fade-in zoom-in duration-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">
                {openModalTwo ? "Change Staff" : "Assign Staff"}
              </h3>
              <X 
                className="w-5 h-5 text-gray-400 cursor-pointer" 
                onClick={() => { setIsModalOpen(false); setOpenModalTwo(false); }}
              />
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search staff name..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Search className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            </div>

            <div className="max-h-[250px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {filteredStaff.map((staff) => (
                <label
                  key={staff.id}
                  className={`flex items-center justify-between border p-3 cursor-pointer rounded-lg transition-all ${
                    selectedStaff?.id === staff.id 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#08384F] flex items-center justify-center text-white font-bold text-sm">
                      {staff.name.charAt(0)}
                    </div>
                    <p className="font-medium text-gray-700">{staff.name}</p>
                  </div>
                  <input
                    type="radio"
                    name="staff"
                    checked={selectedStaff?.id === staff.id}
                    onChange={() => setSelectedStaff(staff)}
                    className="w-4 h-4 accent-[#08384F]"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                onClick={() => { setIsModalOpen(false); setOpenModalTwo(false); }}
              >
                Cancel
              </button>
              <button
                className="bg-[#08384F] text-white px-8 py-2 rounded-lg font-medium hover:bg-[#062c3e] transition-all shadow-lg"
                onClick={openModalTwo ? handleSaveTwo : handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <StaffDeleteModal
          setDeleteModal={setDeleteModal}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}