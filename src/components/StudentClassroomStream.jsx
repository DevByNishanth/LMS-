import classRoombanner1 from "../assets/classRoombanner1.svg";
import copyIcon from "../assets/copyIcon.svg";
import commentIcon from "../assets/commentIcon.svg";
import fileIcon from "../assets/file-icon.svg";

const StudentClassroomStream = () => {
  return (
    <>
      <section className="w-full h-full">
        <div className="w-full h-full rounded-t-xl border border-gray-200 bg-white">
          <div className="h-[30%] relative">
            <div className="w-full relative h-full">
              <img
                src={classRoombanner1}
                className="transform rounded-t-xl scale-x-[-1] h-full w-full object-cover"
              />
              <div className="absolute rounded-t-xl inset-0 bg-black/10"></div>
            </div>
            <div className="absolute top-4 left-6">
              <h1 className="font-medium text-xl text-black">
                Subject Name
              </h1>
              <h1 className="mt-2 text-lg text-black">
                Class Name
              </h1>
            </div>
            <div className="absolute bottom-2 left-6">
              <h1 className="font-medium text-md text-[#333333] flex items-center gap-3">
                <p className="bg-white w-7 h-7 rounded-full text-[#08384f] flex items-center justify-center">
                  T
                </p>
                Teacher Name
              </h1>
            </div>
          </div>

          <div className="w-full max-h-[64%] overflow-y-auto px-4 mt-4">
            <div className="flex items-center justify-between sticky top-0 z-20 bg-white py-2">
              <h1 className="flex items-center gap-2 font-medium">
                Class Code :
                <span className="flex items-center text-[#0B56A4] gap-2">
                  ABC123XYZ
                  <img src={copyIcon} className="w-6 h-6 cursor-pointer" />
                </span>
              </h1>
            </div>

            <div className="mt-4 space-y-4 pb-6">
              <div className="w-full bg-white border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <p className="bg-[#08384F] text-white w-10 h-10 flex items-center justify-center rounded-full">
                      T
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Teacher Name
                      </p>
                      <p className="text-xs text-gray-500">
                        Posted on 23 Mar 2026 at 10:30 AM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-700">
                    Welcome to the classroom! Check the classwork tab for assignments and materials.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <img src={commentIcon} className="w-4" />
                    Comments
                  </div>
                </div>
              </div>

              <div className="w-full bg-white border border-gray-200 rounded-md p-4">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600">
                    <p className="text-white text-xs font-bold">Q</p>
                  </div>
                  <p className="text-sm font-medium">
                    Posted a Quiz : Sample Quiz
                  </p>
                </div>
              </div>

              <div className="w-full bg-white border border-gray-200 rounded-md p-4">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600">
                    <p className="text-white text-xs font-bold">A</p>
                  </div>
                  <p className="text-sm font-medium">
                    Posted a Assignment work : Sample Assignment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudentClassroomStream;
