import { useAppDispatch } from '@/app/hooks';
import ArticleEditor from '@/components/ArticleEditor';
import { createNewPost } from '@/features/post/postSlice';
import React, { useState } from 'react'

const CreateArticle = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState<any>(null);
    const dispatch = useAppDispatch()

    const handlePublish = () => {
        if (!title || !content) return;



        dispatch(
            createNewPost({
                title,
                content,
                published: true,
            })
        );
    };

    return (
        // <MediumEditor />
        <div className="mx-auto max-w-3xl py-10">

            {/* ✅ Editor only here */}
            <ArticleEditor />

        </div>
    );
};

export default CreateArticle