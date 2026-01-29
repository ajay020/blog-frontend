import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock } from 'lucide-react';
import { Article } from '@/types/article.types';
import BookmarkButton from '../BookMarkButton';

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const publishedAt = article.publishedAt ? new Date(article.publishedAt) : null;

    return (
        <div className="px-4 py-4 block border border-gray-400 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
            {/* Author Info */}
            <div className="flex items-center gap-2 mb-3">
                <img
                    src={article.author.avatar || '/default-avatar.png'}
                    alt={article.author.name}
                    className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {article.author.name}
                </span>
            </div>

            <Link to={`/articles/${article.slug}`}>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
                            {article.title}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                            {article.excerpt}
                        </p>

                        <div className="flex items-center gap-2 mb-2">
                            {article.tags.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {article.coverImage && (
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-[120px] h-[80px] object-cover rounded"
                        />
                    )}
                </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    {publishedAt && <span>{publishedAt.toLocaleDateString()}</span>}
                    <div className="flex items-center gap-1">
                        <Heart size={14} />
                        {article.likesCount}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} /> {article.readingTime} min
                    </div>
                </div>

                {/* Bookmark Button */}
                <BookmarkButton articleId={article._id} variant="icon" size="sm" />
            </div>
        </div>
    );
};

export default ArticleCard;
