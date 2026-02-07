import React, { useState } from 'react';
import noDataImg from '../assets/noData.svg';
import { ChevronDown, Search, Eye } from 'lucide-react';
import assignmentWorkIcon from '../assets/assignmentWorkIcon.svg';

const classWorkData = [
    { title: "Assignment work", postedOn: "30/1/2026 at 11:42AM" },
    { title: "Assignment work", postedOn: "30/1/2026 at 11:42AM" },
    { title: "Assignment work", postedOn: "30/1/2026 at 11:42AM" },
    { title: "Assignment work", postedOn: "30/1/2026 at 11:42AM" },
    { title: "Assignment work", postedOn: "30/1/2026 at 11:42AM" },
    { title: "Assignment work", postedOn: "30/1/2026 at 11:42AM" },
];

const Student_ClassRoomClassworkComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = classWorkData.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className='w-full p-6 h-full border border-[#DBDBDB] rounded-lg bg-white'>
            {classWorkData.length !== 0 ? (
                <>
                    {/* Header Section */}
                    <div className="header-container mb-6">
                        <div className="flex items-center justify-between">
                            <h1 className='text-[#282526] font-medium text-xl'>Classwork List</h1>
                            
                            {/* NEW: View Your Work Button for Students */}
                            <button className="flex items-center gap-2 bg-[#0B56A4] text-white px-5 py-2 rounded-lg hover:bg-[#094a8f] transition-colors shadow-sm cursor-pointer">
                                <Eye size={18} />
                                <span className="font-medium">View Your Work</span>
                            </button>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="flex items-center gap-4 mt-6">
                            <div className="flex-1 border border-gray-300 rounded-lg flex items-center px-3 py-2 bg-white">
                                <input 
                                    type="text" 
                                    placeholder='Search Classwork' 
                                    className='outline-none w-full text-sm'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className='text-gray-400' size={18} />
                            </div>

                            <div className="w-[180px] border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer bg-white hover:bg-gray-50">
                                <span className="text-sm text-gray-700">Assignment</span>
                                <ChevronDown size={18} className="text-gray-500" />
                            </div>
                        </div>
                    </div>

                    {/* Classwork Cards List */}
                    <div className="card-container space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <div 
                                    key={index}
                                    className="group flex items-center rounded-xl bg-[#F9F9F9] px-4 py-4 justify-between border border-gray-200 hover:border-[#0B56A4] hover:shadow-sm transition-all cursor-pointer"
                                >
                                    <div className='flex items-center gap-4'>
                                        <div className="bg-[#0B56A4] w-10 h-10 rounded-full flex items-center justify-center shadow-inner">
                                            <img src={assignmentWorkIcon} className="w-5 h-5" alt="icon" />
                                        </div>
                                        <h1 className='font-medium text-gray-800'>{item.title}</h1>
                                    </div>
                                    
                                    <div className='flex items-center gap-6'>
                                        <h1 className='text-sm text-[#646464]'>
                                            Posted on {item.postedOn}
                                        </h1>
                                        {/* Simplified Student Menu Icon */}
                                        <div className="text-gray-400 hover:text-gray-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400">
                                No classwork matches your search.
                            </div>
                        )}
                    </div>
                </>
            ) : (
                /* Empty State */
                <div className='w-full h-full flex flex-col justify-center items-center py-20'>
                    <div className="mb-6">
                        <img src={noDataImg} className="w-[280px] opacity-80" alt="No data" />
                    </div>
                    <div className="text-center max-w-sm">
                        <h1 className='font-bold text-xl text-[#0B56A4] mb-2'>No Classwork Yet</h1>
                        <p className='text-[#777777] text-sm'>
                            Your instructor hasn't posted any assignments or materials yet. Check back later!
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Student_ClassRoomClassworkComponent;