// src/pages/Articles.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    getArticles,
    selectArticles,
    selectArticlesLoading,
    selectPagination,
    setCurrentPage,
} from '@/features/articles/articleSlice';
import ArticleSearch from '@/components/article/ArticleSearch';

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
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">All Articles</h1>
            <ArticleSearch />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <Link
                        key={article._id}
                        to={`/articles/${article.slug}`}
                        className="border rounded-lg p-4 hover:shadow-lg transition"
                    >
                        {article.coverImage && (
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                        )}
                        <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                            <span>{article.author.name}</span>
                            <span>{article.readingTime} min read</span>
                        </div>
                    </Link>
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