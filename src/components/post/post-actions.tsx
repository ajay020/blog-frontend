import { MessageCircle } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { useBookmark } from "../../hooks/useBookmark";
import BookMarkBtn from "../BookMarkBtn";
import useLike from "../../hooks/useLike";
import LikeButton from "../LikeBtn";

interface Props {
    postId: string;
}

const PostActions = ({ postId }: Props) => {
    const post = useAppSelector((state) => {
        return (
            state.posts.posts.find((p) => p._id === postId) ||
            state.posts.selectedPost
        );
    });

    const { toggleUpvote, isUpvoted } = useLike(post!)
    const { isBookmarked, toggleBookmark } = useBookmark(post!);

    if (!post) return null;

    return (
        <div className="flex gap-6 border-y border-slate-800 py-4 mb-6">
            <LikeButton post={post} isUpvoted={isUpvoted} toggleUpvote={toggleUpvote} />
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
