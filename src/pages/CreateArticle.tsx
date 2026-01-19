import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createArticle, selectArticlesLoading } from '../features/articles/articleSlice';
import ArticleEditor from '../components/ArticleEditor';
import { CreateArticleData } from '@/types/article.types';

const CreateArticle = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLoading = useAppSelector(selectArticlesLoading);

    const handleSave = async (articleData: CreateArticleData) => {
        console.log('Sending article data:', articleData);
        console.log('Content structure:', articleData.content);

        const result = await dispatch(
            createArticle({
                title: articleData.title,
                content: articleData.content,
                coverImage: articleData.coverImage,
                status: 'published',
                tags: [],
            })
        );

        if (createArticle.fulfilled.match(result)) {
            navigate(`/articles/${result.payload.slug}`);
        }
    };

    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <ArticleEditor onSave={handleSave} />
        </div>
    );
};

export default CreateArticle;