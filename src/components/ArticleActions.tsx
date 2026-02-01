import React from 'react';
import { Heart, MessageCircle, Eye, Clock } from 'lucide-react';
import LikeButton from './LikeButton';
import BookmarkButton from './BookMarkButton';

interface ArticleActionsProps {
    articleId: string;
    likesCount: number;
    likes: string[];
    commentsCount: number;
    views: number;
    readingTime: number;
    variant?: 'full' | 'compact' | 'minimal';
    className?: string;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({
    articleId,
    likesCount,
    likes,
    commentsCount,
    views,
    readingTime,
    variant = 'full',
    className = '',
}) => {
    // Full variant - All actions with buttons
    if (variant === 'full') {
        return (
            <div className={`flex items-center justify-between ${className}`}>
                <div className="flex items-center gap-6">
                    <LikeButton
                        articleId={articleId}
                        likesCount={likesCount}
                        likes={likes}
                        variant="compact"
                    />
                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MessageCircle size={18} />
                        <span className="text-sm">{commentsCount}</span>
                    </span>
                </div>

                <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2 text-sm">
                        <Eye size={18} />
                        {views}
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                        <Clock size={18} />
                        {readingTime} min
                    </span>
                    <BookmarkButton articleId={articleId} size="sm" />
                </div>
            </div>
        );
    }

    // Compact variant - Just stats with interactive buttons
    if (variant === 'compact') {
        return (
            <div className={`flex items-center gap-6 text-gray-600 dark:text-gray-400 ${className}`}>
                <LikeButton
                    articleId={articleId}
                    likesCount={likesCount}
                    likes={likes}
                    variant="icon"
                />
                <span className="flex items-center gap-1 text-sm">
                    <MessageCircle size={16} />
                    {commentsCount}
                </span>
                <span className="flex items-center gap-1 text-sm">
                    <Clock size={16} />
                    {readingTime} min
                </span>
                <BookmarkButton articleId={articleId} size="sm" />
            </div>
        );
    }

    // Minimal variant - Just display stats (no interactive buttons)
    return (
        <div className={`flex items-center gap-6 text-gray-600 dark:text-gray-400 text-sm ${className}`}>
            <span className="flex items-center gap-1">
                <Heart size={14} />
                {likesCount}
            </span>
            <span className="flex items-center gap-1">
                <MessageCircle size={14} />
                {commentsCount}
            </span>
            <span className="flex items-center gap-1">
                <Clock size={14} />
                {readingTime} min
            </span>
        </div>
    );
};

export default ArticleActions;