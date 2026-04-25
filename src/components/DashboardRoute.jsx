// import React, { Children } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import StudentDashboardPage from '../pages/StudentDashboardPage';
import HodDashboard from '../pages/HodDashboard';
import FacultyDashboard from '../pages/FacultyDashboard';
import AdminDashboard from '../pages/AdminDashboard';


const DashboardRoute = ({ children }) => {
    const token = localStorage.getItem("LmsToken");
    const location = useLocation();

    // ❌ Not logged in
    if (!token) {
        return <Navigate to="/" replace state={{ redirectTo: location.pathname }} />
    }

    const decoded = jwtDecode(token);

    // ✅ Role-based rendering
    if (decoded.role === "admin") {
        return <AdminDashboard />;
    } else if (decoded.role.toLowerCase() === "hod") {
        return <HodDashboard />;
    } else if (decoded.role === "student") {
        return <StudentDashboardPage />;
    } else if (decoded.role === "faculty") {
        return <FacultyDashboard />;
    } else {
        return <Navigate to="/" replace />;
    }
}

export default DashboardRoute;