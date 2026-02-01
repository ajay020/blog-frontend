import { Link } from 'react-router-dom'
import FollowButton from './FollowButton'
import { Article } from '@/types/article.types'
import { format } from 'date-fns';
import AuthorHoverCard from './AuthorHoverCard';

interface AuthorInfoProps {
    article: Article;
    variant?: 'full' | 'minimal';
    className?: string;
    showHoverCard?: boolean;
}

function AuthorInfo({
    article,
    className,
    variant = 'minimal',
    showHoverCard = true
}: AuthorInfoProps) {
    const publishedAt = format(new Date(article.createdAt), 'MMM dd, yyyy');
    const author = article.author;

    // Author link content
    const AuthorLink = (
        <Link
            className="flex gap-2 items-center group"
            to={`/users/${author._id}`}
        >
            <img
                src={author.avatar || '/default-avatar.png'}
                alt={author.name}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 group-hover:border-gray-600 dark:group-hover:border-gray-400 transition-colors object-cover"
            />
            <p className=" text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:underline transition-colors">
                {author.name}
            </p>
        </Link>
    );

    // Wrap with hover card if enabled
    const AuthorContent = showHoverCard ? (
        <AuthorHoverCard author={author}>
            {AuthorLink}
        </AuthorHoverCard>
    ) : (
        AuthorLink
    );

    if (variant === 'full') {
        return (
            <div className={`flex items-center justify-start gap-4 mb-4 ${className}`}>
                {AuthorContent}
                <FollowButton
                    userId={author._id}
                    className="bg-transparent border border-gray-600 dark:border-gray-400 rounded-full px-3 py-1"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">{publishedAt}</p>
            </div>
        );
    }

    if (variant === 'minimal') {
        return (
            <div className={`flex items-center justify-start gap-4 mb-4 ${className}`}>
                {AuthorContent}
            </div>
        );
    }

    return null;
}

export default AuthorInfo