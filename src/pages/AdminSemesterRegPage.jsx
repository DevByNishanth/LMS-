import React from 'react'
import Sidebar from '../components/Sidebar'
import HeaderComponent from '../components/HeaderComponent'
import SemesterRegistrationPage from './SemesterRegistrationPage'
import SemesterRegistrationTable from '../components/SemesterRegistrationTable '

const AdminSemesterRegPage = () => {
    return (
        <>
            <section className="w-full h-screen flex">
                <div className="w-[20%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[100%] md:w-[80%]   h-[100%]">
                    <HeaderComponent title={"Semester Registration"} />

                    <SemesterRegistrationTable/>
                </div>
            </section>
        </>
    )
}

export default AdminSemesterRegPage