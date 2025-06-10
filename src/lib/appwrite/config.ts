import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

export const appwriteConfig = {
    projectID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
    databaseID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageID: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    usersCollectionID: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    postsCollectionID: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
    savesCollectionID: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
    commentsCollectionID: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,
}


export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectID)
    
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);