import React, { useEffect, useRef, useCallback } from 'react';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
    getBookmarks,
    selectBookmarks,
    selectBookmarksLoading,
    selectBookmarksPagination,
} from '@/features/bookmark/bookmarkSlice';
import ArticleCard from '@/components/article/ArticleCard';

const Bookmarks: React.FC = () => {
    const dispatch = useAppDispatch();
    const bookmarks = useAppSelector(selectBookmarks);
    const isLoading = useAppSelector(selectBookmarksLoading);
    const pagination = useAppSelector(selectBookmarksPagination);

    const observerTarget = useRef<HTMLDivElement>(null);
    const isFetchingRef = useRef(false);

    // Load more bookmarks
    const loadMore = useCallback(() => {
        if (
            isFetchingRef.current ||
            isLoading ||
            pagination.currentPage >= pagination.totalPages
        ) {
            return;
        }

        isFetchingRef.current = true;
        const nextPage = pagination.currentPage + 1;

        dispatch(getBookmarks({ page: nextPage, limit: 10 })).finally(() => {
            isFetchingRef.current = false;
        });
    }, [dispatch, isLoading, pagination.currentPage, pagination.totalPages]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px',
            }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMore]);

    // Initial load
    useEffect(() => {
        if (bookmarks.length === 0) {
            dispatch(getBookmarks({ page: 1, limit: 10 }));
        }
    }, [dispatch, bookmarks.length]);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <div className="max-w-3xl mx-auto px-4 py-12">

                {/* Initial Loading */}
                {isLoading && bookmarks.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <>
                        {/* Bookmarks List */}
                        <div className="flex flex-col gap-4">
                            {bookmarks.map((article) => (
                                <ArticleCard key={article._id} article={article} />
                            ))}
                        </div>

                        {/* Observer Target (Invisible) */}
                        {pagination.currentPage < pagination.totalPages && (
                            <div
                                ref={observerTarget}
                                className="flex justify-center items-center py-8"
                            >
                                {isLoading && (
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                                )}
                            </div>
                        )}

                        {/* End Message */}
                        {pagination.currentPage >= pagination.totalPages &&
                            bookmarks.length > 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p>You've reached the end! 🎉</p>
                                    <p className="text-sm mt-2">
                                        {pagination.total} bookmarked articles
                                    </p>
                                </div>
                            )}

                        {/* No Bookmarks */}
                        {bookmarks.length === 0 && !isLoading && (
                            <div className="text-center py-20">
                                <BookmarkIcon
                                    size={64}
                                    className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
                                />
                                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                                    No bookmarks yet
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm">
                                    Start bookmarking articles to read them later!
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Bookmarks;
