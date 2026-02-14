import React from "react";
import Sidebar from "../components/Sidebar";
import CalendarComponent from "../components/CalendarComponent";

const CalendarPage = () => {
  return (
    <div>
          <Sidebar />
          <div className="md:ml-[20%]">
              <CalendarComponent/>
          </div>
    </div>
  );
};

export default CalendarPage;
