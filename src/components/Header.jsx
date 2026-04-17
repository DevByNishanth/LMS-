import { Bell } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-medium">Dashboard</h1>

      <div className="flex items-center gap-4">
        <button className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
          <Bell size={18}/>
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-medium">H</div>
      </div>
    </div>
  );
};

export default Header;