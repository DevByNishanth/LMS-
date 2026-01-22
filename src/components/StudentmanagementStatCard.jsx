import React from 'react'
import { Users, User } from "lucide-react";
const StudentmanagementStatCard = () => {
  return (
    <>
        <section className='col-span-7'>
             <section className="grid grid-cols-7 gap-4">
      
      {/* LEFT BIG CARD */}
      <div className="col-span-2 flex items-center bg-[#DED9F9] rounded-xl py-6 px-4 ">
        <div className="space-y-2 text-[#282526] font-medium">
          <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center">
            <Users size={22} />
          </div>
          <h2 className="">Total Students</h2>
        <p className="text-lg">600</p>
        </div>
      </div>

      {/* RIGHT SMALL CARDS */}
      <div className="col-span-5 grid grid-cols-2 gap-4">
        {/* 1st Year */}
        <div className="bg-[#D2F8ED] rounded-xl p-5 ">
          <div className="flex items-center gap-2 text-[#282526]">
            <div className="w-8 h-8 bg-[#58A08B] text-white rounded-full flex items-center justify-center">
              <User size={18} />
            </div>
          <div>
              <h3 className="font-medium">First year</h3>
             <p className="text-lg font-medium">200</p>
          </div>
          </div>
         
        </div>

        {/* 2nd Year */}
         <div className="bg-[#D9EBFE] rounded-xl p-5 ">
          <div className="flex items-center gap-2 text-[#282526]">
            <div className="w-8 h-8 bg-[#59AAFF] text-white rounded-full flex items-center justify-center">
              <User size={18} />
            </div>
          <div>
              <h3 className="font-medium">Second year</h3>
             <p className="text-lg font-medium">200</p>
          </div>
          </div>
         
        </div>

        {/* 3rd Year */}
      <div className="bg-[#FFEED9] rounded-xl p-5 ">
          <div className="flex items-center gap-2 text-[#282526]">
            <div className="w-8 h-8 bg-[#FFA73A] text-white rounded-full flex items-center justify-center">
              <User size={18} />
            </div>
          <div>
              <h3 className="font-medium">Third year</h3>
             <p className="text-lg font-medium">200</p>
          </div>
          </div>
         
        </div>

        {/* 4th Year */}
       <div className="bg-[#DED9F9] rounded-xl p-5 ">
          <div className="flex items-center gap-2 text-[#282526]">
            <div className="w-8 h-8 bg-[#927DFF] text-white rounded-full flex items-center justify-center">
              <User size={18} />
            </div>
          <div>
              <h3 className="font-medium">Fourth year</h3>
             <p className="text-lg font-medium">200</p>
          </div>
          </div>
         
        </div>

      </div>
    </section>
        </section>
    </>
  )
}

export default StudentmanagementStatCard