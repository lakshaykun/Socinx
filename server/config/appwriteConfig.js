import { Client, TablesDB, Query } from "node-appwrite";
import { config } from "./config.js";

const client = new Client()
  .setEndpoint(config.APPWRITE_ENDPOINT)
  .setProject(config.APPWRITE_PROJECT_ID)
  .setKey(config.APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);

export const updatePostAppwrite = async (postID, data) => {
  try {
    const response = await tablesDB.updateRows(
        config.APPWRITE_DATABASE_ID,
        config.APPWRITE_POSTS_COLLECTION_ID,
        postID,
        data
    );

    return response;
  } catch (e) {
    console.error("Error updating post:", e);
    throw e;
  }
};


export const getPostAppwrite = async (postID) => {
  try {
    const response = await tablesDB.getRow(
      config.APPWRITE_DATABASE_ID,
      config.APPWRITE_POSTS_COLLECTION_ID,
      postID
    );

    return response;
  } catch (e) {
    console.error("Error fetching post:", e);
    throw e;
  }
};


// get complete user details for embedding (with expanded relations)
export const getUserAppwrite = async (userID) => {
    try {
        const response = await tablesDB.getRow(
            config.APPWRITE_DATABASE_ID,
            config.APPWRITE_USERS_COLLECTION_ID,
            userID,
            [
                // Expand related documents
                Query.select([
                    "*",          // all user fields
                    "posts.$id",  // fetch post IDs
                    "save.*",     // fully expand saved posts
                    "liked.$id"   // fetch liked post IDs
                ])
            ]
        );

        return response;
    } catch (e) {
        console.error("Error fetching user:", e);
        throw e;
    }
};
