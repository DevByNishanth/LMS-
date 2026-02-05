import React, { useEffect, useState } from "react";
import { Bell, ChevronRight } from "lucide-react";
import notificationIcon from "../assets/notification.svg";
import activeHomeIcon from "../assets/activeHomeIcon.svg";
import calendarIcon from "../assets/calendarIcon.svg";
import archiveIcon from "../assets/archiveIcon.svg";
import homeInActive from "../assets/homeInActive.svg";
import calendarActive from "../assets/calendarActive.svg";
import archiveActive from "../assets/archiveActive.svg";
import { jwtDecode } from "jwt-decode";
import classWorkIcon from "../assets/classWorkIcon.svg";
import peopleIcon from "../assets/peopleIcon.svg";
import gradeIcon from "../assets/gradesIcon.svg";
import activeSteamIcon from "../assets/activeSteamIcon.svg";

const ClassroomHeader = ({ activeTab, setActiveTab }) => {
    const [firstLetter, setFirstLetter] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("LmsToken");

        if (token) {
            try {
                const decoded = jwtDecode(token);

                const name =
                    decoded?.name || decoded?.username || decoded?.user?.name || "";

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
                <div className="tabs flex flex-wrap items-center gap-4">
                    <button
                        onClick={() => setActiveTab("stream")}
                        className={`${activeTab.toLowerCase() == "stream" ? "bg-[#0B56A4] text-white" : "bg-[#D9EBFE] text-black"} flex items-center gap-2 py-2 px-5 rounded-full `}
                    >
                        <span>
                            <img
                                src={
                                    activeTab.toLowerCase() == "stream"
                                        ? activeSteamIcon
                                        : homeInActive
                                }
                                className="w-6 h-6"
                            />
                        </span>
                        Stream
                    </button>
                    <button
                        onClick={() => setActiveTab("classwork")}
                        className={`${activeTab.toLowerCase() == "classwork" ? "bg-[#0B56A4] text-white" : "bg-[#D9EBFE] text-black"} flex items-center gap-2 py-2 px-5 rounded-full `}
                    >
                        <span>
                            <img
                                src={
                                    activeTab.toLowerCase() == "classwork"
                                        ? calendarActive
                                        : classWorkIcon
                                }
                                className="w-6 h-6"
                            />
                        </span>
                        Classwork
                    </button>
                    <button
                        onClick={() => setActiveTab("people")}
                        className={`${activeTab.toLowerCase() == "people" ? "bg-[#0B56A4] text-white" : "bg-[#D9EBFE] text-black"} flex items-center gap-2 py-2 px-5 rounded-full `}
                    >
                        <span>
                            <img
                                src={
                                    activeTab.toLowerCase() == "people"
                                        ? archiveActive
                                        : peopleIcon
                                }
                                className="w-6 h-6"
                            />
                        </span>
                        Peoples
                    </button>
                    <button
                        onClick={() => setActiveTab("grades")}
                        className={`${activeTab.toLowerCase() == "grades" ? "bg-[#0B56A4] text-white" : "bg-[#D9EBFE] text-black"} flex items-center gap-2 py-2 px-5 rounded-full `}
                    >
                        <span>
                            <img
                                src={
                                    activeTab.toLowerCase() == "grades"
                                        ? archiveActive
                                        : gradeIcon
                                }
                                className="w-6 h-6"
                            />
                        </span>
                        Grades
                    </button>
                    <button
                        onClick={() => setActiveTab("attendance")}
                        className={`${activeTab.toLowerCase() == "attendance" ? "bg-[#0B56A4] text-white" : "bg-[#D9EBFE] text-black"} flex items-center gap-2 py-2 px-5 rounded-full `}
                    >
                        <span>
                            <img
                                src={
                                    activeTab.toLowerCase() == "attendance"
                                        ? archiveActive
                                        : gradeIcon
                                }
                                className="w-6 h-6"
                            />
                        </span>
                        Attendance
                    </button>
                    <button
                        onClick={() => setActiveTab("subjectPlanning")}
                        className={`${activeTab.toLowerCase() == "subjectplanning" ? "bg-[#0B56A4] text-white" : "bg-[#D9EBFE] text-black"} flex items-center gap-2 py-2 px-5 rounded-full `}
                    >
                        <span>
                            <img
                                src={
                                    activeTab.toLowerCase() == "subjectplanning"
                                        ? archiveActive
                                        : gradeIcon
                                }
                                className="w-6 h-6"
                            />
                        </span>
                        Subject Planning
                    </button>
                </div>
            </div>
        </>
    );
};

export default ClassroomHeader;
