import React, { useState, useRef, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import HeaderComponent from '../components/HeaderComponent'
import { Download, ChevronDown } from 'lucide-react'
import homeImg from '../assets/reportHomeImg.svg'
import MonthlyAttendanceTable from '../components/MonthlyAttendanceTable'
import StudentwiseAttendanceTable from '../components/StudentwiseAttendanceTable'
import ClasswiseSemesterTable from '../components/ClasswiseSemesterTable'
import StudentwiseSemesterTable from '../components/StudentwiseSemesterTable'

const CustomMonthDropdown = ({ selectedMonth, setSelectedMonth }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredOption, setHoveredOption] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const dropdownRef = useRef(null);

    const academicYears = [
        { label: "JUN", value: "june" },
        { label: "JUL", value: "july" },
        { label: "AUG", value: "august" },
        { label: "SEP", value: "september" },
        { label: "OCT", value: "october" },
        { label: "NOV", value: "november" },
        { label: "DEC", value: "december" },
        { label: "JAN", value: "january" },
        { label: "FEB", value: "february" },
        { label: "MAR", value: "march" },
        { label: "APR", value: "april" },
        { label: "MAY", value: "may" },
    ];

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
            setHoveredOption(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionClick = (option) => {
        if (option === 'month') {
            setHoveredOption('month');
        } else if (option === 'date-picker') {
            setHoveredOption('date-picker');
        } else {
            setSelectedMonth(option);
            setIsOpen(false);
            setHoveredOption(null);
        }
    };

    const handleAcademicYearSelect = (year) => {
        setSelectedMonth(year);
        setIsOpen(false);
        setHoveredOption(null);
    };

    const handleDateSelect = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedMonth(date);
        setIsOpen(false);
        setHoveredOption(null);
    };

    return (
        <div ref={dropdownRef} className="relative w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='border w-full border-gray-300 rounded-md p-2 focus:outline-none bg-white flex items-center justify-between hover:bg-gray-50'
            >
                <span>{selectedMonth || 'Month'}</span>
                <ChevronDown size={16} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50'>
                    {/* Odd Semester */}
                    <div
                        onClick={() => handleOptionClick('odd-semester')}
                        className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                    >
                        Odd semester
                    </div>

                    {/* Even Semester */}
                    <div
                        onClick={() => handleOptionClick('even-semester')}
                        className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                    >
                        Even semester
                    </div>

                    {/* Month with Academic Year Hover */}
                    <div
                        className='relative'
                        onMouseEnter={() => setHoveredOption('month')}
                        onMouseLeave={() => setHoveredOption(null)}
                    >
                        <div className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between'>
                            Month
                            <span className='text-gray-400 text-sm'>→</span>
                        </div>
                        {hoveredOption === 'month' && (
                            <div className='absolute left-full top-0 ml-1 max-h-[400px] overflow-auto bg-white border border-gray-300 rounded-md shadow-lg min-w-[150px]'>
                                {academicYears.map((year) => (
                                    <div
                                        key={year.value}
                                        onClick={() => handleAcademicYearSelect(year.label)}
                                        className='px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap'
                                    >
                                        {year.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Date Picker with Hover */}
                    <div
                        className='relative'
                        onMouseEnter={() => setHoveredOption('date-picker')}
                        onMouseLeave={() => setHoveredOption(null)}
                    >
                        <div className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between'>
                            Date picker
                            <span className='text-gray-400 text-sm'>→</span>
                        </div>
                        {hoveredOption === 'date-picker' && (
                            <div className='absolute left-full top-0 ml-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 z-50'>
                                <input
                                    type='date'
                                    value={selectedDate}
                                    onChange={handleDateSelect}
                                    className='border border-gray-300 rounded p-2 w-full'
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const StudentAttendanceReportPage = () => {
    // states 
    // const [isAllFilterSelected, setIsAllFilterSelected] = useState(true);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    // Determine if selection is month or semester
    const isSelectionTypeMonth = selectedMonth && !selectedMonth.includes("semester");
    const isSemesterSelection = selectedMonth && selectedMonth.includes("semester");

    // Jsx

    return (
        <>
            <section className="w-[100%] h-[100vh] flex">
                <div className="container-1 w-[20%] h-[100%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[80%] h-[100%]">
                    <HeaderComponent title={"Student Attendance "} />

                    {/* attendace report header  */}
                    <div className="attendace-report-header mx-6 grid grid-cols-5 gap-3 items-center">
                        {/* classwise */}

                        <select className='border w-full border-gray-300 rounded-md p-2 focus:outline-none ' value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                            <option value="" disabled>Select Class</option>
                            <option value="classwise">Classwise</option>
                            <option value="studentwise">Student wise</option>
                        </select>
                        <select className='border w-full border-gray-300 rounded-md p-2 focus:outline-none ' value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                            <option value="" disabled>Subject</option>
                            <option value="Cyber security">Cyber security</option>
                            <option value="Java programming">Java programming</option>
                            <option value="Python">Python</option>
                            <option value="C programming">C programming</option>
                        </select>
                        <select className='border w-full border-gray-300 rounded-md p-2 focus:outline-none ' value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                            <option value="" disabled>Section</option>
                            <option value="CSE - A">CSE - A</option>
                            <option value="ECE - B">ECE - B</option>
                            <option value="IT - C">IT - C</option>
                            <option value="CSE - B">CSE - B</option>
                        </select>
                        <CustomMonthDropdown selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

                        {selectedClass.toLowerCase() !== "studentwise" ? <button className='bg-[#08394f] py-2 text-white px-3 w-full rounded-md text-[16.5px] cursor-pointer hover:bg-[#08394fd3] flex items-center gap-2'> <span><Download size={14} /></span> Download Report</button> : ""}
                    </div>

                    {/* body section  */}

                    {selectedClass && selectedSection && selectedSubject && selectedMonth ? (
                        <>
                            {/* Scenario 1: Classwise + Month */}
                            {selectedClass === "classwise" && isSelectionTypeMonth && (
                                <MonthlyAttendanceTable
                                    selectedMonth={selectedMonth}
                                    selectedSubject={selectedSubject}
                                    selectedSection={selectedSection}
                                />
                            )}

                            {/* Scenario 2: Classwise + Semester */}
                            {selectedClass === "classwise" && isSemesterSelection && (
                                <ClasswiseSemesterTable
                                    selectedSemester={selectedMonth}
                                    selectedSubject={selectedSubject}
                                    selectedSection={selectedSection}
                                />
                            )}

                            {/* Scenario 3: Studentwise + Month */}
                            {selectedClass === "studentwise" && isSelectionTypeMonth && (
                                <StudentwiseAttendanceTable
                                    selectedMonth={selectedMonth}
                                    selectedSubject={selectedSubject}
                                    selectedSection={selectedSection}
                                />
                            )}

                            {/* Scenario 4: Studentwise + Semester */}
                            {selectedClass === "studentwise" && isSemesterSelection && (
                                <StudentwiseSemesterTable
                                    selectedSemester={selectedMonth}
                                    selectedSubject={selectedSubject}
                                    selectedSection={selectedSection}
                                />
                            )}
                        </>
                    ) : (
                        <div className="home-section text-center mx-6 mt-12 h-[calc(100% - 150px)] flex flex-col items-center justify-center gap-6">
                            <img src={homeImg} alt="Home" className='w-[300px] h-[300px] m-auto' />
                            <div className="text-contaienr">
                                <h1 className='font-semibold text-lg mb-2'>Select the Class and Section to view the attendance</h1>
                                <h1 className='text-gray-600 w-[80%] m-auto'>Select the appropriate class and section to view daily attendance details.</h1>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default StudentAttendanceReportPage