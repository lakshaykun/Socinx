import type { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultsProps = {
  searchedPosts: [Models.Document] | null;
  isSearchFetching: boolean;
}

const SearchResults = ({ searchedPosts, isSearchFetching } : SearchResultsProps) => {
  if (isSearchFetching) return <Loader />;

  if (searchedPosts && searchedPosts.length > 0) {
    return (
      <GridPostList posts={searchedPosts} />
    )
  }

  return (
    <span className="text-light-4 mt-10 text-center w-full">
      No posts found
    </span>
  )
}

export default SearchResults
