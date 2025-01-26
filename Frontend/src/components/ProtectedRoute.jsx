// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedUserType }) => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedUserType && userType !== allowedUserType) {
        return <Navigate to={`/${userType}/dashboard`} replace />;
    }

    return children;
};

export default ProtectedRoute;