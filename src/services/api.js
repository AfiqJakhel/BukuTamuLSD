// API Configuration
const BASE_URL = 'http://localhost:8000/api';

export const fetchVisitors = async () => {
    try {
        const response = await fetch(`${BASE_URL}/visitors`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching visitors:', error);
        return [];
    }
};
