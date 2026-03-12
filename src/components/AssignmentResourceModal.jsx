import { Upload, X, AlertCircle } from "lucide-react";
import React, { useState } from "react";

const AssignmentResourceModal = ({
  selectedAttachmentOption,
  setSelectedAttachmentOption,
  openingFrom,
  setOpeningFrom,
  onSubmit,
  allowedExtensions = [],
  maxFileSize = 5 * 1024 * 1024,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = () => {
    if (onSubmit) {
      if (selectedAttachmentOption === "upload" && selectedFile) {
        onSubmit({ type: "upload", value: selectedFile });
      } else {
        onSubmit({ type: selectedAttachmentOption, value: inputValue });
      }
    }
    setInputValue("");
    setSelectedFile(null);
    setSelectedAttachmentOption(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (maxFileSize && file.size > maxFileSize) {
        alert(`File size exceeds 5MB. Please upload a smaller file.`);
        e.target.value = null;
        return;
      }

      if (allowedExtensions && allowedExtensions.length > 0) {
        const fileName = file.name.toLowerCase();
        const isValidExtension = allowedExtensions.some((ext) =>
          fileName.endsWith(ext.toLowerCase()),
        );

        if (!isValidExtension) {
          alert(
            `Invalid file type. Allowed types: ${allowedExtensions.join(", ")}`,
          );
          e.target.value = null;
          return;
        }
      }

      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <div
        className={`tint-container fixed inset-0 bg-black/50 ${openingFrom !== "AssignmentModal" ? "z-120" : "z-50"} `}
      ></div>
      <section
        className={`assignment-resource-modal absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white w-[70%] md:w-[25%] h-[260px] rounded-lg ${openingFrom !== "AssignmentModal" ? "z-120" : "z-50"} `}
      >
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

        {selectedAttachmentOption == "upload" ? (
          <div className="file-input-container mx-4 mt-4">
            {selectedFile ? (
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="bg-blue-100 p-2 rounded text-blue-600">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 text-gray-500 hover:bg-gray-200 rounded-full transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="rounded-lg w-full h-[80px] relative">
                  <input
                    type="file"
                    className="opacity-0 absolute top-0 right-0 bottom-0 left-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                  />
                  <div className="image-contaienr text-center border-2 border-dashed py-4 border-gray-400">
                    <Upload className="w-6 h-6 text-gray-600 mx-auto" />
                    <h1 className="mt-1 text-sm text-gray-800 cursor-pointer hover:text-black">
                      Upload files here
                    </h1>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 justify-center">
                  <AlertCircle className="w-3 h-3" />
                  <span>Maximum file size: 5MB</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="main-container mx-4 mt-4">
            <input
              type="text"
              placeholder={
                selectedAttachmentOption === "youtube link"
                  ? "Enter YouTube link"
                  : "Enter the link"
              }
              className="px-4 py-4 rounded border w-full border-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-[#08384F]"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}

        <div className="footer-btn absolute bottom-0 w-full flex justify-end gap-2 p-4">
          <button
            onClick={() => setSelectedAttachmentOption(null)}
            className="px-4 py-2 rounded cursor-pointer bg-[#D9D9D9] text-sm text-black hover:opacity-90"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 cursor-pointer rounded bg-[#08384F] text-sm text-white hover:opacity-90"
          >
            {selectedAttachmentOption === "upload" ? "Upload" : "Add Link"}
          </button>
        </div>
      </section>
    </>
  );
};

export default AssignmentResourceModal;
