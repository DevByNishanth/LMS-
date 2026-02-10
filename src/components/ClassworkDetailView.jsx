import { Paperclip, User, Users } from 'lucide-react'
import React, { useState } from 'react'
import assignmentIcon from '../assets/assignmentWorkIcon.svg'
import fileIcon from '../assets/file-icon.svg'
import StudentWorkComponent from './StudentWorkComponent'

const ClassworkDetailView = ({ selectedAssignment }) => {
    // states
    const [isStudentWorkComponent, setIsStudentWorkComponent] = useState(false);

    return (
        <>
            {!isStudentWorkComponent ? <section className='w-full h-full overflow-y-auto'>
                <div className="rounded-lg border border-gray-200 bg-[#F9F9F9]">
                    {/* Header */}
                    <div className="flex justify-between items-start p-4 border-b border-gray-200 sticky top-0 z-10 bg-[#F9F9F9] rounded-t-lg">
                        <div className="flex gap-3">
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-full bg-[#0B56A4] flex items-center justify-center text-white font-semibold">
                                <img src={assignmentIcon} alt="assignmentIcon" className='w-6 h-6' />
                            </div>

                            {/* Title */}
                            <div>
                                <h2 className="font-medium text-gray-900">
                                    Assignment work <span className="text-[#0B56A4]">( 100 Points )</span>
                                </h2>
                                <p className="text-xs text-[#646464] mt-1">
                                    Posted on 30/1/2026 at 11:42AM
                                </p>
                            </div>
                        </div>

                        <button className="text-gray-400 hover:text-gray-600">⋮</button>
                    </div>

                    {/* Description */}
                    <div className="px-4 pt-2">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry's standard dummy text ever since the
                            1500s, Lorem Ipsum is simply dummy text of the printing and typesetting
                            industry. Lorem Ipsum has been the industry's standard dummy text ever
                            since the 1500s.
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
                    <div className="max-h-[240px] overflow-y-auto border-t border-gray-300">
                        {/* Add comment */}
                        <div className="flex items-center gap-3 p-4 sticky top-0 bg-[#F9F9F9]">
                            <img
                                src="https://i.pravatar.cc/40"
                                alt="avatar"
                                className="w-8 h-8 rounded-full"
                            />
                            <input
                                type="text"
                                placeholder="Add a comment"
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                            />
                            <button className="text-[#0B56A4] text-2xl">➤</button>
                        </div>

                        {/* Comment 1 */}
                        <div className="flex gap-3 px-4 py-3">
                            <img
                                src="https://i.pravatar.cc/41"
                                alt="avatar"
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium text-gray-800">Dharsan PM</p>
                                    <p className="text-xs text-gray-500">30/1/2026</p>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting
                                    industry. Lorem Ipsum has been the industry's standard dummy text ever
                                    since the 1500s
                                </p>
                            </div>
                        </div>

                        {/* Comment 2 */}
                        <div className="flex gap-3 px-4 py-3">
                            <img
                                src="https://i.pravatar.cc/42"
                                alt="avatar"
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium text-gray-800">Nishanth</p>
                                    <p className="text-xs text-gray-500">30/1/2026</p>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting
                                    industry. Lorem Ipsum has been the industry's standard dummy text ever
                                    since the 1500s
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </section> : <StudentWorkComponent selectedAssignment={selectedAssignment} />}
        </>
    )
}

export default ClassworkDetailView