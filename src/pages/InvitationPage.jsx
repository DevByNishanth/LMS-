import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import banner from "../assets/popup-banner.svg"
import textIcon from '../assets/textIcon.svg'

const InvitationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleAcceptInvitation = () => {
        const token = localStorage.getItem('LmsToken');
        if (!token) {
            // Redirect to login page and pass the current location to redirect back after login
            navigate('/', { state: { redirectTo: location.pathname + location.search } });
        } else {
            // Logic to send payload to backend
            console.log("Token found. Sending payload to backend...");
            // TODO: Add API call to join classroom here
        }
    }

    return (
        <>

            <div className="w-full bg-white rounded-xl p-2 md:w-[35%]  h-[500px] absolute top-1/2 left-[50%] transform -translate-x-1/2 translate-y-[-50%]">
                {/* banner image  */}
                <div className="img-container "><img src={banner} className=" object-cover h-full w-full" /></div>

                {/* text content  */}
                <div className="text-container  mt-6 text-center">
                    <h1 className="text-2xl font-medium flex items-center gap-2 justify-center"><span><img src={textIcon} className="w-8 h-8" /></span> You’re In!</h1>
                    <p className="text-gray-500 mt-2">You’ve been hand-picked to join this classroom - <span className='font-medium text-[#0B56A4]'>Java Programming</span>. Hit the button below and let the learning begin.</p>
                    <button onClick={handleAcceptInvitation} className="bg-[#0B56A4] cursor-pointer hover:bg-[#0B56A4]/80 text-white px-4 py-2 rounded mt-4">Accept Invitation</button>
                </div>
            </div>
        </>
    )
}

export default InvitationPage