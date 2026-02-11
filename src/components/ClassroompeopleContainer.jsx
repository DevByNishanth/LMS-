import { Plus, Trash, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import profileImg from '../assets/profileImg.svg';
import ClassroomAddStudentsModal from './ClassroomAddStudentsModal';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';


const ClassroompeopleContainer = () => {
    // Auth 
    const token = localStorage.getItem("LmsToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    // params 
    const { classId } = useParams()
    const location = useLocation()
    const classData = location.state
    const sectionId = classData.sectionId
    console.log("classData : ", classData)

    // states 
    const [selectedTab, setSelectedTab] = useState('Teachers');
    const [showAddModal, setShowAddModal] = useState(false);
    const [peopleList, setPeopleList] = useState([]);
    const [faculties, setFaculties] = useState([])
    const [students, setStudents] = useState([])


    // useEffect calls 
    useEffect(() => {
        getPeopleList()
    }, [token])

    // functions 
    const getPeopleList = async () => {
        console.log("running");
        try {
            const res = await axios.get(`${apiUrl}api/people/joined/${sectionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("peoples : ", res.data);
            setFaculties(res.data.faculty)
            setStudents(res.data.students)
        } catch (err) {
            console.error(
                "Error occured while fetching Classroom stream details : ",
                err.message,
            );
        }
    }

    async function handleStudentDelete(id) {
        try {
            const res = await axios.delete(`${apiUrl}api/people/remove/${sectionId}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("student deleted : ", res.data);
            getPeopleList();

        } catch (err) {
            console.error("Error occured while deleting student : ", err.message);
        }
    }

    return (
        <section className='w-full p-6 h-full border border-[#DBDBDB] rounded-lg'>
            {/* tab container  */}

            <div className="tab-container px-4 py-2 flex items-center gap-2 bg-[#E6E9F5] rounded-full">
                <button onClick={() => setSelectedTab("Teachers")} className={`w-1/2 py-2 px-3 cursor-pointer rounded-full ${selectedTab == "Teachers" ? "bg-[#0B56A4] text-white" : "text-black"}`}>Teachers</button>
                <button onClick={() => { setSelectedTab("Students") }} className={`w-1/2 py-2 cursor-pointer px-3 rounded-full ${selectedTab == "Students" ? "bg-[#0B56A4] text-white" : "text-black"}`}>Students</button>
            </div>

            <header className='mt-4 flex items-center justify-between relative'>
                <h1 className='font-medium text-lg'>{selectedTab} List <span className='text-[#0B56A4]'>({selectedTab === "Teachers" ? faculties.length : students.length})</span></h1>
                <div className="btn-container">
                    <button onClick={() => setShowAddModal(true)} className='flex items-center cursor-pointer gap-3 text-white bg-[#0B56A4] px-7 py-2 rounded-lg'><Plus className="text-white"></Plus> Add</button>
                    <div className="dropdown-contanier absolute top-full right-0">
                        {showAddModal && <ClassroomAddStudentsModal selectedTab={selectedTab} onClose={() => {
                            setShowAddModal(false)
                        }} />}

                    </div>
                </div>

            </header>

            {/* people-list  */}

            {selectedTab == "Teachers" ? (
                <div className="teachers-list w-full mt-2 max-h-[calc(100vh-320px)] overflow-auto space-y-2">
                    {faculties.length > 0 ? (
                        faculties.map((item) => (
                            <div key={item.id || item._id} className="flex items-center justify-between py-3 border-b border-gray-300">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.profileImg || profileImg}
                                        alt="user"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <p className="text-sm font-medium text-gray-800">
                                        {item.name}
                                    </p>
                                </div>

                                <div onClick={() => handleStudentDelete(item.id)} className="text-gray-900 text-xl font-medium bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-50 transition-colors">
                                    <Trash2 className='text-red-400 w-5 h-5' />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 py-4 text-center">No faculty members found.</p>
                    )}
                </div>
            ) : (
                <div className="students-list w-full mt-2 max-h-[calc(100vh-320px)] overflow-auto space-y-2">
                    {students.length > 0 ? (
                        students.map((item) => (
                            <div key={item.id || item._id} className="flex items-center justify-between py-3 border-b border-gray-300">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.profileImg || profileImg}
                                        alt="user"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <p className="text-sm font-medium text-gray-800">
                                        {item.name}
                                    </p>
                                </div>

                                <div onClick={() => handleStudentDelete(item.id)} className="text-gray-900 text-xl font-medium bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-50 transition-colors">
                                    <Trash2 className='text-red-400 w-5 h-5' />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 py-4 text-center">No students found.</p>
                    )}
                </div>
            )}




        </section>
    )
}

export default ClassroompeopleContainer