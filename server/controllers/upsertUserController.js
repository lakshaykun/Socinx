import { upsertUserEmbedding } from '../config/pineconeConfig.js';
import { getUserAppwrite } from '../config/appwriteConfig.js';
import { getEmbedding } from '../config/aiServiceConfig.js';

const upsertUserConfig = {
    fetchRecentPostsLimit: 5, // Number of recent posts to consider for embedding
    fetchSavedPostsLimit: 5,   // Number of saved posts to consider for embedding
    fetchLikedPostsLimit: 5   // Number of liked posts to consider for embedding
};

function buildEmbeddingText(user) {
    const parts = [];

    // Identity
    if (user?.name) {
        parts.push(`User name is ${user.name}.`);
    }

    if (user?.username) {
        parts.push(`Username is ${user.username}.`);
    }

    // Demographics
    if (user?.age !== undefined && user?.age !== null) {
        parts.push(`The user is ${user.age} years old.`);
    }

    if (user?.gender) {
        parts.push(`Gender: ${user.gender}.`);
    }

    // Bio (HIGH SIGNAL)
    if (user?.bio) {
        parts.push(`Bio: ${user.bio}.`);
    }

    // Interests (VERY HIGH SIGNAL)
    let interests = user?.interests;
    if (interests) {
        if (Array.isArray(interests)) {
            interests = interests.join(", ");
        }
        parts.push(`Interests include ${interests}.`);
    }

    return parts.join(" ");
}

// Average embeddings
function averageEmbeddings(embeddings) {
    if (!embeddings || embeddings.length === 0) return null;

    const dimension = embeddings[0].length;
    const avg = new Array(dimension).fill(0);

    for (const vector of embeddings) {
        for (let i = 0; i < dimension; i++) {
            avg[i] += vector[i];
        }
    }

    return avg.map(value => value / embeddings.length);
}

export const fetchRecentPosts = async (posts) => {
    if (!posts || posts.length === 0) return null;

    // Sort by recency
    const postsSorted = [...posts]
        .sort((a, b) => (b.$createdAt || 0) - (a.$createdAt || 0))
        .slice(0, upsertUserConfig.fetchRecentPostsLimit);

    const ids = postsSorted.map(post => post.$id);

    const response = await postIndex.fetch(ids);
    const vectors = response.vectors || {};

    const embeddings = ids
        .filter(id => vectors[id])
        .map(id => vectors[id].values);

    return averageEmbeddings(embeddings);
};

export const fetchLikedPosts = async (posts) => {
    if (!posts || posts.length === 0) return null;

    // Sort by recency
    const postsSorted = [...posts]
        .sort((a, b) => (b.$createdAt || 0) - (a.$createdAt || 0))
        .slice(0, upsertUserConfig.fetchLikedPostsLimit);

    const ids = postsSorted.map(post => post.$id);

    const response = await postIndex.fetch(ids);
    const vectors = response.vectors || {};

    const embeddings = ids
        .filter(id => vectors[id])
        .map(id => vectors[id].values);

    return averageEmbeddings(embeddings);
};

export const fetchSavePosts = async (saves) => {
    if (!saves || saves.length === 0) return null;

    const savesSorted = [...saves]
        .sort((a, b) => (b.$createdAt || 0) - (a.$createdAt || 0))
        .slice(0, upsertUserConfig.fetchSavedPostsLimit);

    const ids = savesSorted.map(save => save.post);

    const response = await postIndex.fetch(ids);
    const vectors = response.vectors || {};

    const embeddings = ids
        .filter(id => vectors[id])
        .map(id => vectors[id].values);

    return averageEmbeddings(embeddings);
};

export const fetchFollowingEmbedding = async (followings) => {
    if (!followings || followings.length === 0) return null;

    const response = await userIndex.fetch(followings);
    const vectors = response.vectors || {};

    const embeddings = followings
        .filter(id => vectors[id])
        .map(id => vectors[id].values);

    return averageEmbeddings(embeddings);
};



// creating and upserting user embedding in pinecone and updating user status and activity in appwrite
export default async (req, res) => {
    try {
        const userID = req.userID;
        if (!userID) {
            return res.status(400).json({ error: 'User is not authenticated' });
        }
        // Fetch complete user details with expanded relations
        const user = await getUserAppwrite(userID);

        // Build embedding text from user details
        const embeddingText = buildEmbeddingText(user);

        // Get embedding vector from AI service
        const embeddingVector = await getEmbedding(embeddingText);

        // get other embeddings in parallel
        const [recentPostsEmbedding, savedPostsEmbedding, likedPostsEmbedding, followingEmbedding] = await Promise.all([
            fetchRecentPosts(user.posts || []),
            fetchSavePosts(user.save || []),
            fetchLikedPosts(user.liked || []),
            fetchFollowingEmbedding(user.following || [])
        ]);

        // Combine all embeddings (including user embedding) into one vector (simple average)
        const allEmbeddings = [embeddingVector, recentPostsEmbedding, savedPostsEmbedding, likedPostsEmbedding, followingEmbedding]
            .filter(embedding => embedding !== null); // filter out nulls

        const finalUserEmbedding = averageEmbeddings(allEmbeddings);

        res.status(200).json({ message: 'User embedding created successfully', embedding: finalUserEmbedding });

        // Upsert user embedding in Pinecone
        // await upsertUserEmbedding(userID, finalUserEmbedding);

        // res.status(200).json({ message: 'User upserted successfully' });

    } catch (error) {
        console.error('Error upserting user:', error);
        res.status(500).json({ error: 'Failed to upsert user' });
    }
};