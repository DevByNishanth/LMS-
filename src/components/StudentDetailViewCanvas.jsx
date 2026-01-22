import React, { useRef, useEffect } from "react";
import manImg from "../assets/man.svg";
import { Badge, Book, Building2, Calendar1Icon, IdCardLanyard, Key } from "lucide-react";

const StudentDetailViewCanvas = ({ setIsDetailCanvas, canvasData }) => {
    // ref's
    const canvasRef = useRef(null);

    // useEffect's
    useEffect(() => {
        function handleOutsideClick(e) {
            if (canvasRef.current && !canvasRef.current.contains(e.target)) {
                setIsDetailCanvas(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [setIsDetailCanvas]);

    return (
        <>
            <div className="fixed inset-0 bg-black/20 z-50"></div>
            <section
                ref={canvasRef}
                className="w-[45%] bg-white h-[100vh] z-[60] fixed right-0 top-0 shadow-xl transition-all duration-300 overflow-y-auto"
            >
                <div className="content-container mt-4 px-3 ">
                    <div className="header flex gap-2">
                        <div className="img-container w-[30%] h-[190px] rounded-lg ">
                            {canvasData?.profileImg ? <img
                                src={manImg}
                                className="h-full w-full object-cover rounded-lg"
                            /> : <div className="border border-gray-200 bg-[#ded9f9] rounded-lg h-full w-full flex items-center justify-center">
                                <p className="text-3xl">{canvasData?.firstName?.slice(0, 1)}</p>
                            </div>}
                        </div>
                        <div className="personal-details-container bg-gray-50 border border-gray-200 rounded-md p-2 h-[190px] w-[70%]">
                            <table className="text-[12px]">
                                <tbody>
                                    <tr>
                                        <td className="text-gray-800 w-[100px] ">First Name</td>
                                        <td className="text-gray-600 w-[200px]">{canvasData?.firstName || "--"}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-800 w-[100px] pt-2">Last Name</td>
                                        <td className="text-gray-600 w-[200px] pt-2">{canvasData?.lastName || "--"}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-800 w-[100px] pt-2">Email</td>
                                        <td className="text-gray-600 w-[200px] overflow-hidden pt-2">
                                            {canvasData?.email || "--"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-800 w-[100px] pt-2">
                                            Gender
                                        </td>
                                        <td className="text-gray-600 w-[200px] overflow-hidden pt-2">
                                            {canvasData?.gender || "--"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-800 w-[100px] pt-2">
                                            Date of Birth
                                        </td>
                                        <td className="text-gray-600 w-[200px] pt-2">
                                            {canvasData?.dateOfBirth || "--"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-800 w-[100px] pt-2">Phone</td>
                                        <td className="text-gray-600 w-[200px] pt-2">{canvasData?.mobileNumber || "--"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="employe-details-container mt-4">
                        <h1 className="font-medium text-lg text-[#333333]">
                            Academic Details
                        </h1>
                        <div className="container-1 mt-4 grid grid-cols-3 gap-x-12 gap-y-6 px-4">
                            <div className="detail">
                                <div className="heading flex items-center gap-2">
                                    <IdCardLanyard className="text-violet-900 w-5 h-5" />
                                    <h1 className="text-black">Register Number</h1>
                                </div>
                                <h1 className="mt-1 text-gray-500 ">{canvasData?.registerNumber || "--"}</h1>
                            </div>
                            <div className="detail">
                                <div className="heading flex items-center gap-2">
                                    <Book className="text-violet-900 w-5 h-5" />
                                    <h1 className="text-black">Year</h1>
                                </div>
                                <h1 className="mt-1 text-gray-500 ">{canvasData?.year || "--"}</h1>
                            </div>
                            <div className="detail">
                                <div className="heading flex items-center gap-2">
                                    <Building2 className="text-violet-900 w-5 h-5" />
                                    <h1 className="text-black">Department</h1>
                                </div>
                                <h1 className="mt-1 text-gray-500 ">{canvasData?.department || "--"}</h1>
                            </div>
                            <div className="detail whitespace-nowrap">
                                <div className="heading flex items-center gap-2">
                                    <Key className="text-violet-900 w-5 h-5 flex-shrink-0" />
                                    <h1 className="text-black">Section</h1>
                                </div>
                                <h1 className="mt-1 text-gray-500 ">{canvasData?.section || "--"}</h1>
                            </div>
                            <div className="detail whitespace-nowrap">
                                <div className="heading flex items-center gap-2">
                                    <Calendar1Icon className="text-violet-900 w-5 h-5 flex-shrink-0" />
                                    <h1 className="text-black">Regulation</h1>
                                </div>
                                <h1 className="mt-1 text-gray-500 ">{canvasData?.regulation || "--"}</h1>
                            </div>
                            <div className="detail whitespace-nowrap">
                                <div className="heading flex items-center gap-2">
                                    <Badge className="text-violet-900 w-5 h-5 flex-shrink-0" />
                                    <h1 className="text-black">Status</h1>
                                </div>
                                <h1 className="mt-1 text-gray-500 ">{canvasData?.status || "--"}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default StudentDetailViewCanvas;
