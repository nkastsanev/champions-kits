import { useUserContext } from "../contexts/UserContext";

const baseUrl = `http://localhost:5000/api/categories`;

export const useCategoryApi = () => {
    const { authToken } = useUserContext();

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    });

    const getAll = async () => {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
    };

    const getAllSimple = async () => {
        const response = await fetch(`${baseUrl}/simple`)
        if (!response.ok) throw new Error('Failed to fetch categories')
        return response.json();
    }

    const create = async (name) => {

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ name })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;
    };

    const update = async (id, name) => {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ name })
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;
    }

    const remove = async (id) => {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete category');
        return true;
    };

    return { getAll, getAllSimple, create, update, remove}
}