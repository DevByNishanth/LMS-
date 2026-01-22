import React, { useEffect, useRef } from "react";
import deleteImg from "../assets/deleteIllustration.svg";
import axios from "axios";
const DeleteModal = ({ setIsDelete, deleteId }) => {
  // Authorization
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;
  // ref
  const modalRef = useRef(null);

  // functions
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${apiUrl}api/faculty/faculty/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        window.location.reload();
      }
    } catch (err) {
      console.error("error occured while deleting faculty : ", err.message);
    }
  };
  return (
    <>
      <div
        onClick={() => {
          setIsDelete(false);
        }}
        className="fixed bg-black/40 inset-0 z-50"
      ></div>
      <section
        ref={modalRef}
        className="w-[420px] absolute top-[50%] z-60 left-[50%] translate-x-[-50%] translate-y-[-60%] bg-white p-4 rounded-lg border border-gray-300"
      >
        <img src={deleteImg} className="w-[100%]  m-auto h-[140px]" />
        <div className="content-container mt-6 ">
          <h1 className="font-medium text-center text-lg">
            Remove this Faculty?
          </h1>
          <h1 className="text-gray-600 text-sm text-center ">
            This action will permanently remove the faculty from the system.
          </h1>
          <div className="btn-container flex gap-3 justify-center mt-3">
            <button
              onClick={() => setIsDelete(false)}
              className="font-medium w-[50%] text-md hover:bg-gray-200 hover:text-black hover:border-none cursor-pointer border border-gray-300 rounded-lg px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDelete(deleteId);
              }}
              className="font-medium text-md w-[50%] hover:bg-white hover:border border-gray-300 hover:text-black cursor-pointer transition-all duration-300 bg-[#0B56A4] text-white rounded-lg px-4 py-2"
            >
              Delete
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default DeleteModal;
