import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Bookmark,
    TrendingUp,
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            icon: Home,
            label: 'Home',
            path: '/',
        },
        {
            icon: Bookmark,
            label: 'Bookmarks',
            path: '/bookmarks',
        },
        {
            icon: TrendingUp,
            label: 'Dashboard',
            path: '/dashboard',
        }
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Overlay - only visible on mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 
                    border-r border-gray-200 dark:border-gray-800 
                    z-40 transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                  lg:top-16 lg:h-[calc(100vh-4rem)]
                `}
            >
                <div className="flex flex-col h-full">
                    <nav className="flex-1 overflow-y-auto p-2">
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <li key={item.path}>
                                        <button
                                            onClick={() => handleNavigation(item.path)}
                                            className={`
                                                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
                                                transition-colors relative
                                                ${active
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }
                                            `}
                                        >
                                            <Icon size={20} />
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;