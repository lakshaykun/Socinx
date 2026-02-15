require('dotenv').config();

export const config = {
    PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',
    PORT: process.env.PORT || 3000,
    AI_SERVICE_URL: process.env.AI_SERVICE_URL || '',
    APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT || '',
    APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID || '',
    APPWRITE_API_KEY: process.env.APPWRITE_API_KEY || '',
    APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID || '',
    APPWRITE_POSTS_COLLECTION_ID: process.env.APPWRITE_POSTS_COLLECTION_ID || '',
    APPWRITE_USERS_COLLECTION_ID: process.env.APPWRITE_USERS_COLLECTION_ID || '',
    top_k: 20,
}