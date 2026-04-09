import { useUserContext } from "../contexts/UserContext";

const baseUrl = `http://localhost:5000/api/leagues`;

export const useLeagueApi = () => {
    const { authToken } = useUserContext();

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    });

    const getAll = async () => {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Failed to fetch leagues');
        return response.json();
    };

    const create = async (categoryId, leagueName) => {

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ categoryId, name: leagueName })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;
    };

    const update = async (id, leagueName, categoryId) => {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ name: leagueName, categoryId })
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
        if (!response.ok) throw new Error('Failed to delete league');
        return true;
    };

    return { getAll, create, update, remove}
}