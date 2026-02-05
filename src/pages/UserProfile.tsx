import React,{ useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getFollowers, getFollowing, selectFollowers, selectFollowing } from '../features/follow/followSlice';
import followService from '../services/follow.service';
import articleService from '../services/article.service';
import FollowButton from '../components/FollowButton';
import { User } from '../types/auth.types';
import { Article } from '../types/article.types';
import { Mail, Globe, Twitter, Github, Linkedin } from 'lucide-react';

const UserProfile = () => {
    const { userId } = useParams<{ userId: string }>();
    const dispatch = useAppDispatch();
    const followers = useAppSelector(selectFollowers);
    const following = useAppSelector(selectFollowing);

    const [user, setUser] = useState<User | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [activeTab, setActiveTab] = useState<'articles' | 'followers' | 'following'>('articles');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            loadUserData();
        }
    }, [userId]);

    const loadUserData = async () => {
        if (!userId) return;

        setIsLoading(true);
        try {
            // Load user profile
            const userResponse = await followService.getUserById(userId);
            // console.log("UserReponse", userResponse.data)
            setUser(userResponse.data);

            // Load user's articles
            const articlesResponse = await articleService.getArticles({ author: userId });
            setArticles(articlesResponse.data);

            // Load followers and following
            dispatch(getFollowers(userId));
            dispatch(getFollowing(userId));
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">User not found</p>
            </div>
        );
    }

    // console.log("USER", user);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto px-4 py-12">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <img
                            src={user.avatar || '/default-avatar.png'}
                            alt={user.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                        />

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {user.name}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </p>
                                </div>
                                {user?._id && <FollowButton userId={user._id} />}
                            </div>

                            {user.bio && (
                                <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>
                            )}

                            {/* Stats */}
                            <div className="flex gap-6 mb-4">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {user.articlesCount || articles.length}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Articles</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {user.followersCount || followers.length}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {user.followingCount || following.length}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex flex-wrap gap-4">
                                {user.website && (
                                    <a
                                        href={user.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        <Globe className="w-4 h-4" />
                                        Website
                                    </a>
                                )}
                                {user.twitter && (
                                    <a
                                        href={`https://twitter.com/${user.twitter}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        <Twitter className="w-4 h-4" />
                                        Twitter
                                    </a>
                                )}
                                {user.github && (
                                    <a
                                        href={`https://github.com/${user.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        <Github className="w-4 h-4" />
                                        GitHub
                                    </a>
                                )}
                                {user.linkedin && (
                                    <a
                                        href={user.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('articles')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'articles'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            Articles ({articles.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('followers')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'followers'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            Followers ({followers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('following')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'following'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            Following ({following.length})
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'articles' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map((article) => (
                            <Link
                                key={article._id}
                                to={`/articles/${article.slug}`}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                            >
                                {article.coverImage && (
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                        <div className="flex gap-3">
                                            <span>❤️ {article.likesCount}</span>
                                            <span>👁️ {article.views}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {activeTab === 'followers' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {followers.map((follower) => (
                            <Link
                                key={follower._id}
                                to={`/users/${follower._id}`}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={follower.avatar || '/default-avatar.png'}
                                        alt={follower.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{follower.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {follower.bio || follower.email}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {activeTab === 'following' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {following.map((user) => (
                            <Link
                                key={user._id}
                                to={`/users/${user._id}`}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={user.avatar || '/default-avatar.png'}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{user.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {user.bio || user.email}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;