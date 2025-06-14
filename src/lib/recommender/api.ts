import { getPostByID, getUserByID } from "../appwrite/api";
import axios from "axios";
import { recommenderConfig } from "./config";

export const getRelatedPosts = async (postID: string, limit?: number) => {
  const response = await axios.get(`${recommenderConfig.apiUrl}/related-posts`, {
    params: {
      post_id: postID,
      limit: limit || 6
    }
  });
  if (response.status !== 200) {
    throw new Error('Failed to fetch related posts');
  }
  let data = response.data;
  data = data['results'];
  data = await Promise.all(data.map((id: string) => getPostByID(id)));
  return data;
}

export const upsertPost = async (post: any) => {
    if (!post) return null;
    const response = await axios.post(`${recommenderConfig.apiUrl}/upsert-post`, {
        "id": post.$id,
        "creatorID": post.creator['$id'],
        "creatorName": post.creator['name'],
        "creatorUsername": post.creator['username'],
        "caption": post.caption,
        "tags": post.tags || [],
        "comments": post.comments || [],
        "likes": post.likes || [],
        "location": post.location || '',
        "createdAt": post.$createdAt,
        "save": post.save || [],
        "trendCount": post.trendCount || 0,
        "imageURL": post.imageURL || '',
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.status !== 200) {
        throw new Error('Failed to add post');
    }

    return response.data;
}

export const upsertUser = async (user: any) => {
    if (!user) return null;
    console.log(`${recommenderConfig.apiUrl}/related-posts`);
    const response = await axios.post(`${recommenderConfig.apiUrl}/upsert-user`, {
        "id": user.$id,
        "name": user.name,
        "username": user.username,
        "bio": user.bio || '',
        "gender": user.gender || '',
        "age": user.age || 0,
        "followersCount": user.followersCount || 0,
        "interests": user.interests || [],
        "save": user.save || [],
        "posts": user.posts || [],
        "following": user.following || [],
        "liked": user.liked || [],
        "comments": user.comments || [],
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (response.status !== 200) {
        throw new Error('Failed to add user');
    }

    return response.data;
}

export const getRecommendedPosts = async (userID: string | null, liked_post_ids: string[], limit?: number) => {
    if (!userID) {
        return null;
    }
    const response = await axios.get(`${recommenderConfig.apiUrl}/recommend-posts`, {
        params: {
            user_id: userID,
            liked_post_ids: JSON.stringify(liked_post_ids),
            limit: limit || 6
        }
    });
    if (response.status !== 200) {
        throw new Error('Failed to fetch recommended posts');
    }
    let data = response.data;
    data = data['results'];
    data = await Promise.all(data.map((id: string) => getPostByID(id)));
    return data;
};

export const getRecommendedUsers = async (userID: string | null, followingsList: string[], limit?: number) => {
    if (!userID) {
        return null;
    }
    const response = await axios.get(`${recommenderConfig.apiUrl}/recommend-users`, {
        params: {
            user_id: userID,
            followingsList: JSON.stringify(followingsList),
            limit: limit || 6
        }
    });
    if (response.status !== 200) {
        throw new Error('Failed to fetch recommended users');
    }
    let data = response.data;
    data = data['results'];
    data = await Promise.all(data.map((id: string) => getUserByID(id)));
    return data;
};

export const getSearchPosts = async (query: string, limit?: number) => {
    const response = await axios.get(`${recommenderConfig.apiUrl}/search-posts`, {
        params: {
            query: query,
            limit: limit || 10
        }
    });
    if (response.status !== 200) {
        throw new Error('Failed to fetch search posts');
    }
    let data = response.data;
    data = data['results'];
    data = await Promise.all(data.map((id: string) => getPostByID(id)));
    return data;
};