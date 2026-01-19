// src/pages/Dashboard.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    getMyArticles,
    deleteArticle,
    selectMyArticles,
    selectArticlesLoading,
} from '../features/articles/articleSlice';

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const myArticles = useAppSelector(selectMyArticles);
    const isLoading = useAppSelector(selectArticlesLoading);

    useEffect(() => {
        dispatch(getMyArticles());
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            await dispatch(deleteArticle(id));
        }
    };

    if (isLoading) {
        return <div>Loading your articles...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">My Articles</h1>
                <Link
                    to="/create-article"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Write New Article
                </Link>
            </div>

            <div className="space-y-4">
                {myArticles.map((article) => (
                    <div
                        key={article._id}
                        className="border rounded-lg p-6 flex justify-between items-center"
                    >
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>Status: {article.status}</span>
                                <span>Views: {article.views}</span>
                                <span>Likes: {article.likesCount}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Link
                                to={`/articles/${article.slug}`}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
                            >
                                View
                            </Link>
                            <Link
                                to={`/edit-article/${article._id}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(article._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {myArticles.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You haven't written any articles yet.
                    </p>
                    <Link
                        to="/create-article"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Write Your First Article
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;