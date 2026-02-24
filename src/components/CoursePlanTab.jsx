import React from 'react'
import activeRightArrow from "../assets/right-arrow.svg";

const CoursePlanTab = () => {
    return (
        <>
            <div className="w-[100%]  p-4 ">
                {/* Title */}
                <h2 className="text-[18px] font-medium text-gray-800 mb-1">
                    Complete Your Course Plan
                </h2>

                {/* Subtitle */}
                <p className="text-[12px] text-gray-400 mb-3 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industry's
                </p>

                {/* Progress */}
                <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className="bg-[#08384f] h-1.5 rounded-full transition-all duration-300"
                            style={{ width: "57%" }}
                        ></div>
                    </div>
                    <p className="text-[12px] text-[#08384f] font-medium mt-1">
                        57% Complete
                    </p>
                </div>

                {/* Tabs */}
                {(() => {
                    const [activeTab, setActiveTab] = React.useState(0);

                    const tabs = [
                        "Course Details",
                        "CO-PO and CO-PSO Mapping",
                        "Reference and others",
                        "Lesson Planner ( Theory )",
                        "Lesson Planner ( Lab )",
                    ];

                    return (
                        <div className="space-y-2">
                            {tabs.map((tab, index) => {
                                const isActive = activeTab === index;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => setActiveTab(index)}
                                        className={`flex items-center justify-between px-3 py-3 rounded-md cursor-pointer transition-all duration-200
                ${isActive
                                                ? "bg-[#08384F] text-white"
                                                : "bg-[#E6E9F5] text-gray-700 hover:bg-gray-300"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {/* Circle indicator */}
                                            <div
                                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${isActive
                                                        ? "border-white bg-white"
                                                        : "border-gray-400"
                                                    }`}
                                            >
                                                {isActive && (
                                                    <div className="w-2 h-2 rounded-full bg-[#08384F]"></div>
                                                )}
                                            </div>

                                            {/* Tab text */}
                                            <span className="text-[14px] font-medium">{tab}</span>
                                        </div>

                                        {/* Arrow */}
                                        {isActive ? <img src={activeRightArrow} alt="Right Arrow" className="w-7 h-7 ml-2" /> : null}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}
            </div>
        </>
    )
}

export default CoursePlanTab