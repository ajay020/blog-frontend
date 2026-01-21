import { Link } from 'react-router-dom';
import { Article } from '@/types/article.types';

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <Link
            to={`/articles/${article.slug}`}
            className=" block border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div className='flex flex-col justify-between gap-2 p-1'>
                <div className='flex items-center gap-2'>
                    <div className="p-4">
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
                            className="w-35 h-40 object-cover"
                        />
                    )}
                </div>
                {/* actions  */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <img
                            src={article.author.avatar || '/default-avatar.png'}
                            alt={article.author.name}
                            className="w-6 h-6 rounded-full"
                        />
                        <span>{article.author.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span>❤️ {article.likesCount}</span>
                        <span>⏱️ {article.readingTime} min</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;
