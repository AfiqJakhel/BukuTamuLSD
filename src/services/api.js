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

export const checkServerStatus = async () => {
    try {
        // We'll hit a new /status endpoint or just the /visitors endpoint as a heartbeat
        const response = await fetch(`${BASE_URL}/status`, {
            method: 'GET',
            // Small timeout to not hang too long if server is actually dead
            signal: AbortSignal.timeout(2000)
        });
        return response.ok;
    } catch (error) {
        return false;
    }
};

export const submitVisitor = async (visitorData) => {
    try {
        const response = await fetch(`${BASE_URL}/visitors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitorData),
        });

        if (!response.ok) {
            throw new Error('Gagal menyimpan data pengunjung');
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting visitor:', error);
        throw error;
    }
};
