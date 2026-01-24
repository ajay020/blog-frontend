import { Article } from '@/types/article.types';
import { Heart } from 'lucide-react'

type LikeButtonProps = {
    article: Article;
    isLiked: boolean;
    toggleUpvote: () => void;
    disabled?: boolean
}

function LikeButton({ article, isLiked, toggleUpvote, disabled }: LikeButtonProps) {
    return (
        <button
            disabled={disabled}
            onClick={toggleUpvote}
            className={
                `flex items-center gap-1 text-sm 
            ${isLiked ? "text-red-500" : "text-slate-400"}`
            }
        >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            {article?.likesCount}
        </button>
    )
}

export default LikeButton