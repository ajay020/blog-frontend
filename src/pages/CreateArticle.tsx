import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createArticle, selectArticlesLoading } from '../features/articles/articleSlice';
import ArticleEditor from '../components/ArticleEditor';
import { CreateArticleData } from '@/types/article.types';
import React from 'react';

const CreateArticle = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLoading = useAppSelector(selectArticlesLoading);

    const handleSave = async (articleData: CreateArticleData) => {
        console.log('Sending article data:', articleData);

        const result = await dispatch(
            createArticle({
                title: articleData.title,
                content: articleData.content,
                coverImage: articleData.coverImage,
                status: articleData.status,
                tags: articleData.tags,
            })
        );

        if (createArticle.fulfilled.match(result)) {
            if (articleData.status === 'published') {
                navigate(`/articles/${result.payload.slug}`);
            } else {
                // Navigate to dashboard if saved as draft
                navigate('/dashboard');
            }
        }
    };

    return (
        <div>
            <ArticleEditor onSave={handleSave} isLoading={isLoading} />
        </div>
    );
};

export default CreateArticle;