import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ClassroomHeader from '../components/ClassroomHeader'
import ClassRoomHomepage from './ClassRoomHomepage';

const ClassRoomPage = () => {
    const [activeTab, setActiveTab] = useState('home');
    return (
        <>
            <section className="w-full h-screen flex">
                <div className="w-[20%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[80%] h-[100%]">
                    {/* <ClassroomHeader activeTab={activeTab} setActiveTab={setActiveTab} /> */}
                    {activeTab.toLowerCase() == "home" && (<ClassRoomHomepage></ClassRoomHomepage>)}
                </div>
            </section>
        </>
    )
}

export default ClassRoomPage