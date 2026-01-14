import { Post } from "../types/post";
import { MessageCircle, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAppSelector } from "../app/hooks";
import { Link } from "react-router-dom";
import { useBookmark } from "../hooks/useBookmark";
import BookMarkBtn from "./BookMarkBtn";
import useLike from "../hooks/useLike";
import LikeButton from "./LikeBtn";

interface PostItemProps {
  post: Post;
}

const PostItem = ({ post }: PostItemProps) => {
  const { toggleBookmark, isBookmarked } = useBookmark(post);
  const { toggleUpvote, isUpvoted } = useLike(post)

  return (
    <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow">
      <Link to={`/posts/${post._id}`}>
        <div className="flex justify-between gap-4">
          <div className=" flex-col flex-1">
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
          </div>

          {/* Image */}
          {post.image?.url && (
            <img
              src={post.image.url}
              alt="post"
              className="w-[200] max-h-[120px] object-cover rounded-lg"
            />
          )}
        </div>
      </Link>

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-6 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-6">
          <LikeButton post={post} isUpvoted={isUpvoted} toggleUpvote={toggleUpvote} />

          <Link to={`/posts/${post._id}`}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white"
          >
            <MessageCircle size={18} />
            {post.comments?.length}
          </Link>
        </div>

        {/* Bookmark post  */}
        <BookMarkBtn isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} />
      </div>

    </div>
  );
};

export default PostItem;

