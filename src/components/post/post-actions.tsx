import { BookmarkCheck, BookmarkPlus, Heart, MessageCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { optimisticUpvote, upvotePost } from "../../features/post/postSlice";
import { useBookmark } from "../../hooks/useBookmark";
import BookMarkBtn from "../BookMarkBtn";

interface Props {
    postId: string;
}

const PostActions = ({ postId }: Props) => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.auth.user?._id);
    const post = useAppSelector((state) => {
        return (
            state.posts.posts.find((p) => p._id === postId) ||
            state.posts.selectedPost
        );
    });

    const { isBookmarked, toggleBookmark } = useBookmark(post!);


    if (!post) return null;

    const isUpvoted = post.upvotes.includes(userId ?? "");

    const handleUpvote = () => {
        if (!userId) return;

        dispatch(optimisticUpvote({ postId: post._id, userId }));
        dispatch(upvotePost(post._id));
    };

    return (
        <div className="flex gap-6 border-y border-slate-800 py-4 mb-6">
            <button
                onClick={handleUpvote}
                className={`flex items-center gap-2 ${isUpvoted ? "text-red-500" : "text-slate-400"
                    }`}
            >
                <Heart size={20} fill={isUpvoted ? "currentColor" : "none"} />
                {post.upvotes.length}
            </button>

            <div className="flex items-center gap-2 text-slate-400">
                <MessageCircle size={20} />
                {post.comments.length}
            </div>

            {/* Bookmark post  */}
            <BookMarkBtn isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} />
        </div>
    );
};

export default PostActions;
