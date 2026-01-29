// components/BookmarkButton.tsx
import React from 'react';
import { Bookmark } from 'lucide-react';
import { useBookmark } from '@/hooks/useBookmark';

interface BookmarkButtonProps {
    articleId: string;
    variant?: 'icon' | 'text' | 'full';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
    articleId,
    variant = 'icon',
    size = 'md',
    className = '',
}) => {
    const { isBookmarked, isBookmarking, handleToggleBookmark } = useBookmark(articleId);

    const sizeClasses = {
        sm: 'p-1',
        md: 'p-2',
        lg: 'p-3',
    };

    const iconSizes = {
        sm: 16,
        md: 18,
        lg: 20,
    };

    const baseClasses = `
        rounded-full transition-all 
        hover:bg-gray-100 dark:hover:bg-gray-800 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isBookmarked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
        ${sizeClasses[size]}
        ${className}
    `;

    if (variant === 'icon') {
        return (
            <button
                onClick={handleToggleBookmark}
                disabled={isBookmarking}
                className={baseClasses}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
                <Bookmark
                    size={iconSizes[size]}
                    fill={isBookmarked ? 'currentColor' : 'none'}
                    className={isBookmarking ? 'animate-pulse' : ''}
                />
            </button>
        );
    }

    if (variant === 'text') {
        return (
            <button
                onClick={handleToggleBookmark}
                disabled={isBookmarking}
                className={`flex items-center gap-2 ${baseClasses}`}
            >
                <span className="text-sm font-medium">
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </span>
            </button>
        );
    }

    // variant === 'full'
    return (
        <button
            onClick={handleToggleBookmark}
            disabled={isBookmarking}
            className={`flex items-center gap-2 ${baseClasses}`}
        >
            <Bookmark
                size={iconSizes[size]}
                fill={isBookmarked ? 'currentColor' : 'none'}
                className={isBookmarking ? 'animate-pulse' : ''}
            />
            <span className="text-sm font-medium">
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
        </button>
    );
};

export default BookmarkButton;
