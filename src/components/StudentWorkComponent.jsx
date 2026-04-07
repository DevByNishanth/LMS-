import React, { useState } from 'react';
import { Eye, Search, FileText, Link as LinkIcon, Video as VideoIcon, ExternalLink } from 'lucide-react';
import assignmentIcon from '../assets/assignmentWorkIcon.svg';
import fileIcon from '../assets/file-icon.svg';

const StudentWorkComponent = ({ selectedAssignment }) => {
    // states 
    const [selectedTab, setSelectedTab] = useState('all');
    return (
        <>
            <div className="rounded-lg border border-gray-200 p-4 min-h-[calc(100vh-180px)] max-h-[calc(100vh-160px)] overflow-auto">

                {/* Assignment Header */}
                <div className="content-container border border-gray-200 bg-[#F9F9F9F9] rounded-lg">
                    <div className="flex justify-between items-start w-full  px-4 py-2 border-b border-gray-300">
                        <div className="flex gap-3 items-center w-full   ">
                            <div className="w-10 h-10 bg-[#08384F]  bgrounded-full flex items-center justify-center text-white font-semibold">
                                <img src={assignmentIcon} alt="assignmentIcon" className='w-6 h-6' />
                            </div>
                            <div className=" w-full flex items-center justify-between">
                                <h2 className="font-medium text-gray-900 text-md">
                                    {selectedAssignment?.title}  {selectedAssignment?.marks && <span className="text-[#0B56A4]">( {selectedAssignment?.marks} Points )</span>}
                                </h2>
                                <p className="text-xs text-[#646464] mt-1">
                                    Posted on <span className="">{selectedAssignment?.createdAt && new Date(selectedAssignment.createdAt).toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className=" rounded-lg px-4 py-2 text-sm text-gray-700">
                        <p>{selectedAssignment?.instruction}</p>

                        <div className="flex flex-wrap gap-3 mt-4">
                            {/* Files */}
                            {selectedAssignment?.attachments?.map((fileUrl, index) => (
                                <a
                                    key={index}
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <FileText className="w-5 h-5 text-[#0B56A4]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                                            {fileUrl.split('/').pop().split('-').slice(2).join('-') || "Attachment"}
                                        </span>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">File</span>
                                    </div>
                                    <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                </a>
                            ))}

                            {/* External Link */}
                            {selectedAssignment?.link && (
                                <a
                                    href={selectedAssignment.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                        <LinkIcon className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                                            {selectedAssignment.link}
                                        </span>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Link</span>
                                    </div>
                                    <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                </a>
                            )}

                            {/* YouTube Link */}
                            {selectedAssignment?.youtubeLink && (
                                <a
                                    href={selectedAssignment.youtubeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                        <VideoIcon className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                                            YouTube Video
                                        </span>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">YouTube</span>
                                    </div>
                                    <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 justify-between  mt-2 mb-2">
                    <div className="btn-container  flex gap-2 bg-gray-100 rounded-full  py-2 px-2">
                        <button onClick={() => setSelectedTab("all")} className={` ${selectedTab == "all" ? "bg-[#08384F]  text-white" : ""} px-4 py-2 cursor-pointer rounded-full text-sm text-gray-700`}>
                            All Students ({selectedAssignment?.stats?.totalStudents})
                        </button>
                        <button onClick={() => setSelectedTab("submittedStudents")} className={` ${selectedTab == "submittedStudents" ? "bg-[#08384F]  text-white" : ""} px-4 py-2 cursor-pointer rounded-full text-sm text-gray-700`}>
                            Submitted Students ({selectedAssignment?.stats?.submitted})
                        </button>
                        <button onClick={() => setSelectedTab("pendingStudents")} className={` ${selectedTab == "pendingStudents" ? "bg-[#08384F]  text-white" : ""} px-4 py-2 cursor-pointer rounded-full text-sm text-gray-700`}>
                            Pending Students ({selectedAssignment?.stats?.pending})
                        </button>
                    </div>
                    {/* search box  */}
                    <div className="relative border border-gray-300 w-[30%] rounded-lg">
                        <input
                            type="text"
                            placeholder="Search Name"
                            className="pl-3 w-[80%]  py-2 text-sm focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 translate-y-[-50%] text-gray-400"><Search className="w-4 h-4" /></span>
                    </div>

                </div>

                {/* Table */}
                <div className="rounded-lg max-h-[calc(100vh-460px)] border border-gray-200 overflow-y-auto">
                    <table className="w-full text-sm ">
                        <thead className="bg-slate-800 text-white sticky top-0 z-10">
                            <tr>
                                <th className="p-3 text-left">
                                    <input type="checkbox" className="accent-[#0B56A4] scale-120" />
                                </th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Attachment</th>
                                <th className="p-3 text-left">Grade</th>
                                <th className="p-3 text-left">Action</th>
                            </tr>
                        </thead>

                        <tbody className="">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((_, i) => (
                                <tr
                                    key={i}
                                    className={`${i % 2 === 0 ? "bg-gray-100" : "bg-white"
                                        }`}
                                >
                                    <td className="p-3">
                                        <input type="checkbox" className="accent-[#0B56A4] scale-120" />
                                    </td>

                                    <td className="p-3 flex items-center gap-2">
                                        <img
                                            src="https://i.pravatar.cc/30"
                                            alt="avatar"
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span>Surya Chandran</span>
                                    </td>

                                    <td className="p-3">
                                        {i % 2 === 0 ? (
                                            <span className="flex items-center gap-1 text-black">
                                                <img src={fileIcon} alt="fileIcon" className="w-7 h-7" /> File.txt
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">Nill</span>
                                        )}
                                    </td>

                                    <td className="p-3 text-gray-700">__ / 100</td>

                                    <td className="p-3">
                                        <button className="bg-[#08384F]  bgw-8 h-8 rounded-full flex items-center justify-center">
                                            <Eye className="w-5 h-5 text-white" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}

export default StudentWorkComponent