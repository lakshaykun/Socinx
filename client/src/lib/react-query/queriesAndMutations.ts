import type { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/Types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type InfiniteData
} from "@tanstack/react-query";
import { addComment, createPost, createUserAccount, deleteComment, deletePost, deleteSavedPost, editComment, followCreator, getCurrentUser, getInfiniteRecentPosts, getInfiniteTrendingPosts, getPostByID, 
  getUserByID, getUserPosts, getUsers, likePost, savePost, signInAccount, signOutAccount, updatePost,
  updateUser,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";
import type { Models } from "appwrite";
import { upsertPost, getRelatedPosts, getRecommendedPosts, upsertUser, getRecommendedUsers, getSearchPosts } from "../recommender/api";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
    onSuccess: async (data) => {
      await upsertUser(data);
    }
  });
};

export const useSignInAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    }
  });
};

export const useSignOutAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOutAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: INewPost) => {
      return createPost(post);
    },
    onSuccess: (newPost) => {
      upsertPost(newPost);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postID,
      likesArray,
    }: {
      postID: string;
      likesArray: string[];
    }) => likePost(postID, likesArray),
    onSuccess: (data) => {
      upsertPost(data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postID, userID }: { postID: string; userID: string }) =>
      savePost(postID, userID),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({savedRecordID, postID}: {savedRecordID: string, postID: string}) => deleteSavedPost(savedRecordID, postID),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser
  });
};

export const useGetPostByID = (postID: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postID],
    queryFn: () => getPostByID(postID),
    enabled: !!postID,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (newPost) => {
      upsertPost(newPost);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, newPost?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postID, imageID }: { postID: string; imageID: string }) =>
      deletePost(postID, imageID),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useInfiniteQuery<
    Models.DocumentList<Models.Document> | null, // Query data type
    Error,                                     // Error type
    InfiniteData<Models.DocumentList<Models.Document> | null>, // Infinite data type
    string[],                                  // Query key type
    string | undefined                          // pageParam type
  >({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam }) => getInfiniteRecentPosts({ pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.documents.length === 0) return null;
      const lastID = lastPage?.documents[lastPage?.documents.length - 1].$id;
      return lastID;
    },
    initialPageParam: undefined
  });
};

export const useGetTrendingPosts = () => {
  return useInfiniteQuery<
    Models.DocumentList<Models.Document> | null, // Query data type
    Error,                                     // Error type
    InfiniteData<Models.DocumentList<Models.Document> | null>, // Infinite data type
    string[],                                  // Query key type
    string | undefined                          // pageParam type
  >({
    queryKey: [QUERY_KEYS.GET_INFINITE_TRENDING_POSTS],
    queryFn: ({ pageParam }) => getInfiniteTrendingPosts({ pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.documents.length === 0) return null;
      const lastID = lastPage?.documents[lastPage?.documents.length - 1].$id;
      return lastID;
    },
    initialPageParam: undefined
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => getSearchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS, limit],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUserByID = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserByID(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      upsertUser(data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

export const useFollowCreator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userID,
      creatorID,
      followersArray,
      followingsArray,
    }: {
      userID: string;
      creatorID: string;
      followersArray: string[];
      followingsArray: string[];
    }) => followCreator(userID, creatorID, followersArray, followingsArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.user.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.creator.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
    },
  });
};

export const useGetUserPosts = (userID?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userID],
    queryFn: () => getUserPosts(userID),
    enabled: !!userID,
  });
};

export const useAddComment = (postID: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userID,
      comment,
    }: {
      userID: string;
      comment: string;
    }) => {
      return addComment(postID, userID, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postID],
      });
    },
  });
}

export const useEditComment = (postID: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentID,
      comment,
    }: {
      commentID: string;
      comment: string;
    }) => {
      return editComment(commentID, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postID],
      });
    },
  });
};

export const useDeleteComment = (postID: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentID: string) => {
      return deleteComment(commentID, postID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postID],
      });
    },
  });
};

export const useGetRelatedPosts = (postID: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RELATED_POSTS, postID],
    queryFn: () => getRelatedPosts(postID),
    enabled: !!postID,
  });
}

export const useGetRecommendedPosts = (userID: string | null, liked_post_ids: string[], limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECOMMENDED_POSTS, userID, limit],
    queryFn: () => getRecommendedPosts(userID, liked_post_ids, limit),
    enabled: !!userID,
  });
};

export const useGetRecommendedUsers = (userID: string | null, followingsList: string[], limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECOMMENDED_USERS, userID, limit],
    queryFn: () => getRecommendedUsers(userID, followingsList, limit),
    enabled: !!userID,
  });
};