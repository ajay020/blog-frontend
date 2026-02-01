import React from 'react';
import { Link } from 'react-router-dom';
import * as HoverCard from '@radix-ui/react-hover-card';
import FollowButton from './FollowButton';

interface Author {
    _id: string;
    name: string;
    avatar?: string;
    bio?: string;
    followersCount?: number;
    articlesCount?: number;
}

interface AuthorHoverCardProps {
    author: Author;
    children: React.ReactNode;
}

const AuthorHoverCard: React.FC<AuthorHoverCardProps> = ({ author, children }) => {
    return (
        <HoverCard.Root openDelay={200} closeDelay={100}>
            <HoverCard.Trigger asChild>
                {children}
            </HoverCard.Trigger>

            <HoverCard.Portal>
                <HoverCard.Content
                    className="z-50 w-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-xl animate-in fade-in-0 zoom-in-95"
                    sideOffset={5}
                >
                    <div className="flex flex-col gap-4">
                        {/* Author Header */}
                        <div className="flex items-start justify-between gap-4">
                            <Link
                                to={`/users/${author._id}`}
                                className="flex items-center gap-3 group"
                            >
                                <img
                                    src={author.avatar || '/default-avatar.png'}
                                    alt={author.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 transition-colors"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {author.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {author.followersCount || 0} followers
                                    </p>
                                </div>
                            </Link>

                            <FollowButton
                                userId={author._id}
                                className="shrink-0"
                            />
                        </div>

                        {/* Bio */}
                        {author.bio && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                                {author.bio}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                            <span>{author.articlesCount || 0} articles</span>
                            <span>•</span>
                            <span>{author.followersCount || 0} followers</span>
                        </div>
                    </div>

                    <HoverCard.Arrow className="fill-white dark:fill-gray-800" />
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    );
};

export default AuthorHoverCard;