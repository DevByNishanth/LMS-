import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("LmsToken")
    const location = useLocation();
    if (!token) {
        return <Navigate to="/" replace state={{ redirectTo: location.pathname }} />
    }
    return children;
}

export default ProtectedRoute
