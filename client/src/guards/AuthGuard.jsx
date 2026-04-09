import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

export default function AuthGuard() {
    const { authToken } = useUserContext();
    const location = useLocation();

    if (authToken) {
        return <Outlet />;
    }

    return <Navigate to={"/"} state={{from: location, triggerAuth: true}} replace />
}