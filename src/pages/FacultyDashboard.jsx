import React from 'react'
import Sidebar from '../components/Sidebar'
import FacultyDashboardComponent from '../components/FacultyDashboardComponent'

const FacultyDashboard = () => {
    return (
        <>
            <section className="w-full h-screen flex">
                <div className="container-1 w-[20%] h-full">
                    <Sidebar />
                </div>

                <div className="container-2 w-[80%] h-full">
                   <FacultyDashboardComponent />
                </div>
            </section>
        </>
    )
}

export default FacultyDashboard