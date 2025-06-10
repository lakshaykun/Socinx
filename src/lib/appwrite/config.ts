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
    .setDevKey('576ae1e34a0247aedc1171f281e267aac6b58a0c8f56bedbc8b6ab2dc0fa22295216abc6974b9b20adfdcd5a57f49a8c48fe7c0badfe201cd0014746dcb0e6841e621ae336ea30b290ef3ef833eb9965535f985e0626ae4b66f325b093334b1ebbd099874eadc4faaefeb0d071d3f5a6a2c4263ecae6bf1143ea5c56265ddf51');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);