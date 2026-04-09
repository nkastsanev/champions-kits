import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

export default function AdminGuard() {
    const { user } = useUserContext();
    const isAdmin = user && (user?.Role === 1 || user?.Role === 2);
    

    return isAdmin ? <Outlet /> : <Navigate to={'/'} replace />
}