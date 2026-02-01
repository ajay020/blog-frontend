import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    getArticles,
    selectArticles,
    selectArticlesLoading,
    selectPagination,
} from '../features/articles/articleSlice';
import ArticleCard from '@/components/article/ArticleCard';


const Articles = () => {
    const dispatch = useAppDispatch();
    const articles = useAppSelector(selectArticles);
    const isLoading = useAppSelector(selectArticlesLoading);
    const pagination = useAppSelector(selectPagination);

    // Ref for the observer target
    const observerTarget = useRef<HTMLDivElement>(null);

    // Track if we're currently fetching
    const isFetchingRef = useRef(false);

    // Load more articles
    const loadMore = useCallback(() => {
        // Don't load if already loading or no more pages
        if (
            isFetchingRef.current ||
            isLoading ||
            pagination.currentPage >= pagination.totalPages
        ) {
            return;
        }

        isFetchingRef.current = true;
        const nextPage = pagination.currentPage + 1;

        dispatch(getArticles({ page: nextPage, limit: 10 })).finally(() => {
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
                rootMargin: '100px', // Start loading 100px before reaching the bottom
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
        if (articles.length === 0) {
            dispatch(getArticles({ page: 1, limit: 10 }));
        }
    }, [dispatch, articles.length]);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <div className="max-w-3xl mx-auto px-4 py-12">

                {/* Initial Loading */}
                {isLoading && articles.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <>
                        {/* Articles List */}
                        <div className="flex flex-col gap-4">
                            {articles.map((article) => (
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
                            articles.length > 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p>You've reached the end! 🎉</p>
                                    <p className="text-sm mt-2">
                                        {pagination.total} articles in total
                                    </p>
                                </div>
                            )}

                        {/* No Articles */}
                        {articles.length === 0 && !isLoading && (
                            <div className="text-center py-20">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                    No articles found
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Articles;