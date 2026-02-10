import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

const StudentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "md:ml-[80px]" : "md:ml-[20%]"
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
