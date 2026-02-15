import type { Models } from "appwrite";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

type CreatorCardProps = {
  creator: Models.Document;
};

const UserCard = ({ creator }: CreatorCardProps) => {
  
  if (!creator) {
    return null; // Return null if creator data is not available
  }

  return (
    <Link to={`/profile/${creator.$id}`} className="user-card">
      <img
        src={creator.imageURL || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {creator.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{creator.username}
        </p>
      </div>

      <FollowButton creator={creator} />
    </Link>
  );
};

export default UserCard;