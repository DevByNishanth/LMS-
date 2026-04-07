import React from 'react'
import Sidebar from '../components/Sidebar'
import HeaderComponent from '../components/HeaderComponent'
import StudentClassroom from './Student_Classroom'

const DashboardStudentClassroom = () => {
    return (
        <>
            <section className="w-full h-screen flex">
                <div className="w-[20%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[80%] h-[100%] overflow-y-auto">
                    <HeaderComponent title="Classroom" second="Student View" secondColor="text-[#0B56A4]" />
                    <StudentClassroom />
                </div>
            </section>
        </>
    )
}

export default DashboardStudentClassroom
