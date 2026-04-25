import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import HeaderComponent from '../components/HeaderComponent'
import StudentClassroomHeader from '../components/StudentClassroomHeader'
import StudentClassroomStream from '../components/StudentClassroomStream'
import StudentClassroomClasswork from '../components/StudentClassroomClasswork'
import StudentClassroomPeople from '../components/StudentClassroomPeople'

const DashboardStudentClassroomDetails = () => {
    const [activeTab, setActiveTab] = useState("stream");

    return (
        <>
            <section className="w-full h-screen flex">
                <div className="w-[20%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[80%] h-[100%] overflow-y-auto">
                    <HeaderComponent title="Classroom" second="Student View" secondColor="text-[#0B56A4]" />
                    <StudentClassroomHeader activeTab={activeTab} setActiveTab={setActiveTab} />
                    <section className="main-section mx-6 py-2 h-[calc(100vh-150px)]">
                        <div className="component-container w-full h-full">
                            {activeTab === "stream" && <StudentClassroomStream />}
                            {activeTab === "classwork" && <StudentClassroomClasswork />}
                            {activeTab === "people" && <StudentClassroomPeople />}
                        </div>
                    </section>
                </div>
            </section>
        </>
    )
}

export default DashboardStudentClassroomDetails
