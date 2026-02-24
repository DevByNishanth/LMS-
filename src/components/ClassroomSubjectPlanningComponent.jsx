import React, { useState } from 'react'
import UnitComponent from "./UnitComponent";
import SubjectSubTopicsTable from "./SubjectSubTopicsTable";
import CoursePlanTab from './CoursePlanTab';
import CourseDetailsForm from './CourseDetailsForm';

const ClassroomSubjectPlanningComponent = ({ subjectId }) => {
    const [selectedUnit, setSelectedUnit] = useState("Unit 1");

    return (
        <>
            <div className="main-container w-full flex gap-2 min-h-[calc(100vh-160px)] max-h-[calc(100vh-160px)]">
                {/* <UnitComponent onSelect={(unit) => setSelectedUnit(unit)} />
                <SubjectSubTopicsTable selectedUnit={selectedUnit} subjectId={subjectId} /> */}
                <div className='w-[30%] border border-gray-300 rounded-md '>
                    <CoursePlanTab /> 
                </div>
                <div className="form-container border w-[80%] border-gray-300 rounded-md p-4">
                    <CourseDetailsForm />
                </div>
            </div>

        </>
    )
}

export default ClassroomSubjectPlanningComponent