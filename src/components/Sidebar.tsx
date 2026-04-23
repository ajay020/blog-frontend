import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Bookmark,
    TrendingUp,
} from 'lucide-react';


function SidebarContent() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
        { icon: TrendingUp, label: 'Dashboard', path: '/dashboard' }
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="p-2">
            <ul className="space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <li key={item.path}>
                            <button
                                onClick={() => navigate(item.path)}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                    ${active
                                        ? 'text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                                `}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {

    return (
        <>
            <aside
                className={`
                hidden lg:block 
                transition-all duration-300
                ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}
                bg-white dark:bg-gray-900 
                border-r border-gray-200 dark:border-gray-800
                sticky top-16 h-[calc(100vh-4rem)]
            `}
            >
                {isOpen && <SidebarContent />}
            </aside>

            {/* Mobile Sidebar */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={onClose}
                    />

                    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-40
                     transform transition-transform duration-300">
                        <SidebarContent />
                    </aside>
                </>
            )}
        </>
    );
};

export default Sidebar;