import React, { useMemo, useState } from 'react'
import UnitComponent from "./UnitComponent";
import SubjectSubTopicsTable from "./SubjectSubTopicsTable";
import CoursePlanTab from './CoursePlanTab';
import CourseDetailsForm from './CourseDetailsForm';
import CoPoMapping from './CoPoMapping';

const ClassroomSubjectPlanningComponent = ({ subjectId }) => {
    const [selectedUnit, setSelectedUnit] = useState("Unit 1");
    const [formData, setFormData] = useState({
        courseType: "",
        coRequisites: "",
        preRequisites: "",
        courseDescription: "",
        courseObjectives: [""],
        courseOutcomes: [
            { unit: "Unit 1", statement: "", rtbl: "" },
            { unit: "Unit 2", statement: "", rtbl: "" },
            { unit: "Unit 3", statement: "", rtbl: "" },
            { unit: "Unit 4", statement: "", rtbl: "" },
            { unit: "Unit 5", statement: "", rtbl: "" },
        ],
    });

    const courseDetailsStatus = useMemo(() => {

        const values = [
            formData.courseType,
            formData.coRequisites,
            formData.preRequisites,
            formData.courseDescription,
            ...formData.courseObjectives,
            ...formData.courseOutcomes.map(o => o.statement),
            ...formData.courseOutcomes.map(o => o.rtbl),
        ];

        const filled = values.filter(v => v && v.trim() !== "").length;

        if (filled === 0) return "not_started";
        if (filled < values.length) return "dirty";
        return "completed";

    }, [formData]);




    const [activeTab, setActiveTab] = React.useState(0);

    const tabs = [
        "Course Details",
        "CO-PO and CO-PSO Mapping",
        "Reference and others",
        "Lesson Planner ( Theory )",
        "Lesson Planner ( Lab )",
    ];

    return (
        <>
            <div className="main-container w-full flex gap-2 min-h-[calc(100vh-160px)] max-h-[calc(100vh-150px)] ">
                {/* <UnitComponent onSelect={(unit) => setSelectedUnit(unit)} />
                <SubjectSubTopicsTable selectedUnit={selectedUnit} subjectId={subjectId} /> */}
                <div className='w-[30%] border border-gray-300 rounded-md '>
                    <CoursePlanTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} courseDetailsStatus={courseDetailsStatus} />
                </div>
                <div className="form-container border overflow-auto w-[80%] border-gray-300 rounded-md py-2 pl-4 hide-scrollbar">

                    {activeTab === 0 && (
                        <CourseDetailsForm formData={formData}
                            setFormData={setFormData} />
                    )}
                    {activeTab === 1 && (
                        <CoPoMapping />
                    )}
                </div>
            </div>

        </>
    )
}

export default ClassroomSubjectPlanningComponent