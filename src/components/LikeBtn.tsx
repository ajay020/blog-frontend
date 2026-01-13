import { Heart } from 'lucide-react'

type LikeButtonProps = {
    post: any;
    isUpvoted: boolean;
    toggleUpvote: () => void;
}

function LikeButton({ post, isUpvoted, toggleUpvote }: LikeButtonProps) {
    return (
        <button
            onClick={toggleUpvote}
            className={
                `flex items-center gap-1 text-sm 
            ${isUpvoted ? "text-red-500" : "text-slate-400"}`
            }
        >
            <Heart size={18} fill={isUpvoted ? "currentColor" : "none"} />
            {post.upvotes.length}
        </button>
    )
}

export default LikeButton