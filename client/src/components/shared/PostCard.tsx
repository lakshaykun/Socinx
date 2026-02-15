import { useUserContext } from "@/context/AuthContext";
import { timeAgo } from "@/lib/utils";
import type { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post || !user) {
    return;
  }

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/profile/${post.creator.$id}`}
            className="flex items-center gap-2"
          >
            <img
              src={
                post?.creator?.imageURL ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt={post.creator.name}
              className="w-12 lg:h-12 rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <span className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </span>
            <div className="flex-center gap-2 text-light-3">
              <span className="subtle-semibold lg:small-regular">
                {timeAgo(post.$createdAt)}
              </span>
              -
              <span className="subtle-semibold lg:small-regular">
                {post.location}
              </span>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.$id}`}
          className={`cursor-pointer ${
            user.id !== post.creator.$id && "hidden"
          }`}
        >
          <img src="/assets/icons/edit.svg" alt="Edit" width={20} height={20} />
        </Link>
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <span className="line-clamp-3">{post.caption}</span>
          <div className="line-clamp-2 leading-tight mt-2 text-light-3">
            {post.tags.map((tag: string, index: number) => (
              <span key={index} className="inline-block mr-2">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <img
          src={post.imageURL}
          alt="Post Image"
          className="post-card_img object-fit"
        />
      </Link>
      <PostStats post={post} userID={user.id} />
    </div>
  );
};

export default PostCard;
