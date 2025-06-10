import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import type { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
    post: Models.Document;
    userID: string;
}

const PostStats = ({ post, userID }: PostStatsProps) => {
    const likesArray = post.likes.map((user: Models.Document) => user.$id);
    const { mutate: likePost, isPending: isLikingPost } = useLikePost();
    const { mutate: savePost, isPending: isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();
    const { data: currentUser } = useGetCurrentUser();
    const [ likes, setLikes ] = useState<string[]>(likesArray);
    const [ isSaved, setIsSaved ] = useState(false);
    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record?.post?.$id === post?.$id);

    useEffect(() => {
        setIsSaved(!!savedPostRecord);
    }, [currentUser]);

    useEffect(() => {
        setLikes(post.likes.map((user: Models.Document) => user.$id));
    }, [post.likes]);

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        let updatedLikes = [...likes];
        if (checkIsLiked(likes, userID)) {
            updatedLikes = likes.filter((id) => id !== userID);
        } else {
            updatedLikes.push(userID);
        }
        setLikes(updatedLikes);
        likePost({ postID: post.$id, likesArray: updatedLikes });
    }

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (savedPostRecord) {
            deleteSavedPost(savedPostRecord.$id);
            setIsSaved(false);
        } else {
            savePost({ postID: post.$id, userID: userID });
            setIsSaved(true);
        }
    }

    return (
        <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            { isLikingPost ? <Loader />
            : <img 
                src={`${
                        checkIsLiked(likes, userID)
                        ? "/assets/icons/liked.svg"
                        : "/assets/icons/like.svg"
                    }`}
                alt="like" 
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={handleLikePost}
            />
            }
            <span className="small-medium lg:base-medium">{likes.length}</span>
        </div>
        <div className="flex gap-2">
            { isSavingPost || isDeletingSaved ? <Loader />
            : <img 
                src={isSaved 
                    ? "/assets/icons/saved.svg" 
                    : "/assets/icons/save.svg" 
                }  
                alt="like" 
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={handleSavePost}
            />}
            
        </div>

        </div>
    )
}

export default PostStats
