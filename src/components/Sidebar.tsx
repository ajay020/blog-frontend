import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Bookmark,
    User,
    Users,
    FileText,
    Settings,
    Bell,
    TrendingUp,
    Hash,
    X,
    Book,
} from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { selectUser } from '@/features/auth/authSlice';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}   

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useAppSelector(selectUser);


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
            requireAuth: true,
        },
        {
            icon: TrendingUp,
            label: 'Dashboard',
            path: '/dashboard',
            requireAuth: true,
        },
        // {
        //     icon: Users,
        //     label: 'Following',
        //     path: '/following',
        //     requireAuth: true,
        // },
    ];

    const bottomItems = [
        {
            icon: User,
            label: 'Profile',
            path: currentUser ? `/users/${currentUser._id}` : '/login',
            requireAuth: true,
        },
        {
            icon: Settings,
            label: 'Settings',
            path: '/settings',
            requireAuth: true,
        },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    // Filter menu items based on auth
    const filteredMenuItems = menuItems.filter(
        (item) => !item.requireAuth || currentUser
    );
    const filteredBottomItems = bottomItems.filter(
        (item) => !item.requireAuth || currentUser
    );

    return (
        <>
            {/* Overlay - only visible on mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar - z-40 (below navbar which is z-50) */}
            <aside
                className={`
                    fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 
                    border-r border-gray-200 dark:border-gray-800 
                    z-40 transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Header - Mobile only */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 lg:hidden">
                        <Link to="/" className="flex items-center gap-2" onClick={onClose}>
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">B</span>
                            </div>
                            <span className="font-bold text-xl text-gray-900 dark:text-white">
                                Blog
                            </span>
                        </Link>

                        {/* Close button (mobile only) */}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X size={20} className="text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto p-2">
                        <ul className="space-y-1">
                            {filteredMenuItems.map((item) => {
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
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }
                                            `}
                                        >
                                            <Icon size={20} />
                                            <span className="font-medium">{item.label}</span>

                                            {/* Active indicator */}
                                            {active && (
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l" />
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Bottom Items */}
                    <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                        <ul className="space-y-1">
                            {filteredBottomItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <li key={item.path}>
                                        <button
                                            onClick={() => handleNavigation(item.path)}
                                            className={`
                                                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
                                                transition-colors
                                                ${active
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
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
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;