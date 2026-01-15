import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, selectTheme } from '../features/theme/themeSlice';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon size={18} className='text-slate-900' />
            ) : (
                <Sun size={18} className='text-yellow-300' />
            )}
        </button>
    );
};

export default ThemeToggle;