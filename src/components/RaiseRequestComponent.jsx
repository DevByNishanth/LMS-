import React, { useRef, useState } from 'react'
import axios from 'axios'
import sorry from '../assets/sorry.svg'
import { ChevronDown, Search, X } from 'lucide-react'

const RaiseRequestComponent = ({ setModal, filteredStudents, activeHour, subjectId, sectionId, date }) => {

  // states 
  const [studentList] = useState(filteredStudents);
  const [isDropdown, setIsDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ref 
  const inputRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Derive hour key e.g. "1st Hour (08:40AM - 09:30AM)" -> "1stHour"
  function getHourKey(hourLabel) {
    return hourLabel.split(" (")[0].replace(" ", "");
  }

  // functions ----------------------------------------------
  function focusSearch() {
    inputRef.current?.focus();
  }

  function handleCheckboxChange(student) {
    const isSelected = selectedStudent.some(s => s.rollNumber === student.rollNumber);
    if (isSelected) {
      setSelectedStudent(selectedStudent.filter(s => s.rollNumber !== student.rollNumber));
    } else {
      // Add student with their current status and no requestedStatus yet
      setSelectedStudent([...selectedStudent, { ...student, requestedStatus: null }]);
    }
  }

  function isStudentSelected(student) {
    return selectedStudent.some(s => s.rollNumber === student.rollNumber);
  }

  function getStatusOptions(currentStatus) {
    if (currentStatus === "Present") return ["Absent", "On-Duty"];
    if (currentStatus === "Absent") return ["Present", "On-Duty"];
    if (currentStatus === "On-Duty") return ["Present", "Absent"];
    return ["Present", "Absent", "On-Duty"];
  }

  function handleStatusSelect(rollNumber, newStatus) {
    setSelectedStudent(selectedStudent.map(s =>
      s.rollNumber === rollNumber ? { ...s, requestedStatus: newStatus } : s
    ));
  }

  async function handleClick() {
    if (selectedStudent.length === 0) {
      setError("Please select at least one student.");
      return;
    }

    const unset = selectedStudent.filter(s => !s.requestedStatus);
    if (unset.length > 0) {
      setError("Please select a requested status for all selected students.");
      return;
    }

    setError(null);
    setLoading(true);

    const token = localStorage.getItem("LmsToken");
    const hourKey = getHourKey(activeHour); // e.g. "1stHour"

    try {
      const requests = selectedStudent.map(student =>
        axios.post(
          `${apiUrl}api/attendance/edit-request`,
          {
            subjectId: subjectId,
            sectionId: sectionId,
            studentId: student._id,
            date: date,
            hour: hourKey,
            hourLabel: activeHour,
            currentStatus: student.status,
            requestedStatus: student.requestedStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );

      await Promise.all(requests);
      setSuccess(true);
      setSelectedStudent([]);
    } catch (err) {
      console.error("Error raising request:", err);
      setError(err.response?.data?.message || "Failed to raise request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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

        {/* Success message */}
        {success && (
          <div className="mx-4 mb-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            Request raised successfully!
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mx-4 mb-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* main table container ----------------------------------- */}
        <>
          <div className="container px-4 ">
            <div className="drpdown-container relative">
              <div className="dropdown border w-[100%] px-3 py-2 border-gray-400 rounded-md">
                <div className="dropdown-tab cursor-pointer flex items-center justify-between w-full" onClick={() => { setIsDropdown(!isDropdown); setTimeout(focusSearch, 100); }}>
                  <p>
                    {selectedStudent.length > 0
                      ? `${selectedStudent.length} student(s) selected`
                      : "Select student"}
                  </p>
                  <ChevronDown className={` ${isDropdown ? 'rotate-180' : 'transition-all duration-300'} `} />
                </div>
              </div>

              {isDropdown && (
                <div className="search-result bg-white shadow-md border border-gray-400 rounded-md mt-1 w-[100%] absolute z-20 max-h-[300px] overflow-auto px-2">

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
                          item.status !== null &&
                          (
                            (item.name && item.name.toLowerCase().includes(searchInput.toLowerCase())) ||
                            (item.rollNumber && item.rollNumber.toString().toLowerCase().includes(searchInput.toLowerCase()))
                          )
                        )
                        .map((item, index) => (
                          <div key={index} className="dropdown-item px-3 py-2 hover:bg-gray-200 rounded-md cursor-pointer">
                            <div onClick={() => handleCheckboxChange(item)} className='flex items-center gap-2 '>
                              <input
                                type="checkbox"
                                className='accent-[#08384f] scale-120'
                                checked={isStudentSelected(item)}
                                onChange={() => handleCheckboxChange(item)}
                              />
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
                {selectedStudent.length > 0 ? (
                  selectedStudent.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="py-2 pl-4">{item.name}</td>
                      <td className="py-2 pl-4">{item.status}</td>
                      <td className="py-2 pl-4">
                        <div className="flex items-center gap-3">
                          {getStatusOptions(item.status).map((option, i) => (
                            <label key={i} className="flex items-center gap-1 cursor-pointer text-sm">
                              <input
                                type="radio"
                                name={`status-${item.rollNumber}`}
                                value={option}
                                checked={item.requestedStatus === option}
                                onChange={() => handleStatusSelect(item.rollNumber, option)}
                                className="accent-[#08384f]"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 pl-4 text-center text-gray-500">No data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="btn-container px-4 flex gap-3 justify-end absolute bottom-4 right-1">

            <button onClick={() => setModal(false)} className="bg-mist-800 border border-neutral-300 text-black py-2 px-4 rounded hover:bg-gray-200 cursor-pointer mt-4">
              Cancel
            </button>
            <button
              onClick={handleClick}
              disabled={loading}
              className="bg-[#08384F] text-white py-2 px-4 rounded hover:bg-[#08394fda] cursor-pointer mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Raise Request"}
            </button>
          </div>
        </>

      </section>
    </>
  )
}

export default RaiseRequestComponent