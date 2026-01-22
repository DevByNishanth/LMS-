import React from 'react';
import axios from "axios";
import deleteIcon from '../assets/deleteIllustration.svg';

const StudentDeleteModal = ({ setDeleteData, setIsDeleteModal, deletedata }) => {
    
    // Authorization
    const token = localStorage.getItem("LmsToken");
    const apiUrl = import.meta.env.VITE_API_URL;

  // DELETE FUNCTION
  const handleDelete = async () => {
    try {
      const id = deletedata?._id;
      if (!id) {
        console.error("No ID found");
        return;
      }
      await axios.delete(`${apiUrl}api/students/delete/${id}`, {
        headers: {
            Authorization : `Bearer ${token}`
        }
      });

      // Close the modal after success
      setDeleteData(null)
      setIsDeleteModal(false);
      window.location.reload();

      // Optional: refresh list if needed
      // window.location.reload();

    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50"></div>

      <section className='w-[30%] bg-white absolute z-60 p-6 rounded-lg top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
        
        <img src={deleteIcon} className="w-[200px] m-auto" />
        
        <h1 className='text-gray-600 text-center mt-4'>
          Please confirm that you want to remove this faculty member.
        </h1>

        <div className="button-container flex items-center gap-3 mt-3">

          <button
            onClick={() => setIsDeleteModal(false)}
            className='px-4 py-2 rounded-lg cursor-pointer w-[50%] text-black border border-gray-400 hover:bg-gray-200 transition-all duration-200 hover:border-none'
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className='bg-[#0b55a3] px-4 py-2 rounded-lg cursor-pointer w-[50%] text-white hover:bg-[#05488f] hover:bordersde border-gray-300 transition-all duration-200'
          >
            Delete
          </button>
        </div>

      </section>
    </>
  );
};

export default StudentDeleteModal;
