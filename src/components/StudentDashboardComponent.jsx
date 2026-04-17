import React from "react";
import Header from "../components/Header";
import StudentStatcard from "../components/StudentStatcard";
import StudentTodaysShedule from "../components/StudentTodaysShedule";
import StudentGradesOverview from "../components/StudentGradesOverview";
import AttendanceOverview from "../components/AttendanceOverview";

const StudentDashboardComponent = () => {
    return (
        <div className="p-6 min-h-screen">
            <Header />

            <div className="grid grid-cols-12 gap-6">
                {/* LEFT */}
                <div className="col-span-9 space-y-6">
                    <StudentStatcard />

                    <div className="grid grid-cols-2 gap-6">
                        <AttendanceOverview />
                        <StudentGradesOverview />
                    </div>
                </div>

                {/* RIGHT */}
                <div className="col-span-3">
                    <StudentTodaysShedule />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardComponent;
