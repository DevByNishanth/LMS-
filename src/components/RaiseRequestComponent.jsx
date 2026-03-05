import React, { useRef, useState } from 'react'
import sorry from '../assets/sorry.svg'
import { ChevronDown, Search, X } from 'lucide-react'
const RaiseRequestComponent = ({ setModal, filteredStudents }) => {

  // states 
  const [studentList, setStudentList] = useState(filteredStudents);
  const [isDropdown, setIsDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // ref 

  const inputRef = useRef(null);

  // functions ----------------------------------------------
  function handleClick() {
    inputRef.current.focus();
  }


  // logs ------------------------------------------------
  console.log("filtered students : ", filteredStudents)
  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50"></div>
      <section className='w-[60%] bg-white h-full absolute right-0 top-0 z-60'>
        <header className="border-b border-gray-400 py-4 flex items-center justify-between px-4">
          <h1 className="text-lg font-medium">Raise Request</h1>
          <div onClick={() => setModal(false)} className="close bg-gray-300/50 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer">
            <X className='text-gray-700' />
          </div>
        </header>

        <div className="header-container flex items-center gap-3  mx-4  ">
          <img src={sorry} className="h-[210px] w-[40%]" />
          <div>
            <h1 className='text-gray-600'>Once attendance is marked, it cannot be edited. Please raise a request to the admin for edit access.</h1>
          </div>
        </div>

        {/* main table container ----------------------------------- */}

        <>
          <div className="container px-4 ">
            <div className="drpdown-container relative">
              <div className="dropdown border w-[100%] px-3 py-2 border-gray-400 rounded-md">
                <div className="dropdown-tab cursor-pointer flex items-center justify-between w-full" onClick={() => setIsDropdown(!isDropdown)}>
                  <p>Select student</p>
                  <ChevronDown className={` ${isDropdown ? 'rotate-180' : 'transition-all duration-300'} `} />
                </div>


              </div>

              {isDropdown && (
                <div className="search-result bg-white shadow-md border border-gray-400 rounded-md mt-1 w-[100%] absolute z-10 max-h-[300px] overflow-auto px-2">

                  <div className="dropdown-menu sticky top-2 bg-white z-20 bg-white border border-gray-400 rounded-md mt-1 w-[100%]  mt-2">
                    <div className="search-box flex items-center gap-2 px-3 py-2 ">
                      <Search size={18} className='text-gray-600' />
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder='Search by reg number or name...'
                        className='w-full outline-none'
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="student-list-container mt-2 mb-2 border h-[170px] border-gray-400 rounded-md overflow-auto">

                    {studentList.length > 0 ? (<>
                      {studentList
                        .filter(item =>
                          (item.name && item.name.toLowerCase().includes(searchInput.toLowerCase())) ||
                          (item.rollNumber && item.rollNumber.toString().toLowerCase().includes(searchInput.toLowerCase()))
                        )
                        .map((item, index) => (
                          <div key={index} className="dropdown-item px-3 py-2 hover:bg-gray-200 rounded-md cursor-pointer">
                            <div className='flex items-center gap-2 '>
                              <input type="checkbox" className='accent-[#08384f] scale-120' />
                              <p className='bg-[#08394f] w-7 h-7 rounded-full text-white flex items-center justify-center'>{item.name.slice(0, 1)}</p>
                              <p>{item.name} - {item.rollNumber}</p>
                            </div>
                          </div>
                        ))}
                    </>) : (<>
                      <p className="px-3 py-2">No students found.</p>

                    </>)}


                  </div>

                  <div className="btn-container flex justify-end mb-2">
                    <button onClick={() => setIsDropdown(false)} className='bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300 cursor-pointer'>Close</button>
                  </div>

                </div>
              )}
            </div>
          </div>

          <div className="table-container px-4 mt-4 h-[200px] overflow-auto ">
            <table className="w-full  border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left bg-[#08384F] text-white">
                  <th className="py-2 pl-4">Name</th>
                  <th className="py-2 pl-4">Current Status</th>
                  <th className="py-2 pl-4">Edit Status</th>
                </tr>
              </thead>

              <tbody className=''>
                {studentList.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="py-2 pl-4">{item.name}</td>
                    <td className="py-2 pl-4">{item.status}</td>
                    <td className="py-2 pl-4"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 
          <div className="btn-container px-4 flex gap-3 justify-end absolute bottom-4 right-1">

            <button onClick={handleClick} className="bg-mist-800 border border-neutral-300 text-black py-2 px-4 rounded hover:bg-gray-200 cursor-pointer mt-4">
              Cancel
            </button>
            <button onClick={handleClick} className="bg-[#08384F] text-white py-2 px-4 rounded hover:bg-[#08394fda] cursor-pointer mt-4">
              Raise Request
            </button>
          </div> */}
        </>

      </section>
    </>
  )
}

export default RaiseRequestComponent