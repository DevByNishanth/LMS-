import React, { useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import banner from "../assets/popup-banner.svg"
import textIcon from '../assets/textIcon.svg'
import axios from 'axios';

const InvitationPage = () => {
    // Auth 
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('LmsToken');
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams()
    const verificationToken = searchParams.get("token")
    console.log(verificationToken)

    useEffect(() => {
        if (!token) {
            navigate("/", {
                state: { redirectTo: location.pathname + location.search },
            });
        }
    }, [token, navigate, location]);

    const handleAcceptInvitation = async () => {
        if (!token) {
            navigate("/", {
                state: { redirectTo: location.pathname + location.search },
            });
            return;
        }

        console.log("Token found. Sending payload to backend...");

        try {
            const res = await axios.post(
                `${apiUrl}api/classroom/invitations/respond`,
                { token: verificationToken, action: "accept" }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            console.log(res.data);
            if (res.status === 200 || res.status === 201) {
                navigate("/dashboard/classroom");
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleRejectInvitation = async () => {
        if (!token) {
            navigate("/", {
                state: { redirectTo: location.pathname + location.search },
            });
            return;
        }

        console.log("Token found. Sending payload to backend...");

        try {
            const res = await axios.post(
                `${apiUrl}api/classroom/invitations/respond`,
                { token: verificationToken, action: "reject" }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            console.log(res.data);
            if (res.status === 200 || res.status === 201) {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <>

            <div className="w-full bg-white rounded-xl p-2 md:w-[35%]  h-[500px] absolute top-1/2 left-[50%] transform -translate-x-1/2 translate-y-[-50%]">
                {/* banner image  */}
                <div className="img-container "><img src={banner} className=" object-cover h-full w-full" /></div>

                {/* text content  */}
                <div className="text-container  mt-6 text-center">
                    <h1 className="text-2xl font-medium flex items-center gap-2 justify-center"><span><img src={textIcon} className="w-8 h-8" /></span> You’re In!</h1>
                    <p className="text-gray-500 mt-2">You’ve been hand-picked to join this classroom. Hit the button below and let the learning begin.</p>
                    <div className="btn-container flex items-center gap-2 justify-center">
                        <button onClick={handleRejectInvitation} className="border border-gray-400 rounded cursor-pointer hover:bg-gray-100 text-gray-700 px-4 py-2 rounded mt-4">Reject Invitation</button>
                        <button onClick={handleAcceptInvitation} className="bg-[#0B56A4] cursor-pointer hover:bg-[#0B56A4]/80 text-white px-4 py-2 rounded mt-4">Accept Invitation</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InvitationPage