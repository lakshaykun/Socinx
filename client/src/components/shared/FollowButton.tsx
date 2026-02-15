import {
  useGetCurrentUser,
  useFollowCreator,
} from "@/lib/react-query/queriesAndMutations";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Loader from "./Loader";
import type { Models } from "appwrite";

type CreatorProps = {
  creator: Models.Document;
};

const FollowButton = ({ creator }: CreatorProps) => {
  const { data: currentUser } = useGetCurrentUser();
  const [isFollowing, setIsFollowing] = useState<boolean>(
    creator.followers.includes(currentUser?.$id)
  );
  const { mutateAsync: followCreator, isPending: isFollowersLoading } =
    useFollowCreator();

  useEffect(() => {
    setIsFollowing(creator.followers.includes(currentUser?.$id));
  }),
    [currentUser];

  const followCreatorHandler = async (e: React.MouseEvent) => {
    if (!currentUser) {
      toast.error("You need to be logged in to follow a creator.");
      return;
    }
    e.preventDefault();
    const updatedFollowers = isFollowing
      ? creator.followers.filter((id:any) => id !== currentUser.$id)
      : [...creator.followers, currentUser.$id];
    const updatedFollowings = isFollowing
      ? currentUser.following.filter((id:any) => id !== creator.$id)
      : [...currentUser.following, creator.$id];
    const success = await followCreator({
      userID: currentUser.$id,
      creatorID: creator.$id,
      followersArray: updatedFollowers,
      followingsArray: updatedFollowings,
    });

    if (success) {
      setIsFollowing(!isFollowing);
    } else {
      toast.error(
        `Failed to ${
          isFollowing ? "unfollow" : "follow"
        } the creator. Please try again.`
      );
    }
  };

  return (
    <Button
      onClick={followCreatorHandler}
      type="button"
      size="sm"
      disabled={isFollowersLoading || currentUser?.$id === creator.$id}
      className={`shad-button_primary px-5 cursor-pointer`}
    >
      {isFollowersLoading ? (
        <Loader />
      ) : (
        `${isFollowing ? "Unfollow" : "Follow"}`
      )}
    </Button>
  );
};

export default FollowButton;
