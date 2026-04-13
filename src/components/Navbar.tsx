import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import ThemeToggle from "./ThemeToggle";
import { selectIsAuthenticated, logout } from "@/features/auth/authSlice";

import React from 'react';
import { Menu, PenSquare } from 'lucide-react';
import ArticleSearch from "./article/ArticleSearch";
import ProfileHoverCard from "./ProfileHoverCard";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { user } = useAppSelector((state: RootState) => state.auth);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16
     bg-white dark:bg-gray-900 border-b border-gray-200
      dark:border-gray-800 z-50">
      <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Menu Button (Mobile) */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100
             dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} className="text-gray-700 dark:text-gray-300" />
          </button>

          {/* Logo (visible on mobile when sidebar is hidden) */}
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <div className="rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm md:text-lg">Blog</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex items-center">
            <ArticleSearch />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Icon (Mobile) */}
          <div className="w-30 rounded-full md:hidden">
            <ArticleSearch />
          </div>

          {isAuthenticated ? (
            <>
              {/* Write Button */}
              <Link
                to="/write"
                className="hidden sm:flex items-center gap-2
                 px-4 py-2 bg-blue-600 text-white rounded-full
                  hover:bg-blue-700 transition-colors"
              >
                <PenSquare size={18} />
                <span className="font-medium">Write</span>
              </Link>

              {/* Write Icon (Mobile) */}
              <Link
                to="/write"
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <PenSquare size={20} className="text-gray-700 dark:text-gray-300" />
              </Link>

              {/* Theme */}
              <button className="md:block relative p-2 rounded-lg
               hover:bg-gray-100 dark:hover:bg-gray-800">
                <ThemeToggle />
              </button>

              {/* Profile */}
              <ProfileHoverCard />
              {/* <Link
                to={`/users/${user?._id}`}
                className="flex items-center gap-2"
              >
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border-2
                   border-gray-200 dark:border-gray-700"
                />
              </Link> */}
            </>
          ) : (
            <>
              {/* Login/Signup */}
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;