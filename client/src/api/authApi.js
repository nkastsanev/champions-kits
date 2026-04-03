import { useUserContext } from "../contexts/UserContext";

const baseUrl = `http://localhost:5000/api/auth`;

export const useLogin = () => {
    const { login } = useUserContext();

    const loginUser = async (email, password) => {
        try {
            const response = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

           const { user, token } = result;

            login(user, token);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }

    };

    return { loginUser };
}

export const useRegister = () => {

    const register = async (firstName, lastName, email, password) => {
        try {
            const response = await fetch(`${baseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return { register };
};

export const useLogout = () => {
    const { logout } = useUserContext();

    const logoutUser = () => {
        logout();
    }

    return { logoutUser };
}