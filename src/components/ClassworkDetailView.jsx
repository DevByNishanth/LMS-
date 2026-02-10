import { Paperclip, User, Users, Send } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import assignmentIcon from '../assets/assignmentWorkIcon.svg'
import fileIcon from '../assets/file-icon.svg'
import StudentWorkComponent from './StudentWorkComponent'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const ClassworkDetailView = ({ selectedAssignment }) => {

    // states
    const [isStudentWorkComponent, setIsStudentWorkComponent] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [firstLetter, setFirstLetter] = useState("");
    const [item, setItem] = useState(selectedAssignment);

    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("LmsToken");

    useEffect(() => {
        setItem(selectedAssignment);
    }, [selectedAssignment]);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const name = decoded?.name || decoded?.username || decoded?.user?.name || "";
                if (name) {
                    setFirstLetter(name[0]?.toUpperCase());
                }
            } catch (error) {
                console.error("Invalid token");
            }
        }
    }, [token]);

    const handlePostComment = async (postId) => {
        if (!commentText.trim()) return;

        try {
            const response = await axios.post(
                `${apiUrl}api/assignment/${postId}/comment`,
                { assignmentId: postId, comment: commentText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200 || response.status === 201) {
                setCommentText("");
                // Manually updating local state for immediate feedback as we don't have a single-item refresh API easily available here
                const newComment = {
                    _id: Date.now().toString(), // temporary ID
                    name: firstLetter + " (You)",
                    comment: commentText,
                    createdAt: new Date().toISOString()
                };
                setItem(prev => ({
                    ...prev,
                    comments: [...(prev.comments || []), newComment]
                }));
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    return (
        <>
            {!isStudentWorkComponent ? <section className='w-full h-full overflow-y-auto'>
                <div className="rounded-lg border border-gray-200 bg-[#F9F9F9]">
                    {/* Header */}
                    <div className="flex justify-between items-start  p-4 border-b border-gray-200 sticky top-0 z-10 bg-[#F9F9F9] rounded-t-lg">
                        <div className="flex gap-3 items-center w-full">
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-full bg-[#0B56A4] flex items-center justify-center text-white font-semibold">
                                <img src={assignmentIcon} alt="assignmentIcon" className='w-6 h-6' />
                            </div>

                            {/* Title */}
                            <div className='flex gap-1 justify-between w-full'>
                                <h2 className="font-medium text-gray-900">
                                    {selectedAssignment?.title} <span className="text-[#0B56A4]">( {selectedAssignment.marks} Points )</span>
                                </h2>
                                <p className="text-xs text-[#646464] mt-1">
                                    Posted on <span className="">{selectedAssignment?.createdAt && new Date(selectedAssignment.createdAt).toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-4 pt-2">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {selectedAssignment?.instruction}
                        </p>

                        {/* File */}
                        <div className="flex items-center gap-3 mt-2 px-3 py-2 border border-gray-200 rounded-lg bg-white w-fit hover:bg-gray-100 cursor-pointer">
                            <div className="w-8 h-8 rounded flex items-center justify-center">
                                <img src={fileIcon} alt="assignmentIcon" className='w-7 h-7' />
                            </div>
                            <span className="text-md font-medium text-gray-700">File.txt</span>
                        </div>
                    </div>

                    {/* Review Grades */}
                    <div className="flex justify-end px-4 mb-2">
                        <button onClick={() => setIsStudentWorkComponent(true)} className="flex items-center gap-2 bg-[#0B56A4] text-white text-sm px-4 cursor-pointer py-2 rounded-lg hover:bg-[#0B56A4]/90">
                            <Users /> View student work
                        </button>
                    </div>

                    {/* Comments */}
                    <div className="mt-4 pt-3 border-t border-gray-200 px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <span className="text-black font-medium">
                                {item.comments?.length > 0 ? `${item.comments.length} Class comments` : "Class comments"}
                            </span>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                            {item.comments && item.comments.length > 0 ? (
                                item.comments.map((comment, idx) => (
                                    <div key={comment._id || idx} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs flex-shrink-0">
                                            {comment.name ? comment.name[0]?.toUpperCase() : "U"}
                                        </div>
                                        <div className="bg-gray-100 rounded-lg p-3 flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-semibold text-gray-900">
                                                    {comment.name || "User"}
                                                </span>
                                                <span className="text-[10px] text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700">{comment.comment}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center italic">No comments yet. Be the first to comment!</p>
                            )}
                        </div>

                        {/* Add Comment Input */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#0B56A4] flex items-center justify-center text-white text-xs flex-shrink-0">
                                {firstLetter || "U"}
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a class comment..."
                                    className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#0B56A4]"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handlePostComment(item._id);
                                    }}
                                />
                                <button
                                    onClick={() => handlePostComment(item._id)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0B56A4] hover:bg-blue-50 p-1 rounded-full"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </section > : <StudentWorkComponent selectedAssignment={selectedAssignment} />
            }
        </>
    )
}

export default ClassworkDetailView