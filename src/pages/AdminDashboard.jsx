import React from 'react'
import Sidebar from '../components/Sidebar'
import AdminStatcard from '../components/AdminStatcard'
import DepartmentPieChart from '../components/DepartmentPieChart'
import StudentBarChart from '../components/StudentBarChart'
import FacultyBarList from '../components/FacultyBarList'
import { Bell } from 'lucide-react'
import AdminRecentlyAddedFaculty from '../components/AdminRecentlyAddedFaculty'
import ChartAreaLinear from '../components/ChartAreaLinear'

const AdminDashboard = () => {
  return (

    <>
      <section className="w-full h-screen flex">
        <div className="container-1 w-[20%] h-full">
          <Sidebar />
        </div>
        <div className="container-2 w-[80%] h-full ">
          {/* header */}
          <header className="border-b border-gray-200 flex items-center justify-between bg-white px-6 py-3 sticky top-0 z-10">
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

          <div className="p-6 grid grid-cols-4 gap-2  auto-rows-min">

            {/* Top stat cards */}
            <AdminStatcard />

            {/* Right side (tall) */}
            <div className="row-span-2 h-[440px] overflow-y-auto hide-scrollbar">
              <AdminRecentlyAddedFaculty />
            </div>

            {/* Graph area */}
            <div className='mt-8 area-graph col-span-3 h-[300px] border w-full bg-white rounded-xl shadow-sm  border-gray-200'>
              <div className="header px-4 py-2 flex items-center">
                <h1 className='text-sm font-medium'>Faculty in each department</h1>
              </div>
              <ChartAreaLinear />
            </div>


          </div>
          <StudentBarChart />


        </div>
      </section>
    </>
  )
}

export default AdminDashboard