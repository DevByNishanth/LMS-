import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import AdminDashboard from "./AdminDashboard";
import HodDashboard from "./HodDashboard";
import FacultyDashboard from "./FacultyDashboard";

const Dashboard = () => {
    const [role, setRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("LmsToken");
        if (token) {
            const decoded = jwtDecode(token);
            setRole(decoded.role);
        }
    }, []);

    if (!role) return null;

    return (
        <>
            {role === "admin" && <AdminDashboard />}
            {role === "hod" && <HodDashboard />}
            {role === "faculty" && <FacultyDashboard />}
        </>
    );
};

export default Dashboard;
