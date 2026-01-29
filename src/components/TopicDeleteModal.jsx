import React, { useState } from "react";
import deleteImg from "../assets/deleteIllustration.svg";
import axios from "axios";

const TopicDeleteModal = ({ setIsDelete, deleteId, unitName, onSuccess }) => {
    const token = localStorage.getItem("LmsToken");
    const apiUrl = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `${apiUrl}api/staff/subject-planning/topic/${deleteId}`,
                {
                    data: { unitName },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                onSuccess();
                setIsDelete(false);
            }
        } catch (err) {
            console.error("Error occurred while deleting topic: ", err.message);
            alert(err.response?.data?.message || "Failed to delete topic");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                onClick={() => setIsDelete(false)}
                className="fixed bg-black/40 inset-0 z-60"
            ></div>
            <section
                className="w-[90%] md:w-[420px] fixed top-[50%] z-70 left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-6 rounded-lg shadow-xl"
            >
                <img src={deleteImg} className="w-full m-auto h-[140px]" alt="Delete Illustration" />
                <div className="content-container mt-6">
                    <h1 className="font-semibold text-center text-xl text-gray-800">
                        Delete this Topic?
                    </h1>
                    <p className="text-gray-500 text-sm text-center mt-2">
                        Are you sure you want to delete this topic? This action cannot be undone.
                    </p>
                    <div className="btn-container flex gap-3 justify-center mt-8">
                        <button
                            onClick={() => setIsDelete(false)}
                            disabled={loading}
                            className="font-medium w-full text-md hover:bg-gray-100 cursor-pointer border border-gray-300 rounded-lg px-4 py-2.5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="font-medium text-md w-full cursor-pointer transition-all duration-300 bg-[#0B56A4] hover:bg-white hover:border border-gray-300 hover:text-black text-white rounded-lg px-4 py-2.5"
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TopicDeleteModal;
