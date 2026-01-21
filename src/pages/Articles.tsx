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
        return <div>Loading articles...</div>;
    }

    return (
        <div className="bg-white dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 p-4">
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