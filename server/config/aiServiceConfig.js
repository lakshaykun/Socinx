import { config } from './config.js';
import axios from 'axios';

let lastHealthCheck = 0;
let lastHealthStatus = false;
const HEALTH_TTL = 30000; // 30 seconds


const healthCheck = async () => {
    const now = Date.now();

    // Return cached result if still valid
    if (now - lastHealthCheck < HEALTH_TTL) {
        return lastHealthStatus;
    }

    const maxAttempts = 5;
    const baseDelay = 2000;
    const maxDelay = 30000;

    lastHealthCheck = now;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await axios.get(
                `${config.AI_SERVICE_URL}/health`,
                { timeout: 5000 }
            );

            if (response.status === 200) {
                lastHealthStatus = true;
                return true;
            }
        } catch {
            const delay = Math.min(baseDelay * 2 ** (attempt - 1), maxDelay);
            if (attempt < maxAttempts) {
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }

    lastHealthStatus = false;
    return false;
};


const getEmbedding = async (text) => {
    const healthy = await healthCheck();
    if (!healthy) return null;

    try {
        const response = await axios.post(
            `${config.AI_SERVICE_URL}/embed/text`,
            { text },
            { timeout: 10000 }
        );

        return response.data.embedding;
    } catch (error) {
        console.error('Error fetching embedding:', error.message);
        return null;
    }
};


const getImageCaption = async (imageUrl) => {
    const healthy = await healthCheck();
    if (!healthy) return null;

    try {
        const response = await axios.post(
            `${config.AI_SERVICE_URL}/caption/image`,
            { imageUrl },
            { timeout: 15000 }
        );

        return response.data.caption;
    } catch (error) {
        console.error('Error fetching image caption:', error.message);
        return null;
    }
};

export { getEmbedding, getImageCaption };