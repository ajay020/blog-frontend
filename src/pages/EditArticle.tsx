import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    getArticleById,
    updateArticle,
    selectCurrentArticle,
    selectArticlesLoading,
    clearCurrentArticle,
} from '../features/articles/articleSlice';
import ArticleEditor from '../components/ArticleEditor';
import { CreateArticleData } from '../types/article.types';

const EditArticle = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const article = useAppSelector(selectCurrentArticle);
    const isLoading = useAppSelector(selectArticlesLoading);

    useEffect(() => {
        if (id) {
            dispatch(getArticleById(id));
        }

        return () => {
            dispatch(clearCurrentArticle());
        };
    }, [id, dispatch]);

    const handleSave = async (articleData: CreateArticleData) => {
        if (!id) return;

        const result = await dispatch(
            updateArticle({
                id,
                data: {
                    title: articleData.title,
                    content: articleData.content,
                    coverImage: articleData.coverImage,
                },
            })
        );

        if (updateArticle.fulfilled.match(result)) {
            navigate(`/articles/${result.payload.slug}`);
        }
    };

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
        <div>
            <ArticleEditor
                initialData={article.content}
                initialTitle={article.title}
                initialCoverImage={article.coverImage}
                onSave={handleSave}
            />
        </div>
    );
};

export default EditArticle;