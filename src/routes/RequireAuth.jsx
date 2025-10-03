import React from 'react'
import { getToken } from '../lib/api'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuth = () => {
    const token = getToken();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default RequireAuth