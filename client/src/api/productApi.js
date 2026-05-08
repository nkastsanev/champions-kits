import { useUserContext } from "../contexts/UserContext";

const baseUrl = `http://localhost:5000/api/products`;

export const useProductsApi = () => {
    const { authToken } = useUserContext();

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    });

    const getSizes = async () => {
        const response = await fetch(`${baseUrl}/sizes`, {
            headers: getHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch sizes');
        }

        return data;
    };

    const getAll = async (
        search,
        categoryId,
        leagueId,
        teamId,
        page = 1
    ) => {

        const params = new URLSearchParams();

        if (search?.trim()) {
            params.append('search', search.trim());
        }

        if (categoryId) {
            params.append('categoryId', categoryId);
        }

        if (leagueId) {
            params.append('leagueId', leagueId);
        }

        if (teamId) {
            params.append('teamId', teamId);
        }

        params.append('page', page);

        params.append('pageSize', 10);

        const response = await fetch(`${baseUrl}?${params.toString()}`);

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        return response.json();
    };

    const create = async (data) => {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                categoryId: data.categoryId,
                leagueId: data.leagueId,
                teamId: data.teamId,
                productName: data.productName,
                description: data.description,
                price: data.price,
                images: data.images,
                productSizes: data.productSizes,
            })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;
    };

    const update = async (productId, data) => {
        const response = await fetch(`${baseUrl}/${productId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                categoryId: data.categoryId,
                leagueId: data.leagueId,
                teamId: data.teamId,
                productName: data.productName,
                description: data.description,
                price: data.price,
                images: data.images,
                sizes: data.productSizes,
            })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;
    };

    const deleteProduct = async (productId) => {
        const response = await fetch(`${baseUrl}/${productId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;
    };

    return { getSizes, getAll, create, update, deleteProduct };

}