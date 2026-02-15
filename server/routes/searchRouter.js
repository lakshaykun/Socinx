import Router from 'express';
import { appwriteAuth } from '../middlewares/appwriteAuth'
import { getUserEmbedding, getPostsPinecone } from '../config/pineconeConfig';
import { getEmbedding } from '../config/aiServiceConfig';
import { getPostAppwrite } from '../config/appwriteConfig'
import cosineSimilarity from 'cosine-similarity';

const searchRouter = Router();

searchRouter.get('/', appwriteAuth, async (req, res) => {
    try {
        const { query } = req.query;
        const userID = req.userID;
        if (!query || !userID) {
            return res.status(400).json({ error: 'Query and userID are required' });
        }

        // get user embedding
        const userEmbedding = await getUserEmbedding(userID);

        if (query[0] === '#') {
            // search tag
        } else {
            const posts = await searchPosts(query, userEmbedding);
            return res.json({ posts });
        }
        
    } catch (error) {
        console.error('Error searching:', error);
        return res.status(500).json({ error: 'Failed to search' });
    }
});

export default searchRouter;


const searchPosts = async (query, userEmbedding) => {
    try {
        const queryEmbedding = await getEmbedding(query);
        const results = await getPostsPinecone(vector=queryEmbedding, includeMetadata=false);
        // re-rank the posts
        for (let post of results) {
            post.post = await getPostAppwrite(post.id);
            post.score = scoreParams.alpha * post.score 
                    + scoreParams.beta * cosineSimilarity(post.values, userEmbedding)
                    + scoreParams.gamma * (post.post.likes.length + post.post.save.length + post.post.comments.length);
        }
        // sort the posts
        results.sort((a, b) => b.score - a.score);
        const curr = results.map(post => post.post);
        return curr;
    } catch (error) {
        console.error("Error searching posts:", error);
        throw new Error("Failed to search posts");
    }
};

const scoreParams = {
    alpha: 0.5,
    beta: 0.1,
    gamma: 0.4
}