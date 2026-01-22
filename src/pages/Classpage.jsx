import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ClassroomHeader from '../components/ClassroomHeader'
import { ChevronRight } from 'lucide-react';
import classWorkIcon from '../assets/classWorkIcon.svg'
import peopleIcon from '../assets/peopleIcon.svg'
import gradeIcon from '../assets/gradesIcon.svg'
import activeSteamIcon from '../assets/activeSteamIcon.svg'
import ClassRoomStreamComponent from '../components/ClassRoomStreamComponent';
import ClassRoomClassworkComponent from '../components/ClassRoomClassworkComponent';
import ClassroompeopleContainer from '../components/ClassroompeopleContainer';

const Classpage = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [activeItem, setActiveItem] = useState('Stream');


    return (
        <>
            <section className="w-full h-screen flex">
                <div className="w-[20%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[80%] h-[100%]">
                    <ClassroomHeader activeTab={activeTab} setActiveTab={setActiveTab} />
                    {/* Breadcrumbs   */}
                    <div className="main-content-container p-6">
                        <div className="breadcrumsb-container">
                            <h1 className='flex items-center '>Class <span><ChevronRight className='w-6 h-6' /></span> <span className='text-[#0B56A4] font-medium'>|||_CSE _ A - Crypto and Encryption </span></h1>
                        </div>
                    </div>

                    {/* body section  */}

                    <section className='main-section mx-6 py-2 h-[calc(100vh-150px)] flex gap-4 '>
                        {/* tabs-container  */}
                        <div className="tab-container w-[25%] h-full bg-white border border-gray-200 rounded-lg p-3 space-y-2 ">
                            {/* Stream */}
                            <div onClick={() => setActiveItem('Stream')} className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${activeItem === 'Stream' ? 'bg-[#0B56A4] text-white' : 'hover:bg-gray-100'}`}>
                                <div className="flex items-center gap-2">
                                    <img src={activeItem == "Stream" ? activeSteamIcon : ""} className="w-6 h-6" />
                                    <span className="text-sm font-medium">Stream</span>
                                </div>
                                <span className="text-lg">{'>'}</span>
                            </div>

                            {/* Classwork */}
                            <div onClick={() => setActiveItem('Classwork')} className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${activeItem === 'Classwork' ? 'bg-[#0B56A4] text-white' : 'hover:bg-gray-100'}`}>
                                <div className="flex items-center gap-2">
                                    <img src={activeItem == "Classwork" ? "" : classWorkIcon} className="w-6 h-6" />
                                    <span className={`text-sm font-medium ${activeItem === 'Classwork' ? 'text-white' : 'text-gray-800'}`}>Classwork</span>
                                </div>
                                <span className={`text-lg ${activeItem === 'Classwork' ? 'text-white' : 'text-gray-400'}`}>{'>'}</span>
                            </div>

                            {/* People */}
                            <div onClick={() => setActiveItem('People')} className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${activeItem === 'People' ? 'bg-[#0B56A4] text-white' : 'hover:bg-gray-100'}`}>
                                <div className="flex items-center gap-2">
                                    <img src={activeItem == "People" ? "" : peopleIcon} className="w-6 h-6" />
                                    <span className={`text-sm font-medium ${activeItem === 'People' ? 'text-white' : 'text-gray-800'}`}>People</span>
                                </div>
                                <span className={`text-lg ${activeItem === 'People' ? 'text-white' : 'text-gray-400'}`}>{'>'}</span>
                            </div>

                            {/* Grades */}
                            <div onClick={() => setActiveItem('Grades')} className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${activeItem === 'Grades' ? 'bg-[#0B56A4] text-white' : 'hover:bg-gray-100'}`}>
                                <div className="flex items-center gap-2">
                                    <img src={activeItem == "Grades" ? "" : gradeIcon} className="w-6 h-6" />
                                    <span className={`text-sm font-medium ${activeItem === 'Grades' ? 'text-white' : 'text-gray-800'}`}>Grades</span>
                                </div>
                                <span className={`text-lg ${activeItem === 'Grades' ? 'text-white' : 'text-gray-400'}`}>{'>'}</span>
                            </div>
                        </div>

                        <div className="component-container  w-[75%]">
                            {activeItem === 'Stream' && (
                                <ClassRoomStreamComponent />
                            )}
                            {activeItem == "Classwork" && <ClassRoomClassworkComponent />}
                            {activeItem == "People" && <ClassroompeopleContainer/>}
                        </div>

                    </section>




                </div>
            </section>
        </>
    )
}

export default Classpage