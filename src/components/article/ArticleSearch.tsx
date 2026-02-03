import { useState, FormEvent } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { getArticles } from '@/features/articles/articleSlice';
import { Search } from 'lucide-react';

const ArticleSearch = () => {
    const [search, setSearch] = useState('');
    const dispatch = useAppDispatch();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(getArticles({ search, page: 1 }));
    };

    return (
        <div className=" bg-gray-100 rounded-full">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="flex-1 px-4 py-2 
                     border-none outline-none
                     rounded-l-full
                     bg-gray-100
                      dark:bg-gray-800 text-gray-900 dark:text-white"
                />

                <button
                    type="submit"
                    className="px-2 py-2  text-white"
                >
                    <Search size={18} className="text-gray-500 dark:text-gray-400" />
                </button>
            </form>
        </div>
    );
};

export default ArticleSearch;