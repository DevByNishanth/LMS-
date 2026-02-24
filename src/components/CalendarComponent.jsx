import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import notification from "../assets/notification.svg";
import axios from "axios";

const CalendarComponent = () => {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [eventsData, setEventsData] = useState({});

  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("LmsToken");
    if (token) {
      const decoded = jwtDecode(token);
      setFirstName(decoded.name?.charAt(0)?.toUpperCase() || "");
    }
  }, []);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const currentYear = currentMonth.year();

        const response = await axios.get(
          `${apiUrl}api/calendar/events?year=${currentYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        const formattedEvents = {};

        Object.values(data.assignments || {}).forEach((monthArray) => {
          monthArray.forEach((item) => {
            const dateKey = dayjs(item.dueDate).format("YYYY-MM-DD");
            if (!formattedEvents[dateKey]) formattedEvents[dateKey] = [];
            formattedEvents[dateKey].push({
              title: item.title,
              type: "assignment",
              dueDate: item.dueDate,
            });
          });
        });

        Object.values(data.questions || {}).forEach((monthArray) => {
          monthArray.forEach((item) => {
            const dateKey = dayjs(item.dueDate).format("YYYY-MM-DD");
            if (!formattedEvents[dateKey]) formattedEvents[dateKey] = [];
            formattedEvents[dateKey].push({
              title: item.title,
              type: "quiz",
              dueDate: item.dueDate,
            });
          });
        });

        setEventsData(formattedEvents);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    };

    fetchCalendarEvents();
  }, [currentMonth]);

  const startOfMonth = currentMonth.startOf("month");

  let startDate =
    startOfMonth.day() === 1 ? startOfMonth : startOfMonth.day(1);

  if (startDate.isAfter(startOfMonth)) {
    startDate = startDate.subtract(7, "day");
  }

  const days = Array.from({ length: 35 }).map((_, i) =>
    startDate.add(i, "day")
  );

  const selectedEvents =
    selectedDate &&
    eventsData[selectedDate.format("YYYY-MM-DD")];

  return (
    <div className="p-8 w-full bg-white relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setCurrentMonth(currentMonth.subtract(1, "month"))
            }
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
          >
            ←
          </button>

          <h2 className="text-xl font-bold text-gray-800">
            {currentMonth.format("MMMM YYYY")}
          </h2>

          <button
            onClick={() =>
              setCurrentMonth(currentMonth.add(1, "month"))
            }
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-gray-50 shadow-sm hover:shadow-md transition cursor-pointer">
            <img src={notification} className="w-4 h-4" />
          </div>

          <div className="w-8 h-8 rounded-full bg-[#08384F]  bgtext-white flex items-center justify-center font-semibold shadow-sm">
            {firstName}
          </div>
        </div>
      </div>

      <div className="border-1 border-gray-300 rounded-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-purple-200">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
            <div
              key={day}
              className="p-3 text-[11px] font-bold text-gray-400 border-r border-purple-100 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const dateStr = date.format("YYYY-MM-DD");
            const isCurrentMonth =
              date.month() === currentMonth.month();
            const isToday = date.isSame(today, "day");
            const dayEvents = eventsData[dateStr] || [];

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`h-[120px] border-r border-b border-purple-100 p-3 cursor-pointer transition flex flex-col
                  ${(index + 1) % 7 === 0 ? "border-r-0" : ""}
                  ${!isCurrentMonth
                    ? "text-gray-300 bg-gray-50"
                    : isToday
                      ? "bg-blue-100 ring-2 ring-blue-200"
                      : "bg-white hover:bg-gray-50"
                  }
                `}
              >
                <div
                  className={`text-lg font-bold mb-2 inline-block px-2 py-0.5 rounded
                    ${isToday ? "" : "text-gray-700"}
                  `}
                >
                  {date.date()}
                </div>

                <div className="flex-1 overflow-hidden space-y-1">
                  {dayEvents.slice(0, 2).map((event, i) => {
                    const isPast = dayjs(event.dueDate).isBefore(today, "day");

                    const colorClass =
                      event.type === "assignment"
                        ? isPast
                          ? "bg-sky-200 text-sky-900"
                          : "bg-sky-400 text-white"
                        : isPast
                          ? "bg-green-200 text-green-900"
                          : "bg-green-600 text-white";

                    return (
                      <div
                        key={i}
                        className={`text-[11px] px-2 py-1 rounded-md font-medium truncate ${colorClass}`}
                      >
                        {event.title}
                      </div>
                    );
                  })}

                  {dayEvents.length > 2 && (
                    <div className="text-[11px] text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedDate(null)}
          />

          <div className="relative bg-white w-[400px] rounded-lg shadow-xl p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">
                {selectedDate.format("DD MMMM YYYY")}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="max-h-[250px] overflow-y-auto space-y-2">
              {selectedEvents && selectedEvents.length > 0 ? (
                selectedEvents.map((event, i) => (
                  <div
                    key={i}
                    className="border-b px-3 py-2 mx-2 border-gray-200 text-sm text-gray-700"
                  >
                    {event.title}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">
                  No events for this day
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
