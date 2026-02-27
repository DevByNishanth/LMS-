import { Search } from "lucide-react";
import folderIcon from "../assets/folderIcon.svg";
import archiveIcon from "../assets/archiveIcon.svg";
import { Link } from "react-router-dom";
import noDatafoundImg from "../assets/noDatafoundImg.svg";
import { useEffect, useState } from "react";
import AddClassModal from "../components/AddClassModal";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import HeaderComponent from "../components/HeaderComponent";

const ClassRoomHomepage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("LmsToken");

  let staffName = "";
  if (token) {
    const decoded = jwtDecode(token);
    staffName = decoded.name;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllocatedSubjects();
  }, [token]);

  function onClose() {
    setIsOpen(false);
    getAllocatedSubjects();
  }

  function onSuccess() {
    setIsOpen(false);
  }

  async function getAllocatedSubjects() {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}api/staff/subject-planning`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClasses(res.data.data);
      console.log(res);
    } catch (error) {
      console.error("Error fetching allocated subjects:", error);
    } finally {
      setLoading(false);
    }
  }

  function generateImageUrl(link) {
    if (!link) return "";
    const cleanedLink = link.replace("/", "");
    return apiUrl + cleanedLink;
  }

  const filteredClasses = classes.filter(
    (cls) =>
      cls.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.sectionName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <HeaderComponent title="Classroom" />

      <div className="px-6">
        {/* Search and Filter Row */}
        <div className="mt-2 flex items-center justify-between mb-4">
          <div className="searchbar-container border border-[#D9D9D9] rounded-lg flex items-center gap-2 px-2 bg-white">
            <input
              type="text"
              placeholder="Search Subject and class"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 px-4 py-2 focus:outline-none"
            />
            <Search className="text-gray-400" />
          </div>
        </div>

        <div
          className={`${filteredClasses.length > 0 ? "grid" : "flex"} grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-160px)] overflow-y-auto hide-scrollbar`}
        >
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls) => (
              <Link
                to={`/dashboard/classroom/class/${cls.subjectId}/${cls.sectionId}`}
                state={cls}
                key={`${cls.subjectId}-${cls.sectionId}`}
                className="rounded-lg cursor-pointer rounded-t-xl bg-white border border-gray-200 hover:shadow-lg transition"
              >
                <div className="relative">
                  <div className="background-img relative">
                    <img
                      src={generateImageUrl(cls.image)}
                      className="h-36 rounded-t-xl object-cover w-full"
                      alt="banner"
                    />
                  </div>
                  <div className="text-container text-black absolute top-[20%] left-[4%]">
                    <h2 className="text-xl font-semibold mt-1 drop-shadow-sm">
                      {cls.subjectName}
                    </h2>
                    <p className="text-sm font-medium drop-shadow-sm">
                      {cls.sectionName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#08384F] text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                      {staffName ? staffName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <p className="text-md font-medium text-gray-700">
                      {staffName || "Staff Member"}
                    </p>
                  </div>

                  <div className="flex gap-3 text-gray-500">
                    <button className="hover:text-gray-700">
                      <img
                        src={archiveIcon}
                        className="w-6 h-6"
                        alt="archive"
                      />
                    </button>
                    <button className="hover:text-gray-700">
                      <img src={folderIcon} className="w-6 h-6" alt="folder" />
                    </button>
                    <button className="hover:text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="black"
                        className="bi bi-three-dots-vertical"
                        viewBox="0 0 16 16"
                      >
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center">
              <div className="m-auto w-[400px] text-center p-6">
                <img
                  src={noDatafoundImg}
                  className="w-[400px] h-[270px]"
                  alt="no data"
                />
                <h1 className="text-[#333333] font-medium text-xl">
                  No classes found!
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <AddClassModal
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};

export default ClassRoomHomepage;
