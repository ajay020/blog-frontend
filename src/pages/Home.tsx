import { useEffect, useState } from "react";
import PostItem from "../components/PostItem";
import { toast } from "react-toastify";
import { fetchPosts, selectPostsWithBookmarks } from "../features/post/postSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import BookMarkPostItem from "../components/post/bookmark-post-item";

const Home = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state: RootState) => state.posts);
  const posts = useAppSelector(selectPostsWithBookmarks);
  const bookmarks = useAppSelector((s) => s.auth.bookmarks);

  console.log("Home render", status )

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
    <div className="flex justify-center items-start gap-4 mt-8 mx-8">
      <div className=" flex-1 flex flex-col gap-4">
        {posts.map((post) => {
          return <PostItem key={post._id} post={post} />;
        })
        }
      </div>

      <div className=" flex flex-col gap-4 ">
        <h2 className="text-2xl font-bold text-white mb-4">Bookmarked </h2>
        {bookmarks.length === 0 ? (
          <p className="text-gray-500">No bookmarked posts.</p>
        ) : (
          bookmarks.map((post) => (
            <BookMarkPostItem key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
