import type { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/Types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type InfiniteData
} from "@tanstack/react-query";
import { addComment, createPost, createUserAccount, deleteComment, deletePost, deleteSavedPost, editComment, followCreator, getCurrentUser, getInfinitePosts, getPostByID, 
  getRecentPosts, getUserByID, getUserPosts, getUsers, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost,
  updateUser,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";
import type { Models } from "appwrite";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
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
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
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
    mutationFn: (savedRecordID: string) => deleteSavedPost(savedRecordID),
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
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

export const useGetPosts = () => {
  return useInfiniteQuery<
    Models.DocumentList<Models.Document> | null, // Query data type
    Error,                                     // Error type
    InfiniteData<Models.DocumentList<Models.Document> | null>, // Infinite data type
    string[],                                  // Query key type
    string | undefined                          // pageParam type
  >({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam }) => getInfinitePosts({ pageParam }),
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
    queryFn: () => searchPosts(searchTerm),
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
      return deleteComment(commentID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postID],
      });
    },
  });
};