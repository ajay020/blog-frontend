import { Post } from "../types/post";
import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { optimisticUpvote, upvotePost } from "../features/post/postSlice";
import { Link } from "react-router-dom";

interface PostItemProps {
  post: Post;
  onOpen: (post: Post) => void;
}

const PostItem = ({ post, onOpen }: PostItemProps) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?._id);

  const isUpvoted = post.upvotes.includes(userId ?? "");

  const handleUpvote = () => {
    if (!userId) return;

    // 1️⃣ Optimistic UI update
    dispatch(
      optimisticUpvote({
        postId: post._id,
        userId,
      })
    );

    // 2️⃣ API call
    dispatch(upvotePost(post._id));
  };

  return (
    <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow">
      <Link to={`/posts/${post._id}`}>
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-white">
              {post.author.name}
            </p>
            <p className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </p>
          </div>

          <button className="text-slate-400 hover:text-white">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white">
          {post.title}
        </h3>

        {/* Content */}
        {post.content && (
          <p className="text-slate-300 leading-relaxed line-clamp-3">
            {post.content}
          </p>
        )}

        {/* Image */}
        {post.image?.url && (
          <img
            src={post.image.url}
            alt="post"
            className="w-full max-h-[400px] object-cover rounded-lg"
          />
        )}
      </Link>

      {/* Footer actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-slate-800">
        <button
          onClick={handleUpvote}
          className={
            `flex items-center gap-1 text-sm 
            ${isUpvoted ? "text-red-500" : "text-slate-400"}`
          }
        >
          <Heart size={18} fill={isUpvoted ? "currentColor" : "none"} />
          {post.upvotes.length}
        </button>

        <Link to={`/posts/${post._id}`}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-white"
        >
          <MessageCircle size={18} />
          {post.comments?.length}
        </Link>
      </div>

    </div>
  );
};

export default PostItem;

