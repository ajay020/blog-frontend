// src/components/ArticleSearch.tsx
import { useState, FormEvent } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { getArticles } from '@/features/articles/articleSlice';

const ArticleSearch = () => {
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const dispatch = useAppDispatch();

    const tags = ['javascript', 'react', 'typescript', 'nodejs', 'css'];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(getArticles({ search, tag: selectedTag, page: 1 }));
    };

    return (
        <div className="mb-8">
            <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />

                <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                    <option value="">All Tags</option>
                    {tags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Search
                </button>
            </form>
        </div>
    );
};

export default ArticleSearch;