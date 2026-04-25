import { useState } from "react";

const StudentClassroomPeople = () => {
  const teachers = [
    { name: "Surya Chandran" },
    { name: "Rajesh Kumar" },
  ];

  // states 
  const [selectedTab, setSelectedTab] = useState("teachers")

  return (
    <section className="w-full p-6 h-full border border-[#DBDBDB] rounded-lg">
      <div className="tab-container px-4 py-2 flex items-center gap-2 bg-[#E6E9F5] rounded-full">
        <button onClick={()=>setSelectedTab("teachers")} className={`w-full py-2 px-3 rounded-full ${selectedTab == "teachers" ? "bg-[#08384F] text-white" : "text-black"}  `}>
          Teachers
        </button>
        <button onClick={()=>setSelectedTab("classmates")} className={`w-full py-2 px-3 rounded-full  ${selectedTab !== "teachers" ? "bg-[#08384F] text-white" : "text-black"} `}>
          Classmates
        </button>
      </div>

      <header className="mt-4">
        <h1 className="font-medium text-lg">
          Teachers List{" "}
          <span className="text-[#0B56A4]">({teachers.length})</span>
        </h1>
      </header>

      <div className="teachers-list w-full mt-2 max-h-[calc(100vh-320px)] overflow-auto space-y-2">
        {teachers.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 py-3 border-b border-gray-300"
          >
            <p className="bg-[#08384f] w-7 h-7 rounded-full text-white flex items-center justify-center">
              {item.name.slice(0, 1)}
            </p>
            <p className="text-sm font-medium text-gray-800">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudentClassroomPeople;
