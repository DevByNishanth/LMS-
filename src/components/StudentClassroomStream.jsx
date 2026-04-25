import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import classRoombanner1 from "../assets/classRoombanner1.svg";
import copyIcon from "../assets/copyIcon.svg";
import commentIcon from "../assets/commentIcon.svg";
import fileIcon from "../assets/file-icon.svg";
import postBadge from "../assets/postBadge.svg";
import { Send, X } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const StudentClassroomStream = () => {
  const { classId, sectionId } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [feedData, setFeedData] = useState([]);
  const [firstLetter, setFirstLetter] = useState("U");
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name =
          decoded?.name || decoded?.username || decoded?.user?.name || "U";
        setFirstLetter(name);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, [token]);

  const getStreamDetails = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}api/staff/student/stream/${classId}/${sectionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedData(res.data.data || []);
    } catch (err) {
      console.error("Stream fetch error:", err);
    }
  };

  useEffect(() => {
    getStreamDetails();
  }, [classId, sectionId]);

  const handlePostComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await axios.post(
        `${apiUrl}api/staff/stream/${postId}/comment`,
        { streamId: postId, comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      getStreamDetails();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const stateCls = location.state || {};
  const displaySubject = stateCls.subject || feedData[0]?.subject || "Subject Name";
  const displaySection = stateCls.section || feedData[0]?.section || "Class Name";
  const displayStaff = stateCls.staffName || feedData[0]?.staffName || "Staff Member";
  const staffInitial = displayStaff.charAt(0).toUpperCase();

  return (
    <>
      <section className="w-full h-full">
        <div className="w-full h-full rounded-t-xl border border-gray-200 bg-white">
          <div className="h-[30%] relative">
            <div className="w-full relative h-full">
              <img
                src={classRoombanner1}
                className="transform rounded-t-xl scale-x-[-1] h-full w-full object-cover"
                alt="banner"
              />
              <div className="absolute rounded-t-xl inset-0 bg-black/10"></div>
            </div>
            <div className="absolute top-4 left-6">
              <h1 className="font-medium text-xl text-black">
                {displaySubject}
              </h1>
              <h1 className="mt-2 text-lg text-black">
                {displaySection}
              </h1>
            </div>
            <div className="absolute bottom-2 left-6">
              <h1 className="font-medium text-md text-[#333333] flex items-center gap-3">
                <p className="bg-white w-7 h-7 rounded-full text-[#08384f] flex items-center justify-center">
                  {staffInitial}
                </p>
                {displayStaff}
              </h1>
            </div>
          </div>

          <div className="w-full max-h-[64%] overflow-y-auto px-4 mt-4">
            <div className="flex items-center justify-between sticky top-0 z-20 bg-white py-2">
              <h1 className="flex items-center gap-2 font-medium">
                {/* Students typically shouldn't see or copy a class code, but keeping it if needed */}
              </h1>
            </div>

            <div className="mt-4 space-y-4 pb-6">
              {feedData.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No upcoming posts!
                </div>
              ) : (
                feedData.map((item) => (
                  <div key={item._id} className="w-full bg-white border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <p className="bg-[#08384F] text-white w-10 h-10 flex items-center justify-center rounded-full">
                          {item.staffName?.[0]?.toUpperCase() || "T"}
                        </p>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.staffName || "Staff Name"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Posted on{" "}
                            {new Date(item.createdAt).toLocaleDateString("en-GB")}{" "}
                            at{" "}
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-700">{item.message}</p>
                      
                      {(item.link || item.youtubeLink) && (
                        <div className="mt-2 space-y-1">
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-blue-600 text-xs truncate"
                            >
                              {item.link}
                            </a>
                          )}
                          {item.youtubeLink && (
                            <a
                              href={item.youtubeLink}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-red-600 text-xs truncate"
                            >
                              {item.youtubeLink}
                            </a>
                          )}
                        </div>
                      )}

                      {item.attachments?.map((file, i) => {
                        // Extract filename from URL just to make it look clean
                        const splitted = file.split("/");
                        const filename = splitted[splitted.length - 1];
                        return (
                          <a
                            key={i}
                            href={file}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 flex items-center gap-2 border border-gray-300 p-3 rounded-md bg-gray-50 text-sm truncate"
                          >
                            <img src={fileIcon} className="w-4" alt="file" /> {filename}
                          </a>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div
                        onClick={() =>
                          setActiveCommentBox(
                            activeCommentBox === item._id ? null : item._id
                          )
                        }
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <img src={commentIcon} className="w-4" alt="comment" />
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
                                  {c.name?.[0]?.toUpperCase() || "U"}
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
    </>
  );
};

export default StudentClassroomStream;
