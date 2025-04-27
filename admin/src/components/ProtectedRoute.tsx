import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/store';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const { user } = useAppSelector((state) => state.adminAuth);

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/admin/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;