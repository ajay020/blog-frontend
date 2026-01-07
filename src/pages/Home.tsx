import { useCallback, useEffect } from "react";
import PostItem from "../components/PostItem";
import { toast } from "react-toastify";
import { fetchPosts } from "../features/post/postSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

const Home = () => {
  const dispatch = useAppDispatch();
  const { posts, status, error, page, hasMore } = useAppSelector((state) => state.posts);

  // Initial load
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);


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
        return <PostItem key={post._id} post={post} />;
      })
      }

      {status === "loading" && <p>Loading more...</p>}
      {!hasMore && <p>No more posts</p>}
    </div>
  );
};

export default Home;
