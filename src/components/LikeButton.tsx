import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleLike } from '../features/articles/articleSlice';
import { selectUser } from '../features/auth/authSlice';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
    articleId: string;
    likesCount: number;
    likes: string[];
    variant?: 'default' | 'compact' | 'icon';
    className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
    articleId,
    likesCount,
    likes,
    variant = 'default',
    className = '',
}) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const [isLiked, setIsLiked] = useState(false);
    const [currentLikes, setCurrentLikes] = useState(likesCount);

    useEffect(() => {
        if (user) {
            setIsLiked(likes.includes(user._id));
        }
    }, [user, likes]);

    const handleLike = async () => {
        if (!user) {
            alert('Please login to like articles');
            return;
        }

        // Optimistic update
        setIsLiked(!isLiked);
        setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);

        try {
            await dispatch(toggleLike(articleId));
        } catch (error) {
            // Revert on error
            setIsLiked(!isLiked);
            setCurrentLikes(isLiked ? currentLikes + 1 : currentLikes - 1);
            console.error('Failed to toggle like:', error);
        }
    };

    // Variant: Icon Only
    if (variant === 'icon') {
        return (
            <button
                onClick={handleLike}
                disabled={!user}
                className={`p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${isLiked
                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    } ${className}`}
                title={user ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
            >
                <Heart
                    className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
                />
            </button>
        );
    }

    // Variant: Compact
    if (variant === 'compact') {
        return (
            <button
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${isLiked
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    } ${className}`}
                title={user ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
            >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{currentLikes}</span>
            </button>
        );
    }

    // Variant: Default
    return (
        <button
            onClick={handleLike}
            disabled={!user}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${isLiked
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                } ${className}`}
            title={user ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
        >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{currentLikes} {currentLikes === 1 ? 'Like' : 'Likes'}</span>
        </button>
    );
};

export default LikeButton;