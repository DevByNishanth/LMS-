import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import arrow from '../assets/arrow.svg'

const HodRequestsPage = () => {
    // Auth =========================================== 
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // states ===========================================
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Navigation handler for row actions
    const handleRowAction = (row) => {
        if (row.status.toLowerCase() === "completed") {
            navigate('/dashboard/hodRequests/history', { state: { ...row } });
        } else {
            navigate(`/dashboard/hodRequests/requests/${row?._id?.subjectId}`, { state: { ...row } });
        }
    };


    // Dummy data for testing
    const dummyData = [
        { id: 1, facultyName: "Dr. Nishanth A", subjectName: "Python Programming", hourLabel: "1st Hour", date: "2026-03-10" },
        { id: 2, facultyName: "Dr. Rajesh Kumar", subjectName: "Java Development", hourLabel: "2nd Hour", date: "2026-03-11" },
        { id: 3, facultyName: "Prof. Anjali Singh", subjectName: "Data Structures", hourLabel: "3rd Hour", date: "2026-03-12" },
        { id: 4, facultyName: "Dr. Priya Sharma", subjectName: "Web Development", hourLabel: "1st Hour", date: "2026-03-13" },
        { id: 5, facultyName: "Prof. Vikram Patel", subjectName: "Database Design", hourLabel: "2nd Hour", date: "2026-03-14" },
        { id: 6, facultyName: "Dr. Meera Verma", subjectName: "Machine Learning", hourLabel: "3rd Hour", date: "2026-03-15" },
        { id: 7, facultyName: "Prof. Sanjay Desai", subjectName: "Cloud Computing", hourLabel: "1st Hour", date: "2026-03-16" },
        { id: 8, facultyName: "Dr. Pooja Nair", subjectName: "Artificial Intelligence", hourLabel: "2nd Hour", date: "2026-03-17" },
        { id: 9, facultyName: "Prof. Arun Kumar", subjectName: "Cybersecurity", hourLabel: "3rd Hour", date: "2026-03-18" },
        { id: 10, facultyName: "Dr. Sneha Gupta", subjectName: "Mobile Development", hourLabel: "1st Hour", date: "2026-03-19" },
        { id: 11, facultyName: "Prof. Rahul Chopra", subjectName: "IoT Systems", hourLabel: "2nd Hour", date: "2026-03-20" },
        { id: 12, facultyName: "Dr. Neha Malhotra", subjectName: "Blockchain", hourLabel: "3rd Hour", date: "2026-03-21" },
    ];

    // useEffect=================================================== 
    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                setLoading(true);
                // Using dummy data for testing overflow
                // setData(dummyData);
                setError(null);

                // Uncomment below to use API instead of dummy data

                const token = localStorage.getItem("LmsToken");

                const res = await axios.get(`${apiUrl}api/attendance/request-slots`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const fetchedData = res.data?.data || res.data || [];
                setData(Array.isArray(fetchedData) ? fetchedData : []);
                setError(null);

            } catch (err) {
                console.error('Error fetching request data:', err);
                setError(err.message || 'Failed to fetch request data');
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRequestData();
    }, []);

    return (
        <>
            <section className="w-full h-screen flex">
                <div className="w-[20%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[80%] h-[100%] px-4 py-4 overflow-auto">
                    <h2 className="text-lg font-medium mb-6 text-gray-800">Request Slots</h2>

                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-gray-600">Loading requests...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            <p>Error: {error}</p>
                        </div>
                    )}

                    {!loading && data.length === 0 && !error && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No requests found</p>
                        </div>
                    )}

                    {!loading && data.length > 0 && (
                        <div className="overflow-x-auto shadow-md rounded-lg max-h-[calc(100vh-90px)]">
                            <table className="w-full border-collapse">
                                <thead className='sticky top-0'>
                                    <tr className="bg-gray-200 border-b-2 border-gray-300">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Faculty</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hour</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row) => (
                                        <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row?.facultyName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row?.subjectName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{row?.hourLabel}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600"> {formatDate(row.date)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <button className=" py-1 text-xs px-4 rounded-lg">
                                                    {row.status}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => handleRowAction(row)}
                                                    className="font-medium text-sm"
                                                >
                                                    <div className="icon-container bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full mx-auto cursor-pointer hover:bg-gray-300 transition-colors">
                                                        <img src={arrow} className="w-5 h-5" />
                                                    </div>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </section>
        </>
    )
}

export default HodRequestsPage