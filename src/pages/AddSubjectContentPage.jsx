import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import notification from '../assets/notification.svg'
import { ChevronRight } from "lucide-react";
import { Link, useParams, useSearchParams } from 'react-router-dom';
import UnitComponent from '../components/UnitComponent';
import SubjectSubTopicsTable from '../components/SubjectSubTopicsTable';
import { jwtDecode } from 'jwt-decode';
const AddSubjectContentPage = () => {
    // router dom hooks 
    const [searchParams] = useSearchParams()
    const { subjectCode } = useParams()

    const query_data = JSON.parse(searchParams.get("data"));

    // states 
    const [firstName, setFirstName] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("Unit 1");

    // useEffect call's 
    useEffect(() => {
        const token = localStorage.getItem("LmsToken");
        if (!token) {
            return
        } else {
            const decoded = jwtDecode(token);
            setFirstName(decoded.name.charAt(0).toUpperCase());
        }
    }, [])

    console.log("query_data", query_data);
    return (
        <>
            <section className="w-full h-screen flex">
                <div className="w-[20%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[80%] h-full px-6 ">
                    {/* header section  */}
                    <div className="w-full flex items-center justify-between py-4  bg-white">
                        {/* Left: Breadcrumb */}
                        <div className="flex items-center">
                            <Link to={`/dashboard/subjectPlanning`} className="text-lg font-medium text-[#282526]">Subject Planning</Link>
                            <span className="text-gray-600"><ChevronRight /></span>

                            <span className="text-[#0B56A4] font-medium text-lg">
                                {subjectCode}  {" "} {query_data.subject}
                            </span>
                        </div>

                        {/* Right: Icons */}
                        <div className="flex items-center gap-4">
                            {/* Notification */}
                            <div className="p-2 rounded-full bg-gray-50 shadow-sm hover:shadow-md transition">
                                <img src={notification} className="w-4 h-4" />
                            </div>

                            {/* Profile Image */}
                            <div className="w-8 h-8 rounded-full bg-[#0B56A4] text-white flex items-center justify-center font-semibold shadow-sm">
                                {firstName}
                            </div>
                        </div>
                    </div>

                    {/* department-details  */}
                    <div className="department-details-container mt-2">
                        <div className="container-1 flex items-center justify-between">
                            <h1 className='text-[#0B56A4] font-medium text-lg'>{query_data.department} - {query_data.sectionName} </h1>
                            <h1 className='text-[#333333] font-medium text-lg'>{query_data.accademicYear} - ({query_data.selectedSemester})</h1>
                        </div>
                        <div className="container-2"></div>
                    </div>

                    {/* main body container  */}
                    <div className="main-container w-full flex gap-2 mt-8 max-h-[calc(100vh-160px)]">
                        <UnitComponent onSelect={(unit) => setSelectedUnit(unit)} />
                        <SubjectSubTopicsTable selectedUnit={selectedUnit} />
                    </div>

                </div>
            </section>
        </>
    )
}

export default AddSubjectContentPage