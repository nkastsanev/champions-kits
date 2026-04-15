import { useUserContext } from "../contexts/UserContext";

const baseUrl = `http://localhost:5000/api/teams`;

export const useTeamApi = () => {
    const { authToken } = useUserContext();

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    });

    const getAll = async (categoryId, leagueId, page = 1) => {
        const params = new URLSearchParams();

        if (categoryId) params.append('categoryId', categoryId);
        if (leagueId) params.append('leagueId', leagueId);
        params.append('page', page);
        params.append('pageSize', 10);

        const response = await fetch(`${baseUrl}?${params.toString()}`);
        return response.json();
    };

    const create = async (leagueId, teamName) => {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ leagueId, teamName })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;
    };

    const update = async (id, leagueId, teamName) => {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ leagueId, teamName })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;
    };

    const remove = async (id) => {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (!response.ok) throw new Error('Failed to delete team');
    };

    return { getAll, create, update, remove };
};