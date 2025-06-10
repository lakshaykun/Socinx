import PostForm from "@/components/forms/PostForm"
import Loader from "@/components/shared/Loader";
import { useGetPostByID } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const UpdatePost = () => {
  const { id } = useParams();
  const { data: post, isPending: isGettingPost } = useGetPostByID(id as string);
  
  if (isGettingPost) return <Loader />

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/add-post.svg" alt="add" height={36} width={36}/>
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>
        <PostForm action="Update" post={post ?? undefined} />
      </div>
    </div>
  )
}

export default UpdatePost
