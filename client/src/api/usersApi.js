import { useUserContext } from "../contexts/UserContext";

const baseUrl = 'http://localhost:5000/api/auth';

export const useUsersApi = () => {
    const { authToken } = useUserContext();

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    });

    const getAll = async (search, role, page = 1) => {
        const params = new URLSearchParams();

        if (search) params.append('search', search);
        if (role) params.append('role', role);

        params.append('page', page);
        params.append('pageSize', 10);

        const res = await fetch(`${baseUrl}?${params}`);
        if (!res.ok) throw new Error('Failed to fetch users');

        return res.json();
    };

    const updateRole = async (id, role) => {
        const res = await fetch(`${baseUrl}/${id}/role`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ role })
        });

        if (!res.ok) throw new Error('Failed to update role');
    };

    return { getAll, updateRole };
};