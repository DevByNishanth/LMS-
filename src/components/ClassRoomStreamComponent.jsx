import classRoombanner1 from '../assets/classRoombanner1.svg';
import folderIcon from "../assets/folderIcon.svg";
import archiveIcon from '../assets/archiveIcon.svg'
import profileImg from '../assets/profileImg.svg';

const ClassRoomStreamComponent = () => {
    return (
        <>
            <section className='w-full h-full'>
                <div className="w-full h-full rounded-t-xl border border-gray-200 bg-white">
                    <div className="top-banner-section h-[40%] relative">
                        <div className="img-container w-full relative h-full">
                            <img src={classRoombanner1} className="transform rounded-t-xl scale-x-[-1] h-full w-full object-cover" />
                            <div className="absolute rounded-t-xl inset-0 bg-black/10"></div>
                        </div>
                        <div className="content-container absolute top-4 left-6 ">
                            <h1 className='font-medium text-xl text-[#00000]'>|||_CSE _ A</h1>
                            <h1 className='font- mt-2 text-lg text-[#00000]'>Crypto and Encryption</h1>
                        </div>

                        <div className="profile-container absolute bottom-4 left-6">
                            <h1 className='font-medium text-lg text-[#333333] flex items-center gap-3'><span><img src={profileImg} className="w-10 h-10" /></span> Surya Chandran</h1>
                        </div>
                    </div>
                    {/* icon section  */}
                    <div className="icon-container mt-2 flex items-center justify-end px-4 ">
                        <div className="flex gap-3 text-gray-500">
                            <button className="hover:text-gray-700 cursor-pointer"><img src={archiveIcon} className="w-6 h-6" /></button>
                            <button className="hover:text-gray-700  cursor-pointer"><img src={folderIcon} className="w-6 h-6" /></button>
                            <button className="hover:text-gray-700  cursor-pointer"><span className=""><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                            </svg></span></button>
                        </div>

                    </div>
                    
                    <div className="post-container w-full h-[52%]">

                    </div>

                </div>

            </section>
        </>
    )
}

export default ClassRoomStreamComponent