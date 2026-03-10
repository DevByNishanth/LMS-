import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import { Check, X } from 'lucide-react';
import AnimatedList from '../components/AnimatedList';
import { useLocation } from 'react-router-dom';

const HodRequestsDetails = () => {
    // Auth 
    const apiUrl = import.meta.env.VITE_API_URL;

    // states ===========================================
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);


    // params ===========================================
    const location = useLocation();
    const paramsData = location.state

    console.log(paramsData, "paramsData HodRequestsDetails")

    // functions 
    const fetchRequestDetails = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("LmsToken");

            // Extract params from paramsData
            if (!paramsData?._id) {
                setError('Missing required parameters');
                setData([]);
                setLoading(false);
                return;
            }

            const { facultyId, subjectId, sectionId, date, hour } = paramsData._id;

            // Construct query parameters
            const queryParams = new URLSearchParams({
                facultyId,
                subjectId,
                sectionId,
                date,
                hour
            });

            const res = await axios.get(
                `${apiUrl}api/attendance/request-slot-details?${queryParams.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

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

    const handleApprove = (requestId) => {
        setData(prevData => prevData.map((item) =>
            item.requestId === requestId ? { ...item, clickedStatus: 'approved' } : item
        ));
    };

    const handleReject = (requestId) => {
        console.log("reject", requestId)
        setData(prevData => prevData.map((item) =>
            item.requestId === requestId ? { ...item, clickedStatus: 'rejected' } : item
        ));
    };

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            setSubmitError(null);
            setSubmitSuccess(false);

            // Filter data to only include items with clickedStatus set (approved or rejected)
            const submissionData = data
                .filter(item => item.clickedStatus !== null)
                .map(item => ({
                    requestId: item.requestId,
                    clickedStatus: item.clickedStatus
                }));

            // Check if there are any items to submit
            if (submissionData.length === 0) {
                setSubmitError('Please approve or reject at least one request before submitting');
                setSubmitting(false);
                return;
            }

            const token = localStorage.getItem("LmsToken");

            const response = await axios.post(
                `${apiUrl}api/attendance/requests/submit`,
                submissionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSubmitSuccess(true);
            console.log('Successfully submitted requests:', response.data);
            
            // Optional: Show success message and reset state after delay
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);

        } catch (err) {
            console.error('Error submitting requests:', err);
            setSubmitError(err.response?.data?.message || err.message || 'Failed to submit requests');
        } finally {
            setSubmitting(false);
        }
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
                                                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md ${req.currentStatus.toLowerCase() === 'present' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'}`}>
                                                    {req.currentStatus}
                                                </span>
                                                <p className='text-sm text-gray-400 font-light mt-2'>Current Status</p>
                                            </div>
                                            <div>
                                                <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md ${req.requestedStatus.toLowerCase() === 'present' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : req.requestedStatus === 'On Duty' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'}`}>
                                                    {req.requestedStatus}
                                                </span>
                                                <p className='text-sm text-gray-400 font-light mt-2'>Edit Status</p>
                                            </div>
                                            <div className="text-gray-800 font-medium text-md mt-2">
                                                <span>{req.hour}</span>
                                                <p className='text-sm text-gray-400 font-light mt-2'>Hour</p>
                                            </div>
                                            <div className="text-gray-800 font-medium text-md whitespace-nowrap mt-2">
                                                <span>{formatDate(req.date)}</span>
                                                <p className='text-sm text-gray-400 font-light mt-2'>Date</p>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <button onClick={() => handleApprove(req.requestId)} className={`${req.clickedStatus == "approved" ? "bg-emerald-700" : "border border-emerald-400"}  px-2 py-1 rounded-md cursor-pointer transition-colors hover:text-white`}>
                                                    <Check className={`${req.clickedStatus == "approved" ? "text-white" : "text-emerald-400"} `} />
                                                </button>
                                                <button onClick={() => handleReject(req.requestId)} className={`${req.clickedStatus == "rejected" ? "bg-rose-700" : "border border-rose-400"} px-2 py-1 rounded-md cursor-pointer transition-colors hover:text-white`}>
                                                    <X className={`${req.clickedStatus == "rejected" ? "text-white" : "text-rose-400"} `} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </AnimatedList>

                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleSubmit} 
                        disabled={submitting} 
                        className={`text-white px-4 py-2 rounded cursor-pointer absolute bottom-4 right-4 ${
                            submitting ? 'bg-gray-500 opacity-50 cursor-not-allowed' : 'bg-[#08384f] hover:bg-[#05263a]'
                        }`}
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>

                    {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 absolute bottom-16 right-4">
                            <p>{submitError}</p>
                        </div>
                    )}

                    {submitSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 absolute bottom-16 right-4">
                            <p>Requests submitted successfully!</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default HodRequestsDetails