import React from "react";
import { LayoutDashboard, BookOpen, Book, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/clgLogo.svg";

const StudentSidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      icon: ({ active }) => (
        <LayoutDashboard
          size={22}
          className={active ? "text-[#0B56A4]" : "text-gray-600"}
        />
      ),
      link: "/student",
    },
    {
      label: "Classroom",
      icon: ({ active }) =>
        active ? (
          <BookOpen size={22} className="text-[#0B56A4]" />
        ) : (
          <Book size={22} className="text-gray-600" />
        ),
      link: "/student/classroom",
    },
  ];

  const isActive = (path) => {
    if (path === "/student") return location.pathname === "/student";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("LmsToken");
    window.location.href = "/";
  };

  return (
    <div className="relative hidden md:block">
      <div className="fixed top-0 left-0 h-screen w-[20%] bg-[#D9EBFE] z-50 flex flex-col">
        <div className="flex items-center justify-center p-4 min-h-[80px]">
          <img src={logo} alt="logo" className="w-[120px]" />
        </div>

        <div className="flex-1 space-y-1 px-2">
          {navItems.map(({ label, icon, link }) => {
            const active = isActive(link);
            return (
              <Link
                key={label}
                to={link}
                className={`flex items-center h-[54px] px-3 rounded-xl transition-all duration-200 ${
                  active ? "bg-white shadow-sm" : "hover:bg-white/60"
                }`}
              >
                {icon({ active })}
                <span
                  className={`ml-3 font-semibold ${
                    active ? "text-[#0B56A4]" : "text-[#282526]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="px-4 py-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full py-2 rounded-lg bg-[#0B56A4] text-white hover:bg-[#094a8f] transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
