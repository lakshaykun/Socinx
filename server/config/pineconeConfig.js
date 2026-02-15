import { Pinecone } from '@pinecone-database/pinecone';
import { config } from "./config.js";

const pc = new Pinecone({
    apiKey: config.PINECONE_API_KEY,
});

const postsIndex = pc.index("posts");
const usersIndex = pc.index("users");

export const getPostsIndex = () => postsIndex;
export const getUsersIndex = () => usersIndex;

export const upsertPostEmbedding = async (docID, embedding, tags = []) => {
  try {
    if (!docID || !embedding) {
      throw new Error("docID and embedding are required");
    }
  
    const response = await postsIndex.upsert({
      vectors: [
        {
          id: docID,
          values: embedding,
          metadata: {
            tags
          }
        }
      ]
    });
  
    return response;
  } catch (error) {
    console.error("Error upserting post embedding:", error);
    throw new Error("Failed to upsert post embedding");
  }
};

export const upsertUserEmbedding = async (userID, embedding) => {
  try {
    if (!userID || !embedding) {
      throw new Error("userID and embedding are required");
    }

    const response = await usersIndex.upsert({
      vectors: [
        {
          id: userID,
          values: embedding
        }
      ]
    });

    return response;
  } catch (error) {
    console.error("Error upserting user embedding:", error);
    throw new Error("Failed to upsert user embedding");
  }
};

export const getUserEmbedding = async (userID) => {
  try {
    if (!userID) throw new Error("userID is required");

    const response = await usersIndex.fetch([userID]);

    if (!response || !response.vectors || !response.vectors[userID]) {
      return null; // cold start user
    }

    return response.vectors[userID].values;
  } catch (error) {
    console.error("Error fetching user embedding:", error);
    throw new Error("Failed to fetch user embedding");
  }
};

export const getPostsPinecone = async (vector, filter={}, k=config.top_k, includeMetadata=true, includeValues=true) => {
  try {
    if (!vector) throw new Error("vector is required");

    const response = await postsIndex.query({
      vector: vector,
      top_k: k,
      filter: filter,
      includeMetadata: includeMetadata,
      includeValues: includeValues
    });

    return response.matches;  // array of posts
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
};