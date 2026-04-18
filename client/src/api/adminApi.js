import { useUserContext } from "../contexts/UserContext";

const baseUrl = `http://localhost:5000/api/admin`;

export const useAdminApi = () => {
    const { authToken } = useUserContext();

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    });

    
    const getDashboardDetails = async () => {

        const response = await fetch(`${baseUrl}/dashboard`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;

    }

    const getProductsDetails = async () => {

        const response = await fetch(`${baseUrl}/products`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!response.ok) throw new Error (result.message);
        return result;

    }

    const getOrdersDetails = async () => {

        const response = await fetch(`${baseUrl}/orders`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!response.ok) throw new Error (result.message);
        return result;
    }

    const getUsersDetails = async () => {

        const response = await fetch(`${baseUrl}/users`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!response.ok) throw new Error (result.message);
        return result;
    }

    const getCatalogDetails = async () => {

        const response = await fetch(`${baseUrl}/catalog`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!response.ok) throw new Error (result.message);
        return result
    }

    return { getDashboardDetails, getProductsDetails, getOrdersDetails, getUsersDetails, getCatalogDetails };
};