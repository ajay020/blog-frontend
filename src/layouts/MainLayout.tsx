import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '@/components/Sidebar';

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Navbar - stays on top with z-50 */}
            <Navbar onMenuClick={toggleSidebar} />

            {/* Main Container - below navbar */}
            <div className="flex pt-16">
                {/* Sidebar - below navbar with z-30 */}
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

                {/* Main Content */}
                <main className="flex-1 min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;