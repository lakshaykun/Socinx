import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useGetCurrentUser, useGetRecommendedPosts, useGetRecommendedUsers } from "@/lib/react-query/queriesAndMutations";
import type { Models } from "appwrite";

const Home = () => {
  const { data: user } = useGetCurrentUser();
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecommendedPosts(
    user?.$id || null,
    user?.liked.map((post: Models.Document) => post.$id) || [],
    10
  );
  const { data: creators, isPending: isUserLoading, isError: isErrorUsers } = useGetRecommendedUsers(
    user?.$id || null,
    user?.following.map((follower: Models.Document) => follower) || [],
    6
  );

  return (
    <div className="flex flex-1 flex-col custom-scrollbar overflow-scroll xl:flex-row">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          { isPostLoading && !posts ? (
            <Loader />
          ) : isErrorPosts ? (
            <p className="text-light-4">No posts right now...</p>
          ) : (
            <ul className="flex flex-col gap-9 flex-1 w-full">
              { posts.map((post: Models.Document, index: number) => (
                <li key={index} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) }
        </div>
      </div>
    
      <div className="home-creators xl:max-w-[400px]">
        <h3 className="h3-bold text-light-1 text-center mb-6 xl:mb-0">You May Like</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : isErrorUsers ? (
          <p className="text-light-4">No creators...</p>
        ) : (
          <ul className="grid grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-6">
            {creators?.map((creator : any) => (
              <li key={creator?.$id}>
                <UserCard creator = {creator} />
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}

export default Home
