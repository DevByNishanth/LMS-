import React from 'react'
import Sidebar from '../components/Sidebar'
import HeaderComponent from '../components/HeaderComponent'
import TimeTable from '../components/TimeTable';

const TimeTableManagementPage = () => {
    // year calculation 
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;


    return (
        <>
            <section className="w-[100%] h-[100vh] flex">
                <div className="container-1 w-[20%] hidden md:block h-[100%]">
                    <Sidebar />
                </div>
                {/* main content  */}
                <div className="container-2 w-full md:w-[80%] h-[100%]">
                    <HeaderComponent title={`Time Table Management ${currentYear} - ${nextYear}`} />

                    {/* table  */}
                    <TimeTable />
                </div>
            </section>
        </>
    )
}

export default TimeTableManagementPage