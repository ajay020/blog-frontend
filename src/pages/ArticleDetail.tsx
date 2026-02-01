import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    getArticle,
    selectCurrentArticle,
    selectArticlesLoading,
    clearCurrentArticle,
} from '../features/articles/articleSlice';
import ArticleRenderer from '../components/ArtileRenderer';
import FollowButton from '../components/FollowButton';
import { selectUser } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';
import CommentsSection from '@/components/CommentsSection';
import ArticleActions from '@/components/ArticleActions';

const ArticleDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useAppDispatch();
    const article = useAppSelector(selectCurrentArticle);
    const isLoading = useAppSelector(selectArticlesLoading);
    const currentUser = useAppSelector(selectUser);

    useEffect(() => {
        if (slug) {
            dispatch(getArticle(slug));
        }

        return () => {
            dispatch(clearCurrentArticle());
        };
    }, [slug, dispatch]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Article not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">

            {/* Article Content */}
            <ArticleRenderer
                title={article.title}
                coverImage={article.coverImage}
                data={article.content}
                article={article}
            />

            {/* Engagement Section */}
            <div className="max-w-3xl mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-800">
                <ArticleActions
                    articleId={article._id}
                    likes={article.likes}
                    likesCount={article.likesCount}
                    commentsCount={article.commentsCount}
                    views={article.views}
                    readingTime={article.readingTime}
                />

                {/* Author Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <Link to={`/users/${article.author._id}`}>
                            <img
                                src={article.author.avatar || '/default-avatar.png'}
                                alt={article.author.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        </Link>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <Link
                                    to={`/users/${article.author._id}`}
                                    className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    {article.author.name}
                                </Link>
                                {currentUser?._id !== article.author._id && (
                                    <FollowButton userId={article.author._id} />
                                )}
                            </div>

                            {article.author.bio && (
                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                    {article.author.bio}
                                </p>
                            )}

                            <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span>{article.author.articlesCount || 0} Articles</span>
                                <span>{article.author.followersCount || 0} Followers</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                                <Link
                                    key={tag}
                                    to={`/articles?tag=${tag}`}
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add Comments Section */}
                <CommentsSection articleId={article._id} />
            </div>
        </div>
    );
};

export default ArticleDetail;