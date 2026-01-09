import { useEffect, useState } from "react";
import PostItem from "../components/PostItem";
import { toast } from "react-toastify";
import { fetchPosts } from "../features/post/postSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Post } from "../types/post";
import { RootState } from "../app/store";
import PostModal from "../components/post/post-modal";

const Home = () => {
  const dispatch = useAppDispatch();
  const { posts, status, error, page, hasMore } = useAppSelector((state: RootState) => state.posts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // console.log("Posts:", posts, status, error);
  console.log("Home render")

  // Initial load
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);


  if (status === "failed") {
    return (
      <p className="text-center mt-8 text-red-500">
        Failed to load posts.
      </p>
    );
  }

  if (status === "succeeded" && posts?.length === 0) {
    return (
      <p className="text-center mt-8 text-gray-500">
        No posts available.
      </p>
    );
  }

  if (status === "loading") {
    return (
      <p className="text-center mt-8 text-gray-500">
        Loading posts...
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {posts.map((post) => {
        return <PostItem key={post._id} post={post} />;
      })
      }
      <PostModal
        isOpen={!!selectedPost}
        post={selectedPost ?? undefined}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};

export default Home;
