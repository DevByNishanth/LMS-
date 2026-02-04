import { X } from "lucide-react";
import React, { useState } from "react";
import { Paperclip, Link, Youtube, Plus, Upload } from "lucide-react";
import AssignmentResourceModal from "./AssignmentResourceModal";

const AddAnnouncementModal = ({ setIsAnnouncementModal }) => {
  // States
  const [selectedAttachmentOption, setSelectedAttachmentOption] =
    useState(null);
  const [openingFrom, setOpeningFrom] = useState("AnnouncementModal");

  return (
    <>
      <div className="tint-container fixed inset-0 bg-black/50 z-100"></div>
      <div className="modal-container w-[90%] md:w-[40%] bg-white rounded-lg absolute top-1/2 left-[50%] translate-y-[-50%] translate-x-[-50%] z-120">
        {/* header  */}
        <header className="px-4 py-2 pb-3 flex items-center justify-between border-b border-gray-200">
          <h1 className="font-medium text-lg text-[#333333]">
            New Announcement
          </h1>
          <button
            onClick={() => {
              setIsAnnouncementModal(false);
            }}
            className="close-btn cursor-pointer bg-gray-200 rounded-full w-8 h-8 p-1 flex items-center justify-center"
          >
            <X className="w-[100%] h-[100%] text-gray-700" />
          </button>
        </header>

        {/* input-container  */}
        <div className="input-container m-4">
          <textarea className="border border-gray-600 rounded outline-none focus:border-gray-700 p-2 w-full min-h-[140px] max-h-40 "></textarea>

          {/* Attachment icons  */}
          <div className="attachment-container mt-4">
            <h1 className="text-gray-800 font-medium">Attach Any</h1>
            <div className="flex gap-6 text-xs text-gray-600 mt-4">
              <div
                onClick={() => setSelectedAttachmentOption("link")}
                className="flex flex-col items-center gap-1 cursor-pointer hover:text-black hover:font-medium"
              >
                <div className="icon-container bg-[#FAFAFA] border border-gray-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <Link className="w-4 h-4" />
                </div>
                Link
              </div>
              <div
                onClick={() => setSelectedAttachmentOption("drive")}
                className="flex flex-col items-center gap-1 cursor-pointer hover:text-black hover:font-medium"
              >
                <div className="icon-container bg-[#FAFAFA] border border-gray-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <Paperclip className="w-4 h-4" />
                </div>
                Drive
              </div>
              <div
                onClick={() => setSelectedAttachmentOption("youtube link")}
                className="flex flex-col items-center gap-1 cursor-pointer hover:text-black hover:font-medium"
              >
                <div className="icon-container bg-[#FAFAFA] border border-gray-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <Youtube className="w-4 h-4" />
                </div>
                Youtube
              </div>
              <div
                onClick={() => setSelectedAttachmentOption("upload")}
                className="flex flex-col items-center gap-1 cursor-pointer hover:text-black hover:font-medium"
              >
                <div className="icon-container bg-[#FAFAFA] border border-gray-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                Upload
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 py-5 px-6 w-full ">
          <button
            type="button"
            onClick={() => {
              setIsAnnouncementModal(false);
            }}
            className="px-4 py-2 border border-gray-600 rounded cursor-pointer bg-[#FAFAFA] text-black hover:opacity-90"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 cursor-pointer rounded bg-[#0B56A4] text-white hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>

      {/* modals  */}
      {selectedAttachmentOption && (
        <AssignmentResourceModal
          selectedAttachmentOption={selectedAttachmentOption}
          setSelectedAttachmentOption={setSelectedAttachmentOption}
          openingFrom={openingFrom}
          setOpeningFrom={setOpeningFrom}
        />
      )}
    </>
  );
};

export default AddAnnouncementModal;
