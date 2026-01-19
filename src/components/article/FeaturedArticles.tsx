// src/components/FeaturedArticles.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
    getFeaturedArticles,
    selectFeaturedArticles,
    selectArticlesLoading,
} from '@/features/articles/articleSlice';

const FeaturedArticles = () => {
    const dispatch = useAppDispatch();
    const featured = useAppSelector(selectFeaturedArticles);
    const isLoading = useAppSelector(selectArticlesLoading);

    useEffect(() => {
        dispatch(getFeaturedArticles());
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading featured articles...</div>;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Featured Articles</h2>

            <div className="space-y-4">
                {featured.map((article) => (
                    <Link
                        key={article._id}
                        to={`/articles/${article.slug}`}
                        className="block hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg transition"
                    >
                        <h3 className="font-bold mb-1 line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {article.author.name} · {article.readingTime} min read
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FeaturedArticles;