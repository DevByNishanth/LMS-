import classRoombanner1 from "../assets/classRoombanner1.svg";
import folderIcon from "../assets/folderIcon.svg";
import archiveIcon from "../assets/archiveIcon.svg";
import profileImg from "../assets/profileImg.svg";
import copyIcon from "../assets/copyIcon.svg";
import { Plus } from "lucide-react";
import postBadge from "../assets/postBadge.svg";
import { useEffect, useState } from "react";
import AddAnnouncementModal from "./AddAnnouncementModal";
import Fab from "@mui/material/Fab";
import commentIcon from "../assets/commentIcon.svg";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ClassRoomStreamComponent = () => {
  // Auth
  const token = localStorage.getItem("LmsToken");

  const apiUrl = import.meta.env.VITE_API_URL;

  //   params
  const { classId } = useParams();

  // states
  const [isAnnouncementModal, setIsAnnouncementModal] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [streamData, setStreamData] = useState({});

  // useEffect calls

  const [firstLetter, setFirstLetter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("LmsToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name =
          decoded?.name || decoded?.username || decoded?.user?.name || "";

        console.log("name : ", name);
        if (name) {
          setFirstLetter(name);
        }
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    getStreamDetails();
  }, []);

  // functions
  async function handleCopyText(textToCopy) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedText(true);
      setTimeout(() => {
        setCopiedText(false);
      }, 1000);
    } catch (err) {
      console.error("Error occured while copying subject code : ", err);
      setCopiedText(false);
    }
  }

  //   fetch stream details
  async function getStreamDetails() {
    try {
      const res = await axios.get(`${apiUrl}api/staff/stream/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStreamData(res.data);
      console.log("stream data : ", res.data);
    } catch (err) {
      console.error(
        "Error occured while fetching Classroom stream details : ",
        err.message,
      );
    }
  }

  return (
    <>
      <section className="w-full h-full ">
        <div className="w-full h-full rounded-t-xl border border-gray-200 bg-white">
          <div className="top-banner-section h-[30%] relative">
            <div className="img-container w-full relative h-full">
              <img
                src={classRoombanner1}
                className="transform rounded-t-xl scale-x-[-1] h-full w-full object-cover"
              />
              <div className="absolute rounded-t-xl inset-0 bg-black/10"></div>
            </div>
            <div className="content-container absolute top-4 left-6 ">
              <h1 className="font-medium text-xl text-[#00000]">
                {streamData?.subjectName}
              </h1>
              <h1 className="font- mt-2 text-lg text-[#00000]">
                {streamData?.sectionName}
              </h1>
            </div>

            <div className="profile-container absolute bottom-2 left-6">
              <h1 className="font-medium text-md text-[#333333] flex items-center gap-3">
                <span>
                  <img src={profileImg} className="w-8 h-8" />
                </span>{" "}
                {firstLetter}
              </h1>
            </div>
          </div>

          {/* icon section  */}

          <div className="post-container w-full max-h-[64%] overflow-y-auto px-4 mt-4">
            {/* header  */}
            <div className="header flex items-center justify-between sticky top-0 bg-white">
              <h1 className="flex items-center gap-2 font-medium">
                Class Code :{" "}
                <span className="flex items-center text-[#0B56A4] gap-2 relative ">
                  {streamData?.classCode}{" "}
                  <img
                    onClick={() => {
                      handleCopyText(streamData?.classCode);
                    }}
                    src={copyIcon}
                    className="w-6 h-6 cursor-pointer"
                  />
                  {/* tooltip  */}
                  {copiedText && (
                    <button
                      className={`text-white bg-gray-800 text-[10px] px-2 py-1 rounded absolute top-full -right-14 transition-all duration-1000 ease-out ${copiedText ? "opacity-100 translate-y-1 scale-100" : "opacity-0 translate-y-3 scale-95 pointer-events-none"}`}
                    >
                      Code copied
                    </button>
                  )}
                </span>
              </h1>
              <button
                onClick={() => setIsAnnouncementModal(true)}
                className="flex items-center gap-2 bg-[#0B56A4] text-white px-4 py-2 rounded-md hover:bg-[#0B56A4]/80 cursor-pointer"
              >
                <Plus /> Add Announcement
              </button>
            </div>

            {/* classwork section  */}
            <div className={`mt-2`}>
              <div className="flex items-center justify-between bg-[#F9F9F9] border border-gray-200 rounded-lg px-2 py-3  max-w-full">
                {/* Left side */}
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0B56A4]">
                    <img src={postBadge} className="w-4 h-4" />
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-md font-medium text-black">
                      Posted a Assignment work : Sample
                    </p>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    Posted on 30/1/2026 at <span className="">11:42AM</span>
                  </p>

                  {/* More icon */}
                  <div className="cursor-pointer text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="black" viewBox="0 0 24 24">
                      <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* feed section  */}
            <div className="announcement-container mt-2 w-full space-y-2">
              <div className="w-full bg-white border border-gray-200 rounded-md p-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    {/* Avatar */}
                    <div className="">
                      {/* <img
                        src="https://via.placeholder.com/40"
                        alt="avatar"
                        className="w-full h-full object-cover"
                      /> */}

                      <p className="bg-[#0B56A4] text-white w-10 h-10 flex items-center justify-center rounded-full">
                        S
                      </p>
                    </div>

                    {/* Name & date */}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Surya Chandran
                      </p>
                      <p className="text-xs text-gray-500">
                        Posted on 30/1/2026 at 11:42AM
                      </p>
                    </div>
                  </div>

                  {/* Three dots */}
                  <div className="text-gray-400 cursor-pointer select-none">
                    ⋮
                  </div>
                </div>

                {/* Content */}
                <div className="mt-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s Lorem Ipsum is
                    simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry's standard dummy text ever
                    since the 1500s
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <span>
                      <img src={commentIcon} className="w-5 h-5" />
                    </span>
                    <span className="text-black font-medium">Comments</span>
                  </div>
                </div>
              </div>{" "}
            </div>
          </div>
        </div>
      </section>

      {/* modal section  */}
      {isAnnouncementModal && (
        <AddAnnouncementModal setIsAnnouncementModal={setIsAnnouncementModal} />
      )}
    </>
  );
};

export default ClassRoomStreamComponent;
