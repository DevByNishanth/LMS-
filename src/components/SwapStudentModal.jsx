import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const SwapStudentModal = ({ sections, onClose, selectedStudents, modalSectionData }) => {

    // Filter out "Unallocated"
    const filteredSections = modalSectionData.filter(
        (sec) => sec.section !== "Unallocated"
    );


    console.log("filteredSections : ", filteredSections)

    // Auth
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("LmsToken");

    // State
    const [selectedOption, setSelectedOption] = useState("");

    // Row click = select radio
    const handleRowClick = (value) => {
        setSelectedOption(value);
    };

    // Swap API
    const handleSwap = async () => {
        const payload = {
            studentIds: selectedStudents,
            newSection: selectedOption,
        };

        try {
            const res = await axios.post(
                `${apiUrl}api/students/swap-section`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            window.location.reload();
        } catch (err) {
            console.error("Error while swapping students : ", err);
        }

    };

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30 z-60"></div>

            {/* Modal */}
            <section
                className="fixed top-1/2 left-1/2 z-65 w-[32%] bg-white rounded-lg shadow-lg p-6 
                -translate-x-1/2 -translate-y-1/2 animate-fadeIn"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium">Edit Allocation</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 cursor-pointer hover:text-black"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Section Options */}
                <div className="flex flex-col gap-3">
                    {filteredSections.map((sec, index) => (
                        <div
                            key={index}
                            className="border border-[#D6D6D6] rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleRowClick(sec.section)}
                        >
                            <input
                                type="radio"
                                name="swap_option"
                                checked={selectedOption === sec.section}
                                onChange={() => handleRowClick(sec.section)}
                                className="w-4 h-4"
                            />
                            <label className="cursor-pointer text-gray-700">
                                Swap to {sec.section}
                                {/* <h1>({sec.count} Students)</h1> */}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSwap}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </section>
        </>
    );
};

export default SwapStudentModal;
