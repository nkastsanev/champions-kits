import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useAuth = (authToken, navigate, logout) => {
    useEffect(() => {
        if (!authToken) return;

            try {
                const { exp } = jwtDecode(authToken);
                const currentTime = Date.now() / 1000;

                if (exp < currentTime) {
                    logout();
                    navigate('/');
                    return;
                }

            // Checking on every 30 seconds if the token is valid
            
                const intervalId = setInterval(() => {
                    const { exp } = jwtDecode(authToken);

                    if (exp < Date.now() / 1000) {
                        logout();
                        navigate('/');
                        clearInterval(intervalId);
                    }
                }, 30000);

                return () => clearInterval(intervalId);

            } catch (error) {
                console.error('Invalid token:', error);
                logout();
                navigate('/');
            }

    }, [authToken, navigate, logout]);

};

export default useAuth;