import React, { useEffect, useRef } from "react";
import manImg from "../assets/man.svg";
import { Badge, Bluetooth, Briefcase, Building2, Calendar1Icon, Clock, IdCardLanyard, Key, UserCog } from "lucide-react";
const DetailViewCanvas = ({ setIsDetailCanvas, canvasData }) => {

  console.log("Detail view data : ", canvasData)

  // ref's
  const canvasRef = useRef(null);

  // useEffect's
  useEffect(() => {
    function handleOutsideClick(e) {
      if (canvasRef.current && !canvasRef.current.contains(e.target)) {
        setIsDetailCanvas(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-50"></div>
      <section
        ref={canvasRef}
        className="w-[45%] bg-white h-[100vh] z-[60] fixed right-0 top-0 shadow-xl transition-all duration-300 overflow-y-auto"
      >
        <div className="content-container mt-4 px-3 ">
          <div className="header flex gap-2">
            <div className="img-container w-[30%] h-[190px] rounded-lg ">
              {canvasData?.profileImg ? <img
                src={manImg}
                className="h-full w-full object-cover rounded-lg"
              /> : <div className="border border-gray-200 bg-[#ded9f9] rounded-lg h-full w-full flex items-center justify-center">
                <p className="text-3xl">{canvasData.firstName.slice(0, 1)}</p>
              </div>}
            </div>
            <div className="personal-details-container bg-gray-50 border border-gray-200 rounded-md p-2 h-[190px] w-[70%]">
              {/* <h1 className="font-medium">Personal Information</h1> */}
              <table className="text-[12px]">
                <tr>
                  <td className="text-gray-800 w-[100px] ">First Name</td>
                  <td className="text-gray-600 w-[200px]">{canvasData?.firstName}</td>
                </tr>
                <tr>
                  <td className="text-gray-800 w-[100px] pt-2">Last Name</td>
                  <td className="text-gray-600 w-[200px] pt-2">{canvasData?.lastName}</td>
                </tr>
                <tr>
                  <td className="text-gray-800 w-[100px] pt-2">Email</td>
                  <td className="text-gray-600 w-[200px] overflow-hidden pt-2">
                    {canvasData?.email}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-800 w-[100px] pt-2">
                    Qualification
                  </td>
                  <td className="text-gray-600 w-[200px] overflow-hidden pt-2">
                    {canvasData?.qualification}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-800 w-[100px] pt-2">
                    Date of birth
                  </td>
                  <td className="text-gray-600 w-[200px] pt-2">
                    {canvasData?.dateOfBirth || "20-11-2003"}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-800 w-[100px] pt-2">Gender</td>
                  <td className="text-gray-600 w-[200px] pt-2">{canvasData?.gender}</td>
                </tr>
                <tr>
                  <td className="text-gray-800 w-[100px] pt-2">Phone</td>
                  <td className="text-gray-600 w-[200px] pt-2">{canvasData?.mobileNumber}</td>
                </tr>
              </table>
            </div>
          </div>
          <div className="employe-details-container mt-4">
            <h1 className="font-medium text-lg text-[#333333]">
              Employee Details
            </h1>
            <div className="container-1 mt-4 grid grid-cols-3 gap-x-12 gap-y-6 px-4">
              <div className="detail">
                <div className="heading flex items-center gap-2">
                  <IdCardLanyard className="text-violet-900 w-5 h-5" />
                  <h1 className="text-black">Employee Id</h1>
                </div>
                <h1 className="mt-1 text-gray-500 ">{canvasData.employeeId}</h1>
              </div>
              <div className="detail">
                <div className="heading flex items-center gap-2">
                  <Briefcase className="text-violet-900 w-5 h-5" />
                  <h1 className="text-black">Designation</h1>
                </div>
                <h1 className="mt-1 text-gray-500 ">{canvasData.designation}</h1>
              </div>
              <div className="detail">
                <div className="heading flex items-center gap-2">
                  <Building2 className="text-violet-900 w-5 h-5" />
                  <h1 className="text-black">Department</h1>
                </div>
                <h1 className="mt-1 text-gray-500 ">{canvasData.department}</h1>
              </div>
              <div className="detail whitespace-nowrap">
                <div className="heading flex items-center gap-2">
                  <UserCog className="text-violet-900 w-5 h-5 flex-shrink-0" />
                  <h1 className="text-black">Reporting Manager</h1>
                </div>
                <h1 className="mt-1 text-gray-500 ">{canvasData?.reportingManager}</h1>
              </div>
              <div className="detail whitespace-nowrap">
                <div className="heading flex items-center gap-2">
                  <Calendar1Icon className="text-violet-900 w-5 h-5 flex-shrink-0" />
                  <h1 className="text-black">Joining Date</h1>
                </div>
                <h1 className="mt-1 text-gray-500 ">{canvasData?.joiningDate || "11-10-2022"}</h1>
              </div>
              <div className="detail whitespace-nowrap">
                <div className="heading flex items-center gap-2">
                  <Clock className="text-violet-900 w-5 h-5 flex-shrink-0" />
                  <h1 className="text-black">Notice Period</h1>
                </div>
                <h1 className="mt-1 text-gray-500 ">{canvasData?.noticePeriod}</h1>
              </div>
              <div className="detail whitespace-nowrap">
                <div className="heading flex items-center gap-2">
                  <Clock className="text-violet-900 w-5 h-5 flex-shrink-0" />
                  <h1 className="text-black">Notice Period</h1>
                </div>
                <h1 className="mt-1 text-gray-500 ">{canvasData?.noticePeriod}</h1>
              </div>
              <div className="detail whitespace-nowrap">
                <div className="heading flex items-center gap-2">
                  <Key className="text-violet-900 w-5 h-5 flex-shrink-0" />
                  <h1 className="text-black">Role</h1>
                </div>
                <h1 className="mt-1 text-gray-500 ">{canvasData?.role}</h1>
              </div>
              <div className="detail whitespace-nowrap">
                <div className="heading flex items-center gap-2">
                  <Badge className="text-violet-900 w-5 h-5 flex-shrink-0" />
                  <h1 className="text-black">Job Title</h1>
                </div>
                <h1 className="mt-1 text-gray-500 ">{canvasData?.jobTitle}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailViewCanvas;
