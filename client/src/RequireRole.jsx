import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from './api';
import { getRoleFromToken } from './auth';

export default function RequireRole({ role, children }) {
    const token = getToken();
    const loc = useLocation();
    const userRole = getRoleFromToken();

    if (!token) return <Navigate to="/select-role" replace state={{ from: loc }} />;
    if (role && userRole !== role) {
        const fallback = userRole === 'admin' ? '/admin'
            : userRole === 'faculty' ? '/faculty'
                : '/student';
        return <Navigate to={fallback} replace />;
    }
    return children;
}
