import classRoombanner1 from '../assets/classRoombanner1.svg';
import folderIcon from "../assets/folderIcon.svg";
import archiveIcon from '../assets/archiveIcon.svg'
import profileImg from '../assets/profileImg.svg';
import copyIcon from '../assets/copyIcon.svg';
import { Plus } from 'lucide-react';
import postBadge from '../assets/postBadge.svg'


const ClassRoomStreamComponent = () => {
    return (
        <>
            <section className='w-full h-full'>
                <div className="w-full h-full rounded-t-xl border border-gray-200 bg-white">
                    <div className="top-banner-section h-[30%] relative">
                        <div className="img-container w-full relative h-full">
                            <img src={classRoombanner1} className="transform rounded-t-xl scale-x-[-1] h-full w-full object-cover" />
                            <div className="absolute rounded-t-xl inset-0 bg-black/10"></div>
                        </div>
                        <div className="content-container absolute top-4 left-6 ">
                            <h1 className='font-medium text-xl text-[#00000]'>|||_CSE _ A</h1>
                            <h1 className='font- mt-2 text-lg text-[#00000]'>Crypto and Encryption</h1>
                        </div>

                        <div className="profile-container absolute bottom-2 left-6">
                            <h1 className='font-medium text-md text-[#333333] flex items-center gap-3'><span><img src={profileImg} className="w-8 h-8" /></span> Surya Chandran</h1>
                        </div>
                    </div>

                    {/* icon section  */}


                    <div className="post-container w-full h-[52%] overflow-y-auto px-4 mt-4">
                        {/* header  */}
                        <div className="header flex items-center justify-between">
                            <h1 className='flex items-center gap-2 font-medium'>Class Code :  <span className='flex items-center text-[#0B56A4] gap-2'>7K8H8K <img src={copyIcon} className="w-6 h-6" /></span></h1>
                            <button className='flex items-center gap-2 bg-[#0B56A4] text-white px-4 py-2 rounded-md hover:bg-[#0B56A4]/80 cursor-pointer'><Plus /> Add Announcement</button>
                        </div>


                        {/* classwork section  */}
                        <div className={`mt-2`}>
                            <div className="flex items-center justify-between bg-[#F9F9F9] border border-gray-200 rounded-lg px-2 py-3  max-w-full">
                                {/* Left side */}
                                <div className="flex items-center gap-3">
                                    {/* Icon */}
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0B56A4]">
                                        <img src={postBadge} className="w-4 h-4" />
                                    </div>

                                    {/* Text */}
                                    <div>
                                        <p className="text-md font-medium text-black">
                                            Posted a Assignment work : Sample
                                        </p>
                                    </div>
                                </div>

                                {/* Right side */}
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        Posted on 30/1/2026 at <span className="">11:42AM</span>
                                    </p>

                                    {/* More icon */}
                                    <div className="cursor-pointer text-gray-500 hover:text-gray-700">
                                        <svg
                                            className="w-5 h-5"
                                            fill="black"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* feed section  */}
                        <div className="announcement-container">

                        </div>



                    </div>

                </div>

            </section>
        </>
    )
}

export default ClassRoomStreamComponent