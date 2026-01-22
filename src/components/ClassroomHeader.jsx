import React, { useEffect, useState } from 'react'
import { Bell, ChevronRight } from "lucide-react";
import notificationIcon from "../assets/notification.svg";
import activeHomeIcon from '../assets/activeHomeIcon.svg'
import calendarIcon from '../assets/calendarIcon.svg'
import archiveIcon from '../assets/archiveIcon.svg'
import homeInActive from '../assets/homeInActive.svg'
import calendarActive from '../assets/calendarActive.svg'
import archiveActive from '../assets/archiveActive.svg'
import { jwtDecode } from "jwt-decode";
const ClassroomHeader = ({ activeTab, setActiveTab }) => {
    const [firstLetter, setFirstLetter] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("LmsToken");

        if (token) {
            try {
                const decoded = jwtDecode(token);

                const name =
                    decoded?.name ||
                    decoded?.username ||
                    decoded?.user?.name ||
                    "";

                if (name) {
                    setFirstLetter(name.charAt(0).toUpperCase());
                }
            } catch (error) {
                console.error("Invalid token");
            }
        }
    }, []);
    return (
        <>

            <div className="w-full flex items-center justify-between px-6 py-3 bg-white ">
                <div className="tabs flex items-center gap-4">
                    <button onClick={() => setActiveTab("home")} className={`${activeTab.toLowerCase() == "home" ? "bg-[#0B56A4] text-white" : "bg-[#D9EBFE] text-black"} flex items-center gap-2 py-2 px-5 rounded-full `}><span><img src={activeTab.toLowerCase() == "home" ? activeHomeIcon : homeInActive} className="w-6 h-6" /></span>Home</button>
                    <button onClick={() => setActiveTab("calendar")} className={`${activeTab.toLowerCase() == "calendar" ? "bg-[#0B56A4] text-white" : "bg-[#D9EBFE] text-black"} flex items-center gap-2 py-2 px-5 rounded-full `}><span><img src={activeTab.toLowerCase() == "calendar" ? calendarActive : calendarIcon} className="w-6 h-6" /></span>Calendar</button>
                    <button onClick={() => setActiveTab("archived classes")} className={`${activeTab.toLowerCase() == "archived classes" ? "bg-[#0B56A4] text-white" : "bg-[#D9EBFE] text-black"} flex items-center gap-2 py-2 px-5 rounded-full `}><span><img src={activeTab.toLowerCase() == "archived classes" ? archiveActive : archiveIcon} className="w-6 h-6" /></span>Archived Classes</button>
                </div>

                {/* Right - Icons */}
                <div className="flex items-center gap-3">
                    {/* Notification Icon */}
                    <div className="p-2 rounded-full bg-gray-50 shadow-sm hover:shadow-md transition">
                        <img src={notificationIcon} className="w-4 h-4" />
                    </div>

                    {/* Profile Image */}
                    <div className="w-8 h-8 rounded-full bg-[#0B56A4] text-white flex items-center justify-center font-semibold shadow-sm">
                        {firstLetter}
                    </div>
                </div>
            </div>

        </>
    )
}

export default ClassroomHeader