import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import AdminDashboard from '../pages/adminDashboard';


const DashboardRoute = () => {
    const token = localStorage.getItem("LmsToken");
    const location = useLocation();

    // ❌ Not logged in
    if (!token) {
        return <Navigate to="/" replace state={{ redirectTo: location.pathname }} />
    }

    const decoded = jwt_decode(token);

    // ✅ Role-based rendering
    if (decoded.role === "admin") {
        return <AdminDashboard />;
    }
    // } else if (decoded.role === "faculty") {
    //     return <FacultyDashboardPage />;
    // } else {
    //     // Optional: fallback for unknown roles
    //     return <Navigate to="/" replace />;
    // }
}

export default DashboardRoute;