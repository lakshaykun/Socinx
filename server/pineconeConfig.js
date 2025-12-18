import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

await pc.createIndex({
  name: "example-index",
  dimension: 1536,      // must match embedding size
  metric: "cosine",
  spec: {
    serverless: {
      cloud: "aws",
      region: "us-east-1",
    },
  },
});