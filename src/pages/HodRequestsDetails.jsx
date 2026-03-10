import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import { Check, X } from 'lucide-react';
import AnimatedList from '../components/AnimatedList';

const HodRequestsDetails = () => {
    // Auth 
    const apiUrl = import.meta.env.VITE_API_URL;

    // states ===========================================
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // functions 
    const fetchRequestDetails = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("LmsToken");

            const res = await axios.get(`${apiUrl}attendance/request-slot-details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const fetchedData = res.data?.data || res.data || [];
            const addField = Array.isArray(fetchedData) ? fetchedData.map((item) => {
                return {
                    ...item,
                    clickedStatus: null
                }
            }) : [];

            setData(addField);
            setError(null);
        } catch (err) {
            console.error('Error fetching request details:', err);
            setError(err.message || 'Failed to fetch request details');
            setData([]);
        } finally {
            setLoading(false);
        }
    }

    const handleApprove = (index) => {
        setData(prevData => prevData.map((item, i) =>
            i === index ? { ...item, clickedStatus: 'approved' } : item
        ));
    };

    const handleReject = (index) => {
        setData(prevData => prevData.map((item, i) =>
            i === index ? { ...item, clickedStatus: 'rejected' } : item
        ));
    };

    const handleSubmit = () => {
        console.log(data)
    }

    // useEffects =============================== 
    useEffect(() => {
        fetchRequestDetails();
    }, [])


    // jsx ====================================== 
    return (
        <>
            <section className="w-full h-screen flex">
                <div className="w-[20%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[80%] h-full  px-4 py-4 ">
                    <h2 className="text-lg font-medium mb-6 text-gray-800">Request Details</h2>

                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-gray-600">Loading request details...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            <p>Error: {error}</p>
                        </div>
                    )}

                    {!loading && data.length === 0 && !error && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No request details found</p>
                        </div>
                    )}

                    {!loading && data.length > 0 && (
                        <div className="list-container mt-2 ">
                            <div className="overflow-hidden">
                                <AnimatedList
                                    items={data}
                                    onItemSelect={(item, index) => console.log(item, index)}
                                    showGradients
                                    enableArrowNavigation
                                    displayScrollbar
                                >
                                    {(req) => (
                                        <div className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 transition-colors border border-gray-200 mb-2 shadow-lg rounded-lg">
                                            <div className="font-medium text-gray-900">
                                                <span>
                                                    {req.studentName}
                                                </span>
                                                <p className='text-sm text-gray-400 font-light'>Name</p>

                                            </div>
                                            <div>
                                                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md ${req.currentStatus === 'Present' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'}`}>
                                                    {req.currentStatus}
                                                </span>
                                                <p className='text-sm text-gray-400 font-light mt-2'>Current Status</p>
                                            </div>
                                            <div>
                                                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md ${req.editStatus === 'Present' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : req.editStatus === 'On Duty' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'}`}>
                                                    {req.editStatus}
                                                </span>
                                                <p className='text-sm text-gray-400 font-light mt-2'>Edit Status</p>
                                            </div>
                                            <div className="text-gray-800 font-medium text-md mt-2">
                                                <span>{req.hour}</span>
                                                <p className='text-sm text-gray-400 font-light mt-2'>Hour</p>
                                            </div>
                                            <div className="text-gray-800 font-medium text-md whitespace-nowrap mt-2">
                                                <span>{req.date}</span>
                                                <p className='text-sm text-gray-400 font-light mt-2'>Date</p>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <button onClick={() => handleApprove(req.id)} className={`${req.clickedStatus == "approved" ? "bg-emerald-700" : "border border-emerald-400"}  px-2 py-1 rounded-md cursor-pointer transition-colors hover:text-white`}>
                                                    <Check className={`${req.clickedStatus == "approved" ? "text-white" : "text-emerald-400"} `} />
                                                </button>
                                                <button onClick={() => handleReject(req.id)} className={`${req.clickedStatus == "rejected" ? "bg-rose-700" : "border border-rose-400"} px-2 py-1 rounded-md cursor-pointer transition-colors hover:text-white`}>
                                                    <X className={`${req.clickedStatus == "rejected" ? "text-white" : "text-rose-400"} `} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </AnimatedList>

                            </div>
                        </div>
                    )}

                    <button onClick={handleSubmit} className='bg-[#08384f] text-white px-4 py-2 rounded cursor-pointer absolute bottom-4 right-4'>Submit</button>
                </div>
            </section>
        </>
    )
}

export default HodRequestsDetails