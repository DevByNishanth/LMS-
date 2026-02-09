import React from "react";
import { Plus } from "lucide-react";
import classRoombanner1 from "../assets/classRoombanner1.svg";
import profileImg from "../assets/profileImg.svg";
import copyIcon from "../assets/copyIcon.svg";
import postBadge from "../assets/postBadge.svg";

const Student_ClassRoomStreamComponent = () => {
  return (
    <>
      <section className="w-full h-full">
        <div className="w-full h-full rounded-t-xl border border-gray-200 bg-white overflow-hidden flex flex-col">
          <div className="top-banner-section h-[180px] relative shrink-0">
            <div className="img-container w-full relative h-full">
              <img
                src={classRoombanner1}
                className="transform scale-x-[-1] h-full w-full object-cover"
                alt="Class Banner"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <div className="content-container absolute top-4 left-6">
              <h1 className="font-medium text-xl text-black">III_CSE _ A</h1>
              <h1 className="font-normal mt-2 text-lg text-black">
                Crypto and Encryption
              </h1>
            </div>
            <div className="profile-container absolute bottom-4 left-6">
              <h1 className="font-medium text-md text-[#333333] flex items-center gap-3">
                <span>
                  <img
                    src={profileImg}
                    className="w-8 h-8 rounded-full"
                    alt="Profile"
                  />
                </span>
                Surya Chandran
              </h1>
            </div>
          </div>

          <div className="post-container w-full flex-1 overflow-y-auto px-6 mt-4 pb-6">
            <div className="header flex items-center justify-between border-b pb-3 mb-4">
              <h1 className="flex items-center gap-2 font-medium text-gray-700">
                Class Code :
                <span className="flex items-center text-[#0B56A4] gap-2 font-semibold">
                  7K8H8K
                  <img
                    src={copyIcon}
                    className="w-5 h-5 cursor-pointer hover:opacity-70"
                    alt="Copy"
                  />
                </span>
              </h1>
            </div>

            <div className="mt-2 space-y-4">
              <div className="flex items-center justify-between bg-[#F9F9F9] border border-gray-200 rounded-lg px-4 py-3 max-w-full">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0B56A4]">
                    <img src={postBadge} className="w-4 h-4" alt="Post Icon" />
                  </div>
                  <p className="text-md font-medium text-black">
                    Posted a Assignment work : Sample
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500">
                    Posted on 30/1/2026 at 11:42AM
                  </p>
                  <div className="cursor-pointer text-gray-500 p-1">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={profileImg}
                        className="w-10 h-10 rounded-full"
                        alt="User"
                      />
                      <div>
                        <h4 className="font-bold text-gray-800">
                          Surya Chandran
                        </h4>
                        <p className="text-xs text-gray-400">
                          Posted on 30/1/2026 at 11:42AM
                        </p>
                      </div>
                    </div>
                    <div className="cursor-pointer text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Sample description about the assignment of the subject
                  </p>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:text-gray-700">
                  <Plus size={16} />
                  <span>Comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Student_ClassRoomStreamComponent;
