import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    getArticles,
    selectArticles,
    selectArticlesLoading,
    selectPagination,
    setCurrentPage,
} from '@/features/articles/articleSlice';
import ArticleCard from '@/components/article/ArticleCard';

const Articles = () => {
    const dispatch = useAppDispatch();
    const articles = useAppSelector(selectArticles);
    const isLoading = useAppSelector(selectArticlesLoading);
    const pagination = useAppSelector(selectPagination);

    useEffect(() => {
        dispatch(getArticles({ page: pagination.currentPage, limit: 10 }));
    }, [dispatch, pagination.currentPage]);

    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page));
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 flex flex-col items-center">
            <div className="flex flex-col gap-4 w-[50%] mt-12">
                {articles.map((article) => (
                    <ArticleCard key={article._id} article={article} />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                    (page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded ${page === pagination.currentPage
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default Articles;