import React from "react";
import {
  Monitor,
  Cpu,
  Shield,
  Radio,
  Zap,
  Settings,
  Brain,
  Briefcase,
  BookOpen,
} from "lucide-react";

import arrow from "../assets/arrow.svg";
import { Link } from "react-router-dom";
const departments = [
  { department: "Computer Science and Engineering (CSE)", icon: <Monitor /> },
  { department: "Computer Science and Engineering (AI & ML)", icon: <Cpu /> },
  {
    department: "Computer Science and Engineering (Cyber Security)",
    icon: <Shield />,
  },
  { department: "Computer & Communication Engineering (CCE)", icon: <Radio /> },
  {
    department: "Artificial Intelligence & Data Science (AI & DS)",
    icon: <Brain />,
  },
  {
    department: "Computer Science and Business Systems (CS&BS)",
    icon: <Briefcase />,
  },
  {
    department: "Electronics and Communication Engineering (ECE)",
    icon: <Cpu />,
  },
  { department: "Electrical & Electronics Engineering (EEE)", icon: <Zap /> },
  { department: "Information Technology (IT)", icon: <Monitor /> },
  { department: "Mechanical Engineering (MECH)", icon: <Settings /> },
  { department: "Science & Humanities", icon: <BookOpen /> },
];

const DepartmentTabComponent = () => {
  return (
    <>
      <section className="px-6 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {departments.map((dept, index) => (
            <Link
              to={`/dashboard/semesterRegistration/addSubject?dept=${encodeURIComponent(
                dept.department
              )}`}
              key={index}
              className="flex items-center justify-between gap-4 p-4 bg-[#F9F9F9] border border-[#CACACA] rounded-xl hover:shadow-md transition-shadow duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 text-white bg-[#0B56A4] rounded-full">
                  {dept.icon}
                </div>
                <p className="font-medium text-sm text-[#0B56A4]">
                  {dept.department}
                </p>
              </div>
              <img src={arrow} className="w-5 h-5" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default DepartmentTabComponent;
