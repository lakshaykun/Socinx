import CommentsSection from "@/components/shared/CommentsSection";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePost, useGetPostByID, useGetRelatedPosts } from "@/lib/react-query/queriesAndMutations";
import { timeAgo } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) {
    return (
      <div className="flex-center flex-1">
        <h2 className="h3-bold md:h2-bold text-light-1">Post not found</h2>
      </div>
    );
  }

  const { data: post, isPending } = useGetPostByID(id as string);
  const { user } = useUserContext();
  const { mutate: deletePost } = useDeletePost();
  const { data: relatedPosts, isLoading: isUserPostLoading } = useGetRelatedPosts(id);

  const handleDeletePost = () => {
    deletePost({ postID: id, imageID: post?.imageID });
    navigate(-1);
  };
  
  if (isPending) return <Loader />;
  if (!post) {
    return (
      <div className="flex-center flex-1">
        <h2 className="h3-bold md:h2-bold text-light-1">Post not found</h2>
      </div>
    );
  }
  
  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <>
        <div className="post_details-card">
          <img
            src={post?.imageURL || null}
            alt="Post Image"
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post.creator.imageURL ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt={post.creator.name}
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full object-cover"
                />
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
              </Link>
              <div className="flex-center">
                <Link
                  to={`/update-post/${post.$id}`}
                  className={`${user.id !== post.creator.$id && "hidden"} cursor-pointer`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="Edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`post_details-delete_btn
                    ${user.id !== post.creator.$id && "hidden"}`}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="Delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <span>{post.caption}</span>
              <ul className="flex flex-wrap gap-1 mt-2">
                {post.tags.map((tag: string, index: number) => (
                  <li key={index} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userID={user.id} />
            </div>
          </div>
        </div>

        <hr className="border w-full border-dark-4/80 max-w-5xl" />

        <CommentsSection post={post} />
        </>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
