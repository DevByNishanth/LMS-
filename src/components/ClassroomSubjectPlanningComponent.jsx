import React, { useState } from 'react'
import UnitComponent from "./UnitComponent";
import SubjectSubTopicsTable from "./SubjectSubTopicsTable";

const ClassroomSubjectPlanningComponent = ({ subjectId }) => {
    const [selectedUnit, setSelectedUnit] = useState("Unit 1");

    return (
        <>
            <div className="main-container w-full flex gap-2 max-h-[calc(100vh-160px)]">
                <UnitComponent onSelect={(unit) => setSelectedUnit(unit)} />
                <SubjectSubTopicsTable selectedUnit={selectedUnit} subjectId={subjectId} />
            </div>

        </>
    )
}

export default ClassroomSubjectPlanningComponent