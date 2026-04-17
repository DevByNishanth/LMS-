import React from "react";
import circle1 from '../assets/circle1.svg'
import circle2 from '../assets/cirlce2.svg'
import circle3 from '../assets/circle3.svg'
import circle4 from '../assets/circle4.svg'
import circle5 from '../assets/circle6.svg'
import circle6 from '../assets/cirlce5.svg'

const TodaySchedule = () => {
    const data = [
        { time: "09:00AM-12:00PM", subject: "Cybersecurity", color: "bg-blue-500" },
        { time: "09:00AM-12:00PM", subject: "Cybersecurity", color: "bg-orange-500" },
        { time: "09:00AM-12:00PM", subject: "Cybersecurity", color: "bg-pink-500" },
        { time: "09:00AM-12:00PM", subject: "Cybersecurity", color: "bg-green-500" },
    ];

    const circleImages = [circle1, circle2, circle3, circle4, circle5, circle6]


    return (
       <div className="bg-blue-50 p-4 h-full rounded-xl shadow">
    <h2 className="font-medium mb-8">Today Schedule</h2>

    <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 border-l-2 border-dashed border-gray-300"></div>

        <div className="space-y-6">
            {data.map((item, index) => (
                <div key={index} className="flex items-start gap-4 relative">

                    {/* Circle Wrapper */}
                    <div className="relative z-10 flex items-center justify-center w-8 h-8">
                        <img
                            src={circleImages[index]}
                            alt=""
                            className="w-8 h-8"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <p className="text-sm font-medium">{item.time}</p>
                        <p className="text-xs text-gray-500">{item.subject}</p>
                    </div>

                </div>
            ))}
        </div>
    </div>
</div>
    );
};

export default TodaySchedule;