import React from 'react'
import Sidebar from '../components/Sidebar'
import StudentDashboardComponent from '../components/StudentDashboardComponent'

const StudentDashboardPage = () => {
    return (
        <>
            <section className="w-full h-screen flex">
                <div className="container-1 w-[20%] h-full">
                    <Sidebar />
                </div>

                <div className="container-2 w-[80%] h-full">
                   <StudentDashboardComponent />
                </div>
            </section>
        </>
    )
}

export default StudentDashboardPage