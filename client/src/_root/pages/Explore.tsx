import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce";
import { useGetRecentPosts, useGetTrendingPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Explore = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { data: recentPosts, fetchNextPage: fetchNextRecentPage, hasNextPage: hasNextRecentPage } = useGetRecentPosts();
  const { data: trendingPosts, fetchNextPage: fetchNextTrendingPage, hasNextPage: hasNextTrendingPage } = useGetTrendingPosts();
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearchValue);
  const [filter, setFilter] = useState<string>("Recent");
  const handleFilterChange = () => {
    if (searchValue) {
      setSearchValue("");
      return;
    }
    // Toggle between Recent and Trending
    setFilter(prevFilter => prevFilter === "Recent" ? "Trending" : "Recent");
  }
  useEffect(() => {
    if (inView && !searchValue) {
      if (filter == "Recent" && hasNextRecentPage) {
        fetchNextRecentPage();
      } else if (filter == "Trending" && hasNextTrendingPage) {
        fetchNextTrendingPage();
      }
    }
  }, [inView, searchValue]);

  if (!recentPosts || !trendingPosts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )
  }

  const shouldShowSearchResults = searchValue.length > 0;
  const shouldShowPosts = !shouldShowSearchResults && recentPosts.pages.every((item:any) => item.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full" >Search Posts</h2>
        <div className="flex gap-1 w-full px-4 rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg" alt="search" width={24} height={24}/>
          <Input 
            type="text"
            placeholder="Search"
            className="explore-search" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">{filter} Posts</h3>
        <button onClick={handleFilterChange} className="flex-center gap-3 bg-dark-3 rounder-xl px-4 py-2 cursor-pointer">
          <span className="small-medium md:base-medium text-light-2">{filter}</span> 
          <img src="/assets/icons/filter.svg" alt="filter" width={20} height={20} />
        </button>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            searchedPosts={searchedPosts ? searchedPosts : null}
            isSearchFetching={isSearchFetching}
          />
        ) : shouldShowPosts ? (
          <span className="text-light-4 mt-10 text-center w-full">End of Posts</span>
        ) : filter == "Recent" ? (
          recentPosts.pages.map((item:any, index:number) => {
            return <GridPostList key={`page-${index}`} posts={item.documents} />
          })
        ) : (
          trendingPosts.pages.map((item:any, index:number) => {
            return <GridPostList key={`page-${index}`} posts={item.documents} />
          })
        )}
      </div>
      {((filter == "Recent" && hasNextRecentPage) || (filter == "Trending" && hasNextTrendingPage)) && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Explore
