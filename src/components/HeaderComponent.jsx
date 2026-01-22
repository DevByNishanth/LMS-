import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import notificationIcon from "../assets/notification.svg";
import { jwtDecode } from "jwt-decode";

const HeaderComponent = ({ title, second, secondColor }) => {
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
    <div className="w-full flex items-center justify-between px-6 py-3 bg-white">
      {/* Left */}
      <div className="flex gap-1 items-center">
        <h1 className="text-lg font-medium text-[#282526]">{title}</h1>
        {second && <ChevronRight />}
        {second && (
          <div className={`${secondColor} font-medium`}>{second}</div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <div className="p-2 rounded-full bg-gray-50 shadow-sm hover:shadow-md transition">
          <img src={notificationIcon} className="w-4 h-4" />
        </div>

        {/* Profile Avatar (Letter) */}
        <div className="w-8 h-8 rounded-full bg-[#0B56A4] text-white flex items-center justify-center font-semibold shadow-sm">
          {firstLetter}
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
