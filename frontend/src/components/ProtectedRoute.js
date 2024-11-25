import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element }) {
    const isLoggedIn = !!localStorage.getItem('authToken');
    return isLoggedIn ? element : < Navigate to = "/login" / > ;
}

export default ProtectedRoute;