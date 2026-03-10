import React, { useEffect, useState } from "react";
import whiteLogo from "../assets/eshwar_logo_white.png";
import {
  Menu,
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  ClipboardList,
  CalendarDays,
  Layers,
  Table,
  LogOut,
  Presentation,
  MessageSquareMore

} from "lucide-react";
import logo from "../assets/clgLogo.svg";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
      icon: LayoutDashboard,
      link: "/dashboard",
      roles: ["admin", "hod", "faculty"],
    },
    {
      label: "Semester Registration",
      icon: BookOpen,
      link: "/dashboard/adminSemReg",
      roles: ["admin"],
    },
    {
      label: "Subject Management",
      icon: ClipboardList,
      link: "/dashboard/semesterRegistration",
      roles: ["admin"],
    },
    {
      label: "Faculty Management",
      icon: Users,
      link: "/dashboard/facultyManagement",
      roles: ["admin"],
    },
    {
      label: "Student Management",
      icon: GraduationCap,
      link: "/dashboard/studentManagement",
      roles: ["admin"],
    },
    {
      label: "Staff Allocation",
      icon: Users,
      link: "/dashboard/subjectManagement",
      roles: ["hod"],
    },
    {
      label: "Class Room",
      icon: Presentation,
      link: "/dashboard/classroom",
      roles: ["faculty"],
    },
    {
      label: "Calendar",
      icon: CalendarDays,
      link: "/dashboard/calendar",
      roles: ["faculty"],
    },
    {
      label: "Section Management",
      icon: Layers,
      link: "/dashboard/sectionManagement",
      roles: ["hod"],
    },
    {
      label: "Timetable Management",
      icon: Table,
      link: "/dashboard/timetableManagement",
      roles: ["hod"],
    },
    {
      label: "Requests",
      icon: MessageSquareMore,
      link: "/dashboard/hodRequests",
      roles: ["hod"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(role?.toLowerCase())
  );

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("LmsToken");
    window.location.href = "/";
  };

  return (
    <div className="relative hidden md:block">
      <div
        className={`fixed top-0 left-0 h-screen bg-[#08384F]  z-50 transition-all duration-300 flex flex-col ${collapsed ? "w-[83px]" : "w-[20%]"
          }`}
      >
        <div className="logo-container my-5">
          <div className="flex items-center pl-6 ">
            {!collapsed && (
              <img src={whiteLogo} alt="logo" className="w-[140px] object-cover" />
            )}
          </div>
        </div>

        <div className="flex-1 space-y-1 pl-2">
          {filteredNavItems.map((item, index) => {
            const active = isActive(item.link);
            const Icon = item.icon;

            return (
              <Link
                key={index}
                to={item.link}
                className={`flex items-center h-[54px] px-2 rounded-l-[14px] transition-all duration-200 relative ${active
                  ? "bg-white text-[#18283b]"
                  : "text-black hover:bg-white/50"
                  }`}
              >
                <span className="min-w-[3rem] flex justify-center">
                  <Icon
                    size={20}
                    className={active ? "text-[#000000]" : "text-white"}
                  />
                </span>

                {!collapsed && (
                  <span
                    className={`font-semibold whitespace-nowrap ${active ? "text-[#000000]" : "text-[#ffffff]"
                      }`}
                  >
                    {item.label}
                  </span>
                )}


              </Link>
            );
          })}
        </div>

        <div className="px-4 py-6 absolute bottom-4 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 justify- text-white font-medium px-4 py-2 w-full rounded-lg cursor-pointer hover:bg-[#ffffff] hover:text-black transition-all duration-200"
          >
            <LogOut size={18} />
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
