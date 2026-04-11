import React from 'react'
import Sidebar from '../components/Sidebar'
import AdminStatcard from '../components/AdminStatcard'
import DepartmentPieChart from '../components/DepartmentPieChart'
import StudentBarChart from '../components/StudentBarChart'
import FacultyBarList from '../components/FacultyBarList'
import { Bell } from 'lucide-react'

const AdminDashboard = () => {
  return (

    <>
      <section className="w-full h-screen flex">
        <div className="container-1 w-[20%] h-full">
          <Sidebar />
        </div>
        <div className="container-2 w-[80%] h-full ">
          {/* header */}
          <header className="border-b border-gray-200 flex items-center justify-between bg-white p-6 sticky top-0 z-10">
            <h1 className='text-xl font-medium text-gray-800'>Dashboard</h1>

            <div className="icons-container flex gap-2 items-center">
              <div className="bell-icon border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                <Bell size={18} className='text-gray-600' />
              </div>
              <div className="name-container bg-[#08384f] text-white w-8 h-8 flex items-center justify-center rounded-full">
                <h1 className=''>A</h1>
              </div>
            </div>


          </header>

          <div className="p-6 grid grid-cols-4 gap-6 auto-rows-min">

            {/* Top stat cards */}
            <AdminStatcard />

            {/* Right side (tall) */}
            <div className="row-span-2 h-full">
              <DepartmentPieChart />
            </div>

            {/* Graph area */}
            <div className="col-span-3  overflow-y-auto hide-scrollbar border border-gray-300 shadow rounded-lg   ">
              <FacultyBarList />
            </div>

          </div>

          <div className="border border-gray-300 mx-6 h-[420px] shadow  rounded-lg">
            <StudentBarChart />
          </div>
        </div>
      </section>
    </>
  )
}

export default AdminDashboard