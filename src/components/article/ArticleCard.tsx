import { Link } from 'react-router-dom';
import { Article } from '@/types/article.types';
import AuthorInfo from '../AuthorInfo';
import { Clock, Heart, HeartHandshake, Timer, TimerIcon, Watch } from 'lucide-react';

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {

    const publishedAt = article.publishedAt ? new Date(article.publishedAt) : null;

    return (
        <div
            className="px-2 py-1 block border border-gray-400 dark:border-gray-700 rounded-lg"
        >
            <AuthorInfo article={article} showFollowBtn={false} />

            <Link
                to={`/articles/${article.slug}`}
            >
                <div className='flex justify-between items-center gap-1'>
                    <div className='flex-col items-center gap-2'>
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
                            className="w-[120px] h-[80px]"
                        />
                    )}
                </div>
            </Link>

            {/* actions  */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                    {publishedAt && <span>{publishedAt.toLocaleDateString()}</span>}
                    <div className='flex items-center gap-1'>
                        <Heart size={14} />
                        {article.likesCount}
                    </div>
                    <div className='flex items-center gap-1'>
                        <Clock size={14} /> {article.readingTime} min
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
