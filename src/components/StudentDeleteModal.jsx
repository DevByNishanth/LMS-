import React from "react";
import axios from "axios";
import deleteIcon from "../assets/deleteIllustration.svg";

const StudentDeleteModal = ({
  setDeleteData,
  setIsDeleteModal,
  deletedata,
}) => {
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleDelete = async () => {
    try {
      const id = deletedata?._id;
      if (!id) {
        console.error("No ID found");
        return;
      }
      await axios.delete(`${apiUrl}api/students/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDeleteData(null);
      setIsDeleteModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete the student. Please try again.");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsDeleteModal(false)}
      ></div>

      <section className="w-[400px] bg-white fixed z-[60] p-8 rounded-2xl top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-2xl">
        <div className="flex flex-col items-center">
          <img
            src={deleteIcon}
            className="w-[180px] mb-4"
            alt="Delete confirmation"
          />

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Are you sure?
          </h2>
          <p className="text-gray-500 text-center text-sm leading-relaxed mb-6">
            This action cannot be undone. Please confirm that you want to remove{" "}
            <strong>{deletedata?.firstName}</strong> from the records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDeleteModal(false)}
            className="flex-1 px-4 py-2.5 rounded-xl cursor-pointer text-gray-600 font-semibold border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-95"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 bg-[#08384F] px-4 py-2.5 rounded-xl cursor-pointer text-white font-semibold hover:shadow-xs shadow-[#08384F] transition-all active:scale-95"
          >
            Delete
          </button>
        </div>
      </section>
    </>
  );
};

export default StudentDeleteModal;
