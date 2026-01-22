import React from "react";
import deleteImg from "../assets/deleteImg.svg";
const StaffDeleteModal = ({ setDeleteModal, handleDelete }) => {
  return (
    <>
      <div
        onClick={() => setDeleteModal(false)}
        className="fixed inset-0 z-50 bg-black/30"
      ></div>
      <div className="container-1 z-60 w-[400px] rounded-lg bg-white p-4 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="content-container">
          <img src={deleteImg} className="w-[120px] h-[120px] m-auto" />
          <h1 className="text-md text-[#333333] text-center">
            Please confirm that you want to remove this faculty member.
          </h1>
          <div className="btn-container w-[100%] flex gap-2 mt-4 items-center">
            <button onClick={() => setDeleteModal(false)} className="bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-lg py-2 text-black w-[50%]">
              Cancel
            </button>
            <button onClick={handleDelete} className="bg-slate-800 hover:bg-slate-900 cursor-pointer rounded-lg py-2 text-white w-[50%]">
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDeleteModal;
