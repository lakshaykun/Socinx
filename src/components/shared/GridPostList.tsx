import { useUserContext } from "@/context/AuthContext"
import type { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"

type GridPostListProps = {
    posts: Models.Document[],
    showUser?: boolean,
    showStats?: boolean,
}

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
    const { user } = useUserContext();

    return (
        <div>
            <ul className="grid-container">
                {posts.map((post) => (
                    <li key={post.$id} className="relative min-w-80 h-80">
                        <Link to={`/posts/${post.$id}`} className="grid-post_link">
                            <img 
                                src={post.imageURL} 
                                alt="post image" 
                                className="h-full w-full object-cover" 
                            />
                        </Link>

                        <div className="grid-post_user">
                            {showUser && (
                                <Link to={`/profile/${post.creator.$id}`} className="flex flex-1 items-center justify-start gap-2">
                                    <img 
                                        src={post.creator.imageURL} alt="creator" 
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                    <span className="line-clamp-1">{post.creator.name}</span>
                                </Link>
                            )}
                            {showStats && <PostStats post={post} userID={user.id} />}
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    )
}

export default GridPostList
