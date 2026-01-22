import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import notification from '../assets/notification.svg'
import { Bell, ChevronRight, User } from "lucide-react";
import bookIcon from '../assets/activeBookIcon.svg'
import upSideRightArrow from '../assets/upSideRightArrow.svg'
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'

const allocatedSubjects = [
    { subjectCode: "CS6801", subject: "Artificial Intelligence and Data Science", credits: 3, classDetails: { year: "3rd Year", department: "B.E CSE", section: "A" } },
    { subjectCode: "CS6801", subject: "Artificial Intelligence and Data Science", credits: 3, classDetails: { year: "3rd Year", department: "B.E CSE", section: "A" } },
    { subjectCode: "CS6801", subject: "Artificial Intelligence and Data Science", credits: 3, classDetails: { year: "3rd Year", department: "B.E CSE", section: "A" } },
    { subjectCode: "CS6801", subject: "Artificial Intelligence and Data Science", credits: 3, classDetails: { year: "3rd Year", department: "B.E CSE", section: "A" } },
    { subjectCode: "CS6801", subject: "Artificial Intelligence and Data Science", credits: 3, classDetails: { year: "3rd Year", department: "B.E CSE", section: "A" } },
]

const StudentAttendancePage = () => {
    const [selectedSemester, setSelectedSemester] = useState("Odd Semester");
    const [accademicYear, setAccademicYear] = useState("2025 - 2026");
    const [firstName, setFirstName] = useState("");

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
    return (
        <>
            <section className="w-full h-screen flex ">
                <div className="w-[20%]">
                    <Sidebar />
                </div>

                {/* main container  */}

                <div className="container-2 w-[80%] h-full px-6 ">
                    {/* header section  */}
                    <div className="w-full flex items-center justify-between py-4  bg-white">
                        {/* Left: Breadcrumb */}
                        <div className="flex items-center">
                            <span className="text-lg font-medium text-[#282526]">Student Attendance</span>
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

                    {/* tab section  */}
                    <div className="tab-container flex gap-4 items-center justify-end mt-4">
                        <select onChange={(e) => setAccademicYear(e.target.value)} className='border px-4 border-gray-400 py-1 rounded'>
                            <option value="2025-2026">2025 - 2026</option>
                            <option value="2026-2027">2027 - 2027</option>
                            <option value="2027-2028">2027 - 2028</option>
                        </select>

                        <select onChange={(e) => setSelectedSemester(e.target.value)} className='border px-4 border-gray-400 py-1 rounded'>
                            <option value="Odd Semester">Odd Semester</option>
                            <option value="Even Semester">Even Semester</option>
                        </select>
                    </div>

                    {/* main body section  */}
                    <div className="main-container mt-4 max-h-[calc(100vh-170px)] space-y-3 overflow-auto">
                        {allocatedSubjects.map((item) => {
                            const queryData = encodeURIComponent(JSON.stringify(
                                {
                                    subject: item.subject,
                                    subjectCode: item.subjectCode,
                                    department: item.classDetails.department,
                                    credits: item.credits,
                                    year: item.classDetails.year,
                                    section: item.classDetails.section,
                                    accademicYear: accademicYear,
                                    selectedSemester: selectedSemester
                                }
                            ))
                            return <div className="card border border-gray-300 bg-[#F9F9F9] p-4 rounded-xl flex items-center gap-2 justify-between">
                                <div className="first-container flex items-center gap-3">
                                    <div className="icon-container w-11 h-11 bg-[#0B56A4] flex items-center justify-center rounded-full">
                                        <img src={bookIcon} className="h-[80%] w-[55%]" />
                                    </div>
                                    <h1 className='text-[#0B56A4] font-medium text-lg'>{item.subjectCode} - {item.subject}</h1>
                                </div>
                                <div className="second-container flex items-center gap-6 text-lg">
                                    <h1 className='font-medium'>({item.classDetails.year} - {item.classDetails.department} - {item.classDetails.section} Section)</h1>
                                    <Link to={`/dashboard/sudentAttendance/${item.subjectCode}/?data=${queryData}`} className="icon-container cursor-pointer w-11 h-11 hover:bg-[#0f6fd6] bg-[#0B56A4] flex items-center justify-center rounded-full">
                                        <img src={upSideRightArrow} className="h-[80%] w-[55%]" />
                                    </Link>
                                </div>
                            </div>
                        })}
                    </div>
                </div>

            </section>
        </>
    )
}

export default StudentAttendancePage