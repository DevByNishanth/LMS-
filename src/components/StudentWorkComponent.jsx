import React, { useState } from 'react'
import assignmentIcon from '../assets/assignmentWorkIcon.svg'
import fileIcon from '../assets/file-icon.svg'
import { Eye, Search } from 'lucide-react';

const StudentWorkComponent = () => {
    // states 
    const [selectedTab, setSelectedTab] = useState('all');
    return (
        <>
            <div className="rounded-lg border border-gray-200 p-4 min-h-[calc(100vh-160px)] max-h-[calc(100vh-160px)] overflow-auto">

                {/* Assignment Header */}
                <div className="content-container border border-gray-200 bg-[#F9F9F9F9] rounded-lg">
                    <div className="flex justify-between items-start px-4 py-2 border-b border-gray-300">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 bg-[#0B56A4] rounded-full flex items-center justify-center text-white font-semibold">
                                <img src={assignmentIcon} alt="assignmentIcon" className='w-6 h-6' />
                            </div>
                            <div>
                                <h2 className="font-medium text-gray-900 text-md">
                                    Assignment work <span className="text-[#0B56A4]">( 100 Points )</span>
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Posted on 30/1/2026 at 11:42AM
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className=" rounded-lg px-4 py-2 text-sm text-gray-700">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.

                        <div className="flex items-center gap-3 mt-2 px-3 py-2 border border-gray-200 bg-white rounded-lg w-fit hover:bg-gray-100 cursor-pointer">
                            <div className="w-8 h-8 rounded flex items-center justify-center">
                                <img src={fileIcon} alt="assignmentIcon" className='w-7 h-7' />
                            </div>
                            <span className="text-md font-medium text-gray-700">File.txt</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 justify-between  mt-2 mb-2">
                    <div className="btn-container  flex gap-2 bg-gray-100 rounded-full  py-2 px-2">
                        <button onClick={() => setSelectedTab("all")} className={` ${selectedTab == "all" ? "bg-[#0B56A4] text-white" : ""} px-4 py-2 cursor-pointer rounded-full text-sm text-gray-700`}>
                            All Students (60)
                        </button>
                        <button onClick={() => setSelectedTab("submittedStudents")} className={` ${selectedTab == "submittedStudents" ? "bg-[#0B56A4] text-white" : ""} px-4 py-2 cursor-pointer rounded-full text-sm text-gray-700`}>
                            Submitted Students (30)
                        </button>
                        <button onClick={() => setSelectedTab("pendingStudents")} className={` ${selectedTab == "pendingStudents" ? "bg-[#0B56A4] text-white" : ""} px-4 py-2 cursor-pointer rounded-full text-sm text-gray-700`}>
                            Pending Students (30)
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
                                        <button className="bg-[#0B56A4] w-8 h-8 rounded-full flex items-center justify-center">
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