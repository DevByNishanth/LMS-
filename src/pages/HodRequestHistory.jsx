import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import { useLocation } from 'react-router-dom'

const HodRequestHistory = () => {
    // Auth =========================================== 
    const apiUrl = import.meta.env.VITE_API_URL;
    const location = useLocation();

    // states ===========================================
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // useEffect=================================================== 
    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("LmsToken");

                // Get data from state passed from HodRequestsPage
                const stateData = location.state;

                if (!stateData) {
                    setError('No request data provided');
                    setLoading(false);
                    return;
                }

                // Extract parameters from state
                const facultyId = stateData?._id?.facultyId || stateData?.facultyId || '';
                const subjectId = stateData?._id?.subjectId || stateData?.subjectId || '';
                const sectionId = stateData?._id?.sectionId || stateData?.sectionId || '';
                const date = stateData?.date || '';
                const hour = (stateData?.hourLabel || stateData?.hour || '').replace(/\s+/g, '').replace(/\s*\(.*\)/, '');

                let url = `${apiUrl}api/attendance/request-history`;

                // Build query string with required parameters
                const params = [];
                if (facultyId) params.push(`facultyId=${facultyId}`);
                if (subjectId) params.push(`subjectId=${subjectId}`);
                if (sectionId) params.push(`sectionId=${sectionId}`);
                if (date) params.push(`date=${date}`);
                if (hour) params.push(`hour=${hour}`);

                if (params.length > 0) {
                    url += '?' + params.join('&');
                } else {
                    setError('Missing required parameters to fetch history');
                    setLoading(false);
                    return;
                }

                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const fetchedData = res.data?.data || res.data || [];
                setData(Array.isArray(fetchedData) ? fetchedData : []);
                setError(null);

            } catch (err) {
                console.error('Error fetching history data:', err);
                setError(err.message || 'Failed to fetch history data');
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistoryData();
    }, [location]);

    return (
        <>
            <section className="w-full h-screen flex">
                <div className="w-[20%]">
                    <Sidebar />
                </div>
                <div className="container-2 w-[80%] h-[100%] px-4 py-4 overflow-auto">
                    <h2 className="text-lg font-medium mb-6 text-gray-800">Request History</h2>

                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-gray-600">Loading history...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            <p>Error: {error}</p>
                        </div>
                    )}

                    {!loading && data.length === 0 && !error && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No history found</p>
                        </div>
                    )}

                    {!loading && data.length > 0 && (
                        <div className="overflow-x-auto shadow-md rounded-lg max-h-[calc(100vh-90px)]">
                            <table className="w-full border-collapse">
                                <thead className='sticky top-0'>
                                    <tr className="bg-gray-200 border-b-2 border-gray-300">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Previous status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Requested status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Final status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hour</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, index) => (
                                        <tr key={row._id || index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row?.studentName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row?.currentStatus}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row?.requestedStatus}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                <button className={`py-1 text-xs px-4 rounded-lg ${row?.finalStatus.toLowerCase() === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {row?.finalStatus}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{row?.hour}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(row?.date)}</td>
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

export default HodRequestHistory
