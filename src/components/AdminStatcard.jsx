import React from "react";
import st1 from '../assets/st1.svg';
import st2 from '../assets/st2.svg';
import st3 from '../assets/st3.svg';
import icon1 from '../assets/stIcon1.svg';
import icon2 from '../assets/stIcon2.svg';
import icon3 from '../assets/stIcon3.svg';

const stats = [
    {
        title: "Total Faculty",
        value: "225",
        img: st1,
        icon: icon1,
        gradient: "bg-[linear-gradient(180deg,rgba(45,17,81,0.83)_29%,rgba(57,28,94,0.85)_36%,rgba(73,44,111,0.87)_45%)]"
    },
    {
        title: "Total Students",
        value: "345",
        img: st2,
        icon: icon2,
        gradient: "bg-[linear-gradient(180deg,rgba(13,74,6,0.83)_0%,rgba(0,20,4,0.79)_50%)]"
    },
    {
        title: "Total Departments",
        value: "07",
        img: st3,
        icon: icon3,
        gradient: "bg-[linear-gradient(180deg,rgba(81,17,48,0.83)_0%,rgba(81,17,44,0.79)_50%)]"
    },
];

const AdminStatcard = () => {
    return (
        <div className="col-span-3 grid grid-cols-3 gap-6 h-[100px]">
            {stats.map((item, index) => (
                <div key={index} className="card w-full ">
                    <div className="img-container relative h-full">
                        <img src={item.img} className="w-full h-full object-cover rounded-xl" alt={item.title} />
                        <div className={`absolute inset-0 rounded-xl ${item.gradient}`}></div>
                        <div className="content-container absolute top-4 left-4 text-white space-y-1">
                            <img src={item.icon} className="w-10 h-10" alt="icon" />
                            <p>{item.title}</p>
                            <p>{item.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminStatcard;