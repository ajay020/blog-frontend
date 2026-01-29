// hooks/useBookmark.ts
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleBookmark, selectIsArticleBookmarked } from '@/features/bookmark/bookmarkSlice';

interface UseBookmarkReturn {
    isBookmarked: boolean;
    isBookmarking: boolean;
    handleToggleBookmark: (e?: React.MouseEvent) => Promise<void>;
}

export const useBookmark = (articleId: string): UseBookmarkReturn => {
    const dispatch = useAppDispatch();
    const isBookmarked = useAppSelector(selectIsArticleBookmarked(articleId));
    const [isBookmarking, setIsBookmarking] = useState(false);

    const handleToggleBookmark = async (e?: React.MouseEvent) => {
        // Prevent event propagation if event is provided
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isBookmarking) return;

        setIsBookmarking(true);
        try {
            await dispatch(toggleBookmark(articleId)).unwrap();
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
            // You can add toast notification here if needed
        } finally {
            setIsBookmarking(false);
        }
    };

    return {
        isBookmarked,
        isBookmarking,
        handleToggleBookmark,
    };
};