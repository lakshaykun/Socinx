import { upsertPostEmbedding } from '../config/pineconeConfig.js';
import { updatePostAppwrite } from '../config/appwriteConfig.js';
import { getImageCaption, getEmbedding } from '../config/aiServiceConfig.js';

const buildEmbeddingText = (caption, imageCaption, tags) => {
    const textParts = [];
    if (caption) textParts.push(caption);
    if (imageCaption) textParts.push(`The image shows ${imageCaption}`);
    if (Array.isArray(tags) && tags.length) {
        textParts.push(`Topics include ${tags.join(', ')}`);
    }

    const text = textParts.join('. ');
    return text;
};

export default async (req, res) => {
    try {
        const { docID, caption, imageCaption, imageURL, tags } = req.body;
        if (!docID) {
            return res.status(400).json({ error: 'docID is required' });
        }
        if (!imageCaption) {
            if (!imageURL) {
                return res.status(400).json({ error: 'imageCaption or imageURL is required' });
            }
            // generate image caption
            imageCaption = await getImageCaption(imageURL);
        }
        // generate embedding
        const text = buildEmbeddingText(caption, imageCaption, tags);
        const embedding = await getEmbedding(text);
        // add embedding into pinecone server
        const pineconeResponse = await upsertPostEmbedding(docID, embedding, tags);
        if (!pineconeResponse) {
            throw new Error('Failed to upsert embedding to Pinecone');
        }
        // update the status and image caption into Appwrite
        const appwriteResponse = await updatePostAppwrite(docID, {
            status: true,
            imageCaption: imageCaption,
        });
        if (!appwriteResponse) {
            throw new Error('Failed to update post in Appwrite');
        }

        res.status(200).json({ message: 'Post upserted successfully' });
        
    } catch (error) {
        console.error('Error upserting post:', error);
        res.status(500).json({ error: 'Failed to upsert post' });
    }
}