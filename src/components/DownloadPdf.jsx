import React, { useState } from 'react'
import downloadImg from '../assets/pana-2.svg'
import eyeIcon from '../assets/eye-icon.svg'
import { Download, Eye } from 'lucide-react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
const DownloadPdf = () => {
    // ---------------------------------------------------------------------------------------- 
    // Auth 
    const token = localStorage.getItem("LmsToken");
    const apiUrl = import.meta.env.VITE_API_URL

    // de-structuring data's from params => URL------------------------------------------------- 
    const { classId, sectionId } = useParams();

    // states ----------------------------------------------------------------------------
    const [btnLoading, setBtnLoading] = useState(false);
    const [previewLoading, setPrevireLoading] = useState(false)

    // functions ------------------------------------------------------------------------------- 
    const handleDownload = async () => {
        try {
            setBtnLoading(true)
            const res = await axios.get(
                `${apiUrl}api/course-pdf/generatePdf/${classId}/${sectionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "text",
                }
            );

            const html = res.data;

            const printWindow = window.open("", "_blank");
            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();

            printWindow.onload = function () {
                setTimeout(() => {
                    printWindow.print();
                }, 100);
            };
            setBtnLoading(false)
        } catch (err) {
            setBtnLoading(false)
            console.error("Error while downloading pdf:", err);
        }
    }

    const handlePreview = async () => {
        try {
            setPrevireLoading(true)
            const res = await axios.get(
                `${apiUrl}api/course-pdf/generatePdf/${classId}/${sectionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "text",
                }
            );

            const html = res.data;

            const printWindow = window.open("", "_blank");
            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();

            setPrevireLoading(false)

        } catch (err) {
            setPrevireLoading(false)
            console.error("Error while downloading pdf:", err);
        }
    }

    // jsx 
    return (
        <>
            <div className="h-full flex flex-col p-2 bg-white">
                <div className="download-img-container">
                    <img src={downloadImg} className="w-[40%] h- m-auto" />
                </div>

                <div className="content-contain text-center mt-2">
                    <h1 className='text-[#0B56A4] font-medium text-lg'>Download Your Course Plan here</h1>
                    <h1 className='text-gray-500 text-sm'>Access and download your complete course plan including units, topics, schedule, and teaching resources for better academic planning easily.</h1>
                </div>

                <div className="btn-container flex items-center gap-2 justify-center mt-4"  >

                    <button disabled={previewLoading} onClick={handlePreview} className={`border border-[#b5b8b9] rounded-lg flex  hover:bg-gray-200 hover:border-none items-center gap-2 px-4 py-2 ${previewLoading ? "cursor-not-allowed bg-gray-400/20 pointer-events-none" : "cursor-pointer"}`}><Eye className='text-black' /> {previewLoading ? "Getting ready" : "preview"} {previewLoading && <span className='loader'></span>} </button>
                    <button disabled={btnLoading} onClick={handleDownload} className={`border border-[#08384f] bg-[#08384f] hover:bg-[#08394fde]  text-white rounded-lg flex items-center gap-2 px-4 py-2 ${btnLoading ? "cursor-not-allowed bg-[#08384f]/80 pointer-events-none" : "cursor-pointer"}`}><Download />{btnLoading ? "Getting ready" : "Download"} {btnLoading && <span className='white-loader'></span>}</button>
                </div>
            </div>
        </>
    )
}

export default DownloadPdf