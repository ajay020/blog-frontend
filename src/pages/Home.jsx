import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostItem from "../components/PostItem";
import { toast } from "react-toastify";
import { fetchPosts } from "../features/post/postSlice";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, status, error, page, hasMore } = useSelector((state) => state.posts);

  // Initial load
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts(1));
    }
  }, [dispatch, status]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const loadMore = useCallback(() => {
    if (status !== "loading") {
      dispatch(fetchPosts(page));
    }
  }, [dispatch, page, status]);

  const observerRef = useInfiniteScroll(
    loadMore,
    hasMore,
    status === "loading"
  );

  // Failed state
  if (status === "failed") {
    return (
      <p className="text-center mt-8 text-red-500">
        Failed to load posts.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {posts.map((post, index) => {
        if (index === posts.length - 1) {
          return (
            <div ref={observerRef} key={post._id}>
              <PostItem post={post} />
            </div>
          );
        }
        return <PostItem key={post._id} post={post} />;
      })}

      {status === "loading" && <p>Loading more...</p>}
      {!hasMore && <p>No more posts</p>}
    </div>
  );
};

export default Home;
