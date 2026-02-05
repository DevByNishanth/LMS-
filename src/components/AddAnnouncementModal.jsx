import { X } from "lucide-react";
import React, { useState } from "react";
import { Paperclip, Link, Youtube, Plus, Upload } from "lucide-react";
import AssignmentResourceModal from "./AssignmentResourceModal";
import axios from "axios";
import { useParams } from "react-router-dom";

const AddAnnouncementModal = ({ setIsAnnouncementModal }) => {
  // States
  const [selectedAttachmentOption, setSelectedAttachmentOption] =
    useState(null);
  const [openingFrom, setOpeningFrom] = useState("AnnouncementModal");

  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [file, setFile] = useState(null);
  const { classId } = useParams(); // Using classId from URL params as subjectId
  const token = localStorage.getItem("LmsToken");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleAttachmentSubmit = (data) => {
    // data structure: { type: "link" | "youtube link" | "upload", value: ... }
    const { type, value } = data;

    if (type === "link") {
      setLink(value);
    } else if (type === "youtube link") {
      setYoutubeLink(value);
    } else if (type === "upload") {
      setFile(value);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("subjectId", classId);
      formData.append("message", message);
      formData.append("link", link);
      formData.append("youtubeLink", youtubeLink);

      if (file) {
        formData.append("attachments", file);
      }

      console.log("Submitting announcement payload (FormData)");

      const response = await axios.post(`${apiUrl}api/staff/stream`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type is left to axios to set multipart/form-data with boundary
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Announcement posted successfully!");
        setIsAnnouncementModal(false);
        // Optionally refresh parent Data here if a callback was provided
        window.location.reload(); // Simple reload to show new data for now
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
      alert("Failed to post announcement.");
    }
  };

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
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-gray-600 rounded outline-none focus:border-gray-700 p-2 w-full min-h-[140px] max-h-40 "
            placeholder="Announce something to your class"
          ></textarea>

          {/* Show attached links if any */}
          {(link || youtubeLink || file) && (
            <div className="mt-2 text-sm text-black space-y-2">
              {link && (
                <div className="flex items-center gap-1">
                  <Link className="w-3 h-3 " />  <span > Link Attached :</span> <span className="text-blue-600">{link}</span>
                </div>
              )}
              {youtubeLink && (
                <div className="flex items-center gap-1">
                  <Youtube className="w-3 h-3" />  <span > Youtube :</span> <span className="text-blue-600">{youtubeLink}</span>
                </div>
              )}
              {file && (
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="bg-blue-100 p-2 rounded text-blue-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
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
              )}
            </div>
          )}

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
            onClick={handleSubmit}
            className="px-4 py-2 cursor-pointer rounded bg-[#0B56A4] text-white hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div >

      {/* modals  */}
      {
        selectedAttachmentOption && (
          <AssignmentResourceModal
            selectedAttachmentOption={selectedAttachmentOption}
            setSelectedAttachmentOption={setSelectedAttachmentOption}
            openingFrom={openingFrom}
            setOpeningFrom={setOpeningFrom}
            onSubmit={handleAttachmentSubmit}
          />
        )
      }
    </>
  );
};

export default AddAnnouncementModal;
