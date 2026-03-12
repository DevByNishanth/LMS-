import classRoombanner1 from "../assets/classRoombanner1.svg";
import copyIcon from "../assets/copyIcon.svg";
import postBadge from "../assets/postBadge.svg";
import commentIcon from "../assets/commentIcon.svg";
import fileIcon from "../assets/file-icon.svg";
import { Pencil, Plus, Trash, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import AddAnnouncementModal from "./AddAnnouncementModal";

const ClassRoomStreamComponent = () => {
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;
  const { classId, sectionId } = useParams();

  const [streamData, setStreamData] = useState({});
  const [feedData, setFeedData] = useState([]);
  const [quizFeed, setQuizFeed] = useState([]);
  const [assignmentFeed, setAssignmentFeed] = useState([]);

  const [copiedText, setCopiedText] = useState(false);
  const [isAnnouncementModal, setIsAnnouncementModal] = useState(false);
  const [actionDropdown, setActionDropdown] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [firstLetter, setFirstLetter] = useState("");

  const actionDropdownRef = useRef(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name =
          decoded?.name || decoded?.username || decoded?.user?.name || "";
        setFirstLetter(name);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, [token]);

  const getStreamDetails = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}api/staff/stream/${classId}/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setStreamData(res.data);
      setFeedData(res.data.stream || []);
    } catch (err) {
      console.error("Stream fetch error:", err);
    }
  };

  const getQuizFeed = async () => {
    try {
      const res = await axios.get(`${apiUrl}api/quiz/${classId}/${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const quizPosts = (res.data.data || []).map((quiz) => ({
        ...quiz,
        type: "quiz",
        message: `Posted a Quiz : ${quiz.title}`,
      }));
      setQuizFeed(quizPosts);
    } catch (err) {
      console.error("Quiz fetch error:", err);
    }
  };

  const getAssignments = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}api/assignment/subject/${classId}/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const assignmentPosts = (res.data.data || []).map((asn) => ({
        ...asn,
        type: "assignment",
        message: `Posted a Assignment work : ${asn.title || "Sample"}`,
      }));
      setAssignmentFeed(assignmentPosts);
    } catch (err) {
      console.error("Assignment fetch error:", err);
    }
  };

  useEffect(() => {
    getStreamDetails();
    getQuizFeed();
    getAssignments();
  }, [classId, sectionId]);

  const combinedFeed = [...feedData, ...quizFeed, ...assignmentFeed].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const handleCopyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 1000);
    } catch (err) {
      console.error("Copy error", err);
    }
  };

  const handlePostComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await axios.post(
        `${apiUrl}api/staff/stream/${postId}/comment`,
        { streamId: postId, comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCommentText("");
      getStreamDetails();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(e.target)
      ) {
        setActionDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <section className="w-full h-full">
        <div className="w-full h-full rounded-t-xl border border-gray-200 bg-white">
          <div className="h-[30%] relative">
            <div className="w-full relative h-full">
              <img
                src={classRoombanner1}
                className="transform rounded-t-xl scale-x-[-1] h-full w-full object-cover"
              />
              <div className="absolute rounded-t-xl inset-0 bg-black/10"></div>
            </div>
            <div className="absolute top-4 left-6">
              <h1 className="font-medium text-xl text-black">
                {streamData?.subjectName}
              </h1>
              <h1 className="mt-2 text-lg text-black">
                {streamData?.sectionName}
              </h1>
            </div>
            <div className="absolute bottom-2 left-6">
              <h1 className="font-medium text-md text-[#333333] flex items-center gap-3">
                <p className="bg-white w-7 h-7 rounded-full text-[#08384f] flex items-center justify-center">
                  {firstLetter.slice(0, 1).toUpperCase()}
                </p>
                {firstLetter}
              </h1>
            </div>
          </div>

          <div className="w-full max-h-[64%] overflow-y-auto px-4 mt-4">
            <div className="flex items-center justify-between sticky top-0 z-20 bg-white py-2">
              <h1 className="flex items-center gap-2 font-medium">
                Class Code :
                <span className="flex items-center text-[#0B56A4] gap-2 relative">
                  {streamData?.classroomCode}
                  <img
                    onClick={() => handleCopyText(streamData?.classroomCode)}
                    src={copyIcon}
                    className="w-6 h-6 cursor-pointer"
                  />
                  {copiedText && (
                    <button className="text-white bg-gray-800 text-[10px] px-2 py-1 rounded absolute top-full -right-14">
                      Code copied
                    </button>
                  )}
                </span>
              </h1>
              <button
                onClick={() => setIsAnnouncementModal(true)}
                className="flex items-center gap-2 bg-[#08384F] text-white px-4 py-2 rounded-md"
              >
                <Plus /> Add Announcement
              </button>
            </div>

            <div className="mt-4 space-y-4 pb-6">
              {combinedFeed.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No data found!
                </div>
              ) : (
                combinedFeed.map((item) => (
                  <div
                    key={item._id}
                    className="w-full bg-white border border-gray-200 rounded-md p-4"
                  >
                    {/* Item Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <p className="bg-[#08384F] text-white w-10 h-10 flex items-center justify-center rounded-full">
                          {item.type === "quiz" || item.type === "assignment"
                            ? "A"
                            : firstLetter[0] || "S"}
                        </p>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.type === "quiz" || item.type === "assignment"
                              ? "System"
                              : firstLetter}
                          </p>
                          <p className="text-xs text-gray-500">
                            Posted on{" "}
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-GB",
                            )}{" "}
                            at{" "}
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      {item.type !== "quiz" && item.type !== "assignment" && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActionDropdown(
                                actionDropdown === item._id ? null : item._id,
                              )
                            }
                          >
                            <svg
                              width="16"
                              height="16"
                              fill="black"
                              viewBox="0 0 16 16"
                            >
                              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                            </svg>
                          </button>
                          {actionDropdown === item._id && (
                            <div
                              ref={actionDropdownRef}
                              className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50"
                            >
                              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm">
                                <Pencil size={14} className="text-green-700" />{" "}
                                Edit
                              </button>
                              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600">
                                <Trash size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content Logic */}
                    <div className="mt-3">
                      {item.type === "quiz" || item.type === "assignment" ? (
                        <div
                          className={`flex justify-between items-center bg-[#F9F9F9] border-l-4 ${item.type === "quiz" ? "border-blue-600" : "border-green-600"} p-3 rounded-lg`}
                        >
                          <div className="flex gap-3 items-center">
                            <div
                              className={`w-8 h-8 flex items-center justify-center rounded-full ${item.type === "quiz" ? "bg-blue-600" : "bg-green-600"}`}
                            >
                              <img src={postBadge} className="w-4 h-4" />
                            </div>
                            <p className="text-sm font-medium">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-700">
                            {item.message}
                          </p>
                          {(item.link || item.youtubeLink) && (
                            <div className="mt-2 space-y-1">
                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  className="block text-blue-600 text-xs truncate"
                                >
                                  {item.link}
                                </a>
                              )}
                              {item.youtubeLink && (
                                <a
                                  href={item.youtubeLink}
                                  target="_blank"
                                  className="block text-red-600 text-xs truncate"
                                >
                                  {item.youtubeLink}
                                </a>
                              )}
                            </div>
                          )}
                          {item.attachments?.map((file, i) => (
                            <a
                              key={i}
                              href={file}
                              target="_blank"
                              className="mt-2 flex items-center gap-2 border p-2 rounded bg-gray-50 text-xs truncate"
                            >
                              <img src={fileIcon} className="w-4" /> {file}
                            </a>
                          ))}
                        </>
                      )}
                    </div>

                    {/* Footer / Comments */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div
                        onClick={() =>
                          setActiveCommentBox(
                            activeCommentBox === item._id ? null : item._id,
                          )
                        }
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <img src={commentIcon} className="w-4" />
                          {item.comments?.length > 0
                            ? `${item.comments.length} Comments`
                            : "Comments"}
                        </div>
                        {activeCommentBox === item._id && <X size={14} />}
                      </div>

                      {activeCommentBox === item._id && (
                        <div className="mt-3 space-y-3">
                          <div className="max-h-40 overflow-y-auto space-y-2">
                            {item.comments?.map((c, i) => (
                              <div key={i} className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-orange-400 text-white text-[10px] flex items-center justify-center flex-shrink-0">
                                  {c.name?.[0] || "U"}
                                </div>
                                <div className="bg-gray-100 p-2 rounded-lg flex-1">
                                  <p className="text-[10px] font-bold">
                                    {c.name}
                                  </p>
                                  <p className="text-xs">{c.comment}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Add a comment..."
                              className="flex-1 border rounded-full px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={() => handlePostComment(item._id)}
                              className="text-blue-900"
                            >
                              <Send size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {isAnnouncementModal && (
        <AddAnnouncementModal
          setIsAnnouncementModal={(val) => {
            setIsAnnouncementModal(val);
            if (!val) setSelectedAnnouncement(null);
          }}
          initialData={selectedAnnouncement}
        />
      )}
    </>
  );
};

export default ClassRoomStreamComponent;
