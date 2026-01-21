import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    getArticle,
    toggleLike,
    selectCurrentArticle,
    selectArticlesLoading,
    clearCurrentArticle,
} from '../features/articles/articleSlice';
import { selectUser } from '../features/auth/authSlice';
import ArticleRenderer from '../components/ArtileRenderer';

const ArticleDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useAppDispatch();
    const article = useAppSelector(selectCurrentArticle);
    const isLoading = useAppSelector(selectArticlesLoading);
    const user = useAppSelector(selectUser);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (slug) {
            dispatch(getArticle(slug));
        }

        return () => {
            dispatch(clearCurrentArticle());
        };
    }, [slug, dispatch]);

    useEffect(() => {
        if (article && user) {
            setIsLiked(article.likes.includes(user._id));
        }
    }, [article, user]);

    const handleLike = () => {
        if (article) {
            dispatch(toggleLike(article._id));
            setIsLiked(!isLiked);
        }
    };

    if (isLoading) {
        return <div>Loading article...</div>;
    }

    if (!article) {
        return <div>Article not found</div>;
    }

    // console.log("Article:", article)

    return (
        <div className=''>
            <ArticleRenderer
                title={article.title}
                coverImage={article.coverImage}
                data={article.content}
                article={article}
            />

            <div className="max-w-3xl mx-auto px-4 py-8">
                <button
                    onClick={handleLike}
                    disabled={!user}
                    className={`flex items-center gap-2 px-4 py-2 rounded ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    ❤️ {article.likesCount} Likes
                </button>
            </div>
        </div>
    );
};

export default ArticleDetail;