import { Plus } from 'lucide-react';
import React, { useState } from 'react'
import profileImg from '../assets/profileImg.svg';

const teachersList = [
    { name: "Surya Chandran" },
    { name: "Surya Chandran" },
    { name: "Surya Chandran" },
    { name: "Surya Chandran" },
    { name: "Surya Chandran" },
]
const studentsList = [
    { name: "Chandran" },
    { name: "Chandran" },
    { name: "Chandran" },
    { name: "Chandran" },
    { name: "Chandran" },
]

const ClassroompeopleContainer = () => {
    const [selectedTab, setSelectedTab] = useState('Teachers');
    return (
        <section className='w-full p-6 h-full border border-[#DBDBDB] rounded-lg'>
            {/* tab container  */}

            <div className="tab-container px-4 py-2 flex items-center gap-2 bg-[#E6E9F5] rounded-full">
                <button onClick={() => setSelectedTab("Teachers")} className={`w-1/2 py-2 px-3 cursor-pointer rounded-full ${selectedTab == "Teachers" ? "bg-[#0B56A4] text-white" : "text-black"}`}>Teachers</button>
                <button onClick={() => { setSelectedTab("Students") }} className={`w-1/2 py-2 cursor-pointer px-3 rounded-full ${selectedTab == "Students" ? "bg-[#0B56A4] text-white" : "text-black"}`}>Students</button>
            </div>

            <header className='mt-4 flex items-center justify-between'>
                <h1 className='font-medium text-lg'>{selectedTab} List <span className='text-[#0B56A4]'>(3)</span></h1>
                <button className='flex items-center gap-3 text-white bg-[#0B56A4] px-3 py-2 rounded-lg'><Plus className="text-white"></Plus> Add</button>
            </header>

            {/* people-list  */}

            {selectedTab == "Teachers" ? <div className="teachers-list w-full  mt-2 max-h-[calc(100vh-320px)] overflow-auto  space-y-2">
                {teachersList.map((item, index) => {
                    return <div className="flex items-center justify-between py-3 border-b border-gray-300">
                        <div className="flex items-center gap-3">
                            <img
                                src={profileImg} // replace with your imported image
                                alt="user"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <p className="text-sm font-medium text-gray-800">
                                Surya Chandran
                            </p>
                        </div>

                        <div className="text-gray-900 text-xl font-medium cursor-pointer">
                            &#8942;
                        </div>
                    </div>
                }
                )}
            </div> : <div className="students-list w-full  mt-2 max-h-[calc(100vh-320px)] overflow-auto  space-y-2">
                {studentsList.map((item, index) => {
                    return <div className="flex items-center justify-between py-3 border-b border-gray-300">
                        <div className="flex items-center gap-3">
                            <img
                                src={profileImg} // replace with your imported image
                                alt="user"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <p className="text-sm font-medium text-gray-800">
                            {item.name}
                            </p>
                        </div>

                        <div className="text-gray-900 text-xl font-medium cursor-pointer">
                            &#8942;
                        </div>
                    </div>
                }
                )}
            </div>}




        </section>
    )
}

export default ClassroompeopleContainer