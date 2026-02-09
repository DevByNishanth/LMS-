import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import user from "../assets/user.svg";
import logo from "../assets/clgLogo.svg";
import semIcon from "../assets/semesterIcon.svg";
import facultyIcon from "../assets/totalFacultyIcon.svg";
import facultyActiveIcon from "../assets/facultyActiveIcon.svg";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import homeInActive from "../assets/homeInActive.svg";
import dbIcon from "../assets/dbIcon.svg";
import dbActiveIcon from "../assets/dbActive.svg";
import sectionManagementIcon from "../assets/sectionManagementIcon.svg";
import activeSectionManagement from "../assets/activeSectionManagement.svg";
import studManagement from "../assets/studManagement.svg";
import book from "../assets/book.svg";
import logoutIcon from "../assets/logoutIcon.svg";
import timeTableActive from "../assets/timeTableActive.svg";

const Sidebar = () => {
  const [role, setRole] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const token = localStorage.getItem("LmsToken");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, [token]);

  const navItems = [
    {
      label: "Dashboard",
      icon: dbIcon,
      activeIcon: dbActiveIcon,
      link: "/dashboard",
      roles: ["admin", "hod", "faculty"],
    },
    {
      label: "Semester Registration",
      icon: semIcon,
      activeIcon: book,
      link: "/dashboard/adminSemReg",
      roles: ["admin"],
    },
    {
      label: "Subject Management",
      icon: semIcon,
      activeIcon: book,
      link: "/dashboard/semesterRegistration",
      roles: ["admin"],
    },
    {
      label: "Faculty Management",
      icon: studManagement,
      activeIcon: user,
      link: "/dashboard/facultyManagement",
      roles: ["admin"],
    },
    {
      label: "Student Management",
      icon: studManagement,
      activeIcon: user,
      link: "/dashboard/studentManagement",
      roles: ["admin"],
    },
    {
      label: "Staff Allocation",
      icon: facultyIcon,
      activeIcon: facultyActiveIcon,
      link: "/dashboard/subjectManagement",
      roles: ["hod"],
    },
    {
      label: "Class Room",
      icon: facultyIcon,
      activeIcon: facultyActiveIcon,
      link: "/dashboard/classroom",
      roles: ["faculty"],
    },
    {
      label: "Section Management",
      icon: sectionManagementIcon,
      activeIcon: activeSectionManagement,
      link: "/dashboard/sectionManagement",
      roles: ["hod"],
    },
    {
      label: "Timetable Management",
      icon: sectionManagementIcon,
      activeIcon: timeTableActive,
      link: "/dashboard/timetableManagement",
      roles: ["hod"],
    },
    {
      label: "Subject Planning",
      icon: semIcon,
      activeIcon: facultyActiveIcon,
      link: "/dashboard/subjectPlanning",
      roles: ["faculty"],
    },
    {
      label: "Student Attendance",
      icon: semIcon,
      activeIcon: facultyActiveIcon,
      link: "/dashboard/sudentAttendance",
      roles: ["faculty"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(role?.toLowerCase()),
  );

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  function handleLogout() {
    localStorage.removeItem("LmsToken");
    window.location.href = "/";
  }

  return (
    <div className="relative hidden md:block">
      <div
        className={`fixed top-0 left-0 h-screen bg-[#D9EBFE] z-50 transition-all duration-300 flex flex-col ${
          collapsed ? "w-[83px]" : "w-[20%]"
        }`}
      >
        <div className="flex items-center justify-center p-4">
          {!collapsed && (
            <img src={logo} alt="logo" className="w-[140px] object-cover" />
          )}
        </div>

        <div className="flex-1 space-y-1 px-2">
          {filteredNavItems.map((item, index) => {
            const active = isActive(item.link);

            return (
              <Link
                key={index}
                to={item.link}
                className={`flex items-center h-[54px] px-2 rounded-l-[14px] transition-all duration-200 ${
                  active
                    ? "bg-white text-[#18283b]"
                    : "text-black hover:bg-white/50"
                }`}
              >
                <span className="min-w-[3rem] text-center">
                  <img src={active ? item.activeIcon : item.icon} alt="icon" />
                </span>

                {!collapsed && (
                  <span
                    className={`font-semibold whitespace-nowrap ${
                      active ? "text-[#0B56A4]" : "text-[#282526]"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        <div className="btn-container px-4 py-6 absolute bottom-4 w-full">
          <button
            onClick={handleLogout}
            className="bg-[#0b56a4] flex items-center gap-3 justify-center text-white px-4 py-2 w-full rounded-lg cursor-pointer hover:bg-[#0b55a4e5]"
          >
            {" "}
            <span>
              <img src={logoutIcon} alt="" />
            </span>{" "}
            Logout
          </button>
        </div>
      </div>

      {collapsed && (
        <div
          onClick={() => setCollapsed(false)}
          className="fixed top-3 left-3 cursor-pointer z-50"
        >
          <Menu size={26} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
