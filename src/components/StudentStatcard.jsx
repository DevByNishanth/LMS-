import React from "react";
import st1 from '../assets/st1.svg';
import st2 from '../assets/st2.svg';
import st3 from '../assets/st3.svg';
import icon1 from '../assets/stIcon1.svg';
import icon2 from '../assets/stIcon2.svg';
import icon3 from '../assets/stIcon3.svg';

const StudentStatcard = () => {
    return (
        <div className="grid grid-cols-3 gap-4 ">
            <div className="card w-full ">
                <div className="img-container relative">
                    <img src={st1} className="w-full rounded-xl" />
                    <div className="absolute inset-0 rounded-xl bg-[linear-gradient(180deg,rgba(45,17,81,0.83)_29%,rgba(57,28,94,0.85)_36%,rgba(73,44,111,0.87)_45%)]">
                    </div>
                    <div className="content-container absolute top-4 left-4 text-white space-y-1">
                        <img src={icon1} className="w-10 h-10" />
                        <p>Total Classes</p>
                        <p>120</p>
                    </div>
                </div>
            </div>
            <div className="card w-full ">
                <div className="img-container relative">
                    <img src={st2} className="w-full rounded-xl" />
                    <div className="absolute inset-0 rounded-xl bg-[linear-gradient(180deg,rgba(13,74,6,0.83)_0%,rgba(0,20,4,0.79)_50%)]">
                    </div>
                    <div className="content-container absolute top-4 left-4 text-white space-y-1">
                        <img src={icon2} className="w-10 h-10" />
                        <p>Total Assignments</p>
                        <p>15</p>
                    </div>
                </div>
            </div>
            <div className="card w-full ">
                <div className="img-container relative">
                    <img src={st3} className="w-full rounded-xl" />
                    <div className="absolute inset-0 rounded-xl bg-[linear-gradient(180deg,rgba(81,17,48,0.83)_0%,rgba(81,17,44,0.79)_50%)]">
                    </div>
                    <div className="content-container absolute top-4 left-4 text-white space-y-1">
                        <img src={icon3} className="w-10 h-10" />
                        <p>Overall Percentage</p>
                        <p>90%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentStatcard;
