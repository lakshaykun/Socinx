import type { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/Types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) {
      throw new Error("Failed to create user account");
    }

    const avatarURL = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountID: newAccount.$id,
      name: newAccount.name,
      username: user.username,
      email: newAccount.email,
      imageURL: new URL(avatarURL),
    });

    return newUser;
  } catch (error) {
    console.log("Error creating user account:", error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountID: string;
  name: string;
  username?: string;
  email: string;
  imageURL: URL;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log("Error saving user to DB:", error);
    throw error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return session;
  } catch (error) {
    console.log("Error signing in:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    console.log("Fetching current user...");
    const currentAccount = await account.get();
    if (!currentAccount) {
      console.log("No current user found");
      return null;
    }

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      [Query.equal("accountID", currentAccount.$id)]
    );

    if (!currentUser) {
      console.log("User not found in database");
      return null;
    }

    return currentUser.documents[0];
  } catch (error) {
    console.log("Error getting current user:", error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.log("Error signing out:", error);
    return false;
  }
}

export async function createPost(post: INewPost) {
  try {
    // upload file to storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) {
      console.log("Failed to upload file");
      return null;
    }

    // get file preview
    const fileURL = getFilePreview(uploadedFile.$id);

    if (!fileURL) {
      console.log("Failed to get file preview");
      await deleteFile(uploadedFile.$id);
      return null;
    }

    // split tags into an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // create post in database
    const newPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageURL: new URL(fileURL),
        imageID: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      console.log("Failed to create post in database");
      await deleteFile(uploadedFile.$id);
      return null;
    }

    return newPost;
  } catch (error) {
    console.log("Error creating post:", error);
    return null;
  }
}

export async function uploadFile(file: File) {
  try {
    const fileUpload = await storage.createFile(
      appwriteConfig.storageID,
      ID.unique(),
      file
    );
    return fileUpload;
  } catch (error) {
    console.log("Error uploading file:", error);
    return null;
  }
}

export function getFilePreview(fileID: string) {
  try {
    const fileURL = storage.getFileView(appwriteConfig.storageID, fileID);
    return fileURL;
  } catch (error) {
    console.log("Error getting file preview:", error);
    return null;
  }
}

export async function deleteFile(fileID: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageID, fileID);
    return true;
  } catch (error) {
    console.log("Error deleting file:", error);
    return false;
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    return posts;
  } catch (error) {
    console.log("Error getting recent posts:", error);
    return null;
  }
}

export async function likePost(postID: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      postID,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) {
      console.log("Failed to update post likes");
      return null;
    }

    return updatedPost;
  } catch (error) {
    console.log("Error liking post:", error);
    return null;
  }
}

export async function savePost(postID: string, userID: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.savesCollectionID,
      ID.unique(),
      {
        user: userID,
        post: postID,
      }
    );

    if (!updatedPost) {
      console.log("Failed to save post");
      return null;
    }

    return updatedPost;
  } catch (error) {
    console.log("Error saving post:", error);
    return null;
  }
}

export async function deleteSavedPost(savedRecordID: string) {
  try {
    const status = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.savesCollectionID,
      savedRecordID
    );

    if (!status) {
      console.log("Failed to delete saved post");
      return null;
    }

    return status;
  } catch (error) {
    console.log("Error deleting saved post:", error);
    return null;
  }
}

export async function getPostByID(postID: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      postID
    );

    if (!post) {
      console.log("Post not found");
      return null;
    }

    return post;
  } catch (error) {
    console.log("Error getting post by ID:", error);
    return null;
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpload = post.file.length > 0;

  try {
    let image = {
      imageURL: post.imageUrl,
      imageID: post.imageId,
    };

    if (hasFileToUpload) {
      // upload file to storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) {
        console.log("Failed to upload file");
        return null;
      }

      // get file preview
      const fileURL = getFilePreview(uploadedFile.$id);

      if (!fileURL) {
        console.log("Failed to get file preview");
        await deleteFile(uploadedFile.$id);
        return null;
      }

      image = {
        ...image,
        imageURL: new URL(fileURL),
        imageID: uploadedFile.$id,
      };
    }

    // split tags into an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // create post in database
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      post.postId,
      {
        caption: post.caption,
        imageURL: image.imageURL,
        imageID: image.imageID,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      console.log("Failed to update post in database");
      if (hasFileToUpload) {
        await deleteFile(image.imageID);
      }
      return null;
    }

    return updatedPost;
  } catch (error) {
    console.log("Error updating post:", error);
    return null;
  }
}

export async function deletePost(postID: string, imageID: string) {
  if (!postID || !imageID) {
    console.log("Post ID or Image ID is missing", postID, imageID);
    return null;
  }
  try {
    // delete post from database
    const deletedPost = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      postID
    );

    if (!deletedPost) {
      console.log("Failed to delete post from database");
      return null;
    }

    // delete image from storage
    const deletedImage = await deleteFile(imageID);

    if (!deletedImage) {
      console.log("Failed to delete image from storage");
      return null;
    }

    return deletedPost;
  } catch (error) {
    console.log("Error deleting post:", error);
    return null;
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam?: string }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(6)];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      queries
    );

    if (!posts) {
      console.log("No posts found");
      return null;
    }

    return posts;
  } catch (error) {
    console.log("Error getting infinite posts:", error);
    return null;
  }
}

export async function searchPosts(searchParam: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      [Query.search("caption", searchParam)]
    );

    if (!posts || posts.documents.length === 0) {
      console.log("No posts found for the search term");
      return null;
    }
    return posts;
  } catch (error) {
    console.log("Error searching posts:", error);
    return null;
  }
}

export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("followersCount")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      queries
    );
    if (!users) {
      console.log("No users found");
      return null;
    }

    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserByID(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageURL: user.imageUrl,
      imageID: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageURL: fileUrl, imageID: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      user.userId,
      {
        name: user.name,
        age: user.age,
        gender: user.gender,
        interests: user.interests,
        bio: user.bio,
        imageURL: image.imageURL,
        imageID: image.imageID,
      }
    );

    await account.updateName(user.name);

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageID);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function followCreator(
  userID: string,
  creatorID: string,
  followersArray: string[],
  followingsArray: string[]
) {
  try {
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      userID,
      {
        following: followingsArray,
      }
    );

    const updatedCreator = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      creatorID,
      {
        followers: followersArray,
        followersCount: followersArray.length,
      }
    );

    if (!updatedUser || !updatedCreator) {
      console.log("Failed to update follower/following data");
      return null;
    }

    return {
      user: updatedUser,
      creator: updatedCreator,
    };
  } catch (error) {
    console.log("Error following creator:", error);
    return null;
  }
}

export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function addComment(
  postID: string,
  userID: string,
  comment: string
) {
  try {
    const newComment = {
      post: postID,
      commenter: userID,
      comment: comment
    };

    const response = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsCollectionID,
      ID.unique(),
      newComment
    );

    if (!response) {
      console.log("Failed to post comment");
      return null;
    }

    return response;
  } catch (error) {
    console.log("Error posting comment:", error);
    return null;
  }
}

export async function editComment(
  commentId: string,
  comment: string
) {
  try {
    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsCollectionID,
      commentId,
      {
        comment: comment,
      }
    );

    if (!updatedComment) {
      console.log("Failed to update comment");
      return null;
    }

    return updatedComment;
  } catch (error) {
    console.log("Error editing comment:", error);
    return null;
  }
}

export async function deleteComment(commentId: string) {
  try {
    const deletedComment = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.commentsCollectionID,
      commentId
    );

    if (!deletedComment) {
      console.log("Failed to delete comment");
      return null;
    }

    return deletedComment;
  } catch (error) {
    console.log("Error deleting comment:", error);
    return null;
  }
}