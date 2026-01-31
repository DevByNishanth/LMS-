import { Upload, X } from "lucide-react";
import React from "react";

const AssignmentResourceModal = ({
  selectedAttachmentOption,
  setSelectedAttachmentOption,
}) => {
  return (
    <>
      <div className="tint-container fixed inset-0 bg-black/50"></div>
      <section
        className={`assignment-resource-modal absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white w-[30%] h-[300px] rounded-lg z-50`}
      >
        {/* header  */}
        <div className="header border-b border-gray-300">
          {selectedAttachmentOption == "link" && (
            <h1 className="text-lg font-medium p-4">Add link</h1>
          )}
          {selectedAttachmentOption == "youtube link" && (
            <h1 className="text-lg font-medium p-4">Add youtube link</h1>
          )}
          {selectedAttachmentOption == "upload" && (
            <h1 className="text-lg font-medium p-4">Upload file</h1>
          )}
          <div
            onClick={() => setSelectedAttachmentOption(null)}
            className="btn-container bg-gray-200 w-8 h-8 flex items-center hover:bg-gray-300 justify-center rounded-full absolute top-4 right-4 cursor-pointer"
          >
            <X />
          </div>
        </div>

        {/* body section  */}
        {selectedAttachmentOption == "upload" ? (
          <>
            <div className="file-input-container mx-4 mt-4 ">
              <div className="border-2 rounded-xl border-dashed border-gray-400 w-full h-[140px] relative">
                <input
                  type="file"
                  className="opacity-0 absolute top-0 right-0 bottom-0 left-0"
                />
                <div className="image-contaienr text-center mt-6">
                  <Upload className="w-10 h-10 text-black-900 mx-auto mt-8" />
                  <h1 className="mt-2">Upload files here</h1>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="main-container mx-4 mt-4">
            <input
              type="text"
              placeholder="Enter the link"
              className="px-4 py-4 rounded border w-full border-gray-400"
            />
          </div>
        )}

        {/* footer  */}
        <div className="footer-btn absolute bottom-0 w-full flex justify-end gap-2 p-4 ">
          <button
            onClick={() => setSelectedAttachmentOption(null)}
            className="px-4 py-2 rounded cursor-pointer bg-[#D9D9D9] text-black hover:opacity-90"
          >
            Cancel
          </button>
          <button className="px-4 py-2 cursor-pointer rounded bg-[#0B56A4] text-white hover:opacity-90">
            Upload
          </button>
        </div>
      </section>
    </>
  );
};

export default AssignmentResourceModal;
