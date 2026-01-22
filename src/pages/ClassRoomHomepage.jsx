import { Plus, Search } from "lucide-react";
import folderIcon from "../assets/folderIcon.svg";
import archiveIcon from '../assets/archiveIcon.svg'
import { Link } from "react-router-dom";

const classes = [
    {
        id: 1,
        section: "III_CSE_A",
        subject: "Crypto and Encryption",
        teacher: "Surya Chandran",
        image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    },
    {
        id: 2,
        section: "III_CSE_A",
        subject: "Cyber Security",
        teacher: "Surya Chandran",
        image:
            "https://images.unsplash.com/photo-1517433456452-f9633a875f6f",
    },
    {
        id: 3,
        section: "III_CSE_A",
        subject: "Data Science and Security",
        teacher: "Surya Chandran",
        image:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    },
    {
        id: 4,
        section: "III_CSE_A",
        subject: "Digital Signal Processing",
        teacher: "Surya Chandran",
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
    {
        id: 3,
        section: "III_CSE_A",
        subject: "Data Science and Security",
        teacher: "Surya Chandran",
        image:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    },
    {
        id: 4,
        section: "III_CSE_A",
        subject: "Digital Signal Processing",
        teacher: "Surya Chandran",
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
];

const ClassRoomHomepage = () => {
    return (
        <div className="px-6 ">
            {/* Header */}
            <div className="mt-2 flex items-center justify-between mb-4">
                <div className="searchbar-container border border-[#D9D9D9] rounded-lg flex items-center gap-2 px-2 ">
                    <input
                        type="text"
                        placeholder="Search Subject and class"
                        className="w-80 px-4 py-2   focus:outline-none "
                    />
                    <Search className="text-gray-400" />
                </div>

                <button className="bg-[#0B56A4] text-white flex items-center gap-2 px-4 py-2 rounded-md hover:bg-[#0b55a4ce] cursor-pointer transition">
                    <Plus /> Create new Class
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-160px)]  overflow-y-auto ">
                {classes.map((cls) => (
                    <Link
                        to={`/dashboard/classroom/class/${cls.id}`}
                        key={cls.id}
                        className="rounded-lg cursor-pointer rounded-t-xl bg-white shadow hover:shadow-lg transition"
                    >
                        {/* Card Header */}
                        <div className="relative" >
                            <div className="background-img relative ">
                                <img src={cls.image} className="h-36 rounded-t-xl object-cover w-full" />
                                <div className="absolute top-0 rounded-t-xl right-0 bottom-0 left-0 tint"></div>
                            </div>
                            <div className="text-container text-white absolute top-[20%] left-[4%] ">
                                <p className="text-sm opacity-90">{cls.section}</p>
                                <h2 className="text-xl font-semibold mt-1">
                                    {cls.subject}
                                </h2>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between p-4 ">
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://i.pravatar.cc/40"
                                    alt="teacher"
                                    className="w-10 h-10 rounded-full"
                                />
                                <p className="text-sm font-medium text-gray-700">
                                    {cls.teacher}
                                </p>
                            </div>

                            <div className="flex gap-3 text-gray-500">
                                <button className="hover:text-gray-700"><img src={archiveIcon} className="w-6 h-6" /></button>
                                <button className="hover:text-gray-700"><img src={folderIcon} className="w-6 h-6" /></button>
                                <button className="hover:text-gray-700"><span className=""><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                </svg></span></button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ClassRoomHomepage;
