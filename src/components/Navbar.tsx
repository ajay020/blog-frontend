import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import { LogOut, Settings, UserCircle2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { selectIsAuthenticated, logout } from "@/features/auth/authSlice";

// const Navbar = () => {
//   const isAuthenticated = useAppSelector(selectIsAuthenticated);
//   const dispatch = useAppDispatch();
//   const { user } = useAppSelector((state: RootState) => state.auth);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   //  Close menu when clicking outside
//   useEffect(() => {

//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const onLogout = () => {
//     dispatch(logout());
//     setIsMenuOpen(false)
//   };

//   return (
//     <>
//       <nav className="relative bg-white dark:bg-slate-900 border-b border-gray-700 text-gray-900 dark:text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">

//             {/* Logo / Brand */}
//             <div className="flex-shrink-0">
//               <Link to="/" className="text-xl font-bold text-red-500 hover:text-red-400">
//                 Blog App
//               </Link>
//             </div>

//             {/* Auth Actions */}
//             <div className="flex items-center space-x-4">

//               {isAuthenticated ? (
//                 <>
//                   <Link
//                     className="flex gap-2 items-center border
//                     rounded-xl px-2 py-1 hover:text-gray-300"
//                     to="/create-article" >Write</Link>

//                   <Link to="/dashboard">Dashboard</Link>

//                   <button
//                     onClick={() => setIsMenuOpen(!isMenuOpen)}
//                     className=" hover:text-gray-300 px-3 py-1 rounded"
//                   >
//                     <img
//                       src={user?.avatar || 'default-avatar.png'}
//                       alt={user?.name}
//                       className="w-8 h-8 rounded-full object-cover border-2 hover:border-gray-400"
//                     />
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/login" className="hover:text-gray-300">Login</Link>
//                   <Link to="/register" className="hover:text-gray-300">Register</Link>
//                 </>
//               )}

//               <ThemeToggle />
//             </div>
//           </div>
//         </div>
//         {
//           isMenuOpen && (
//             <div
//               ref={menuRef}
//               className="absolute py-2 right-2 top-full bg-white  dark:bg-slate-800 w-48 ring-1 ring-black/20 z-50">
//               {/* Profile header */}
//               <Link to={"/profile"}>
//                 <div className="flex gap-3 py-3 px-4 items-center border-b border-slate-600">
//                   <UserCircle2 className="text-gray-900 dark:text-white" size={28} />
//                   <div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
//                     <p className="text-xs text-slate-400 truncate">view profile</p>
//                   </div>
//                 </div>
//               </Link>

//               {/* Menu items */}
//               <ul className="flex flex-col py-2">
//                 <li>
//                   <Link to="/settings" className="flex items-center gap-2 w-full 
//                   px-4 py-2 text-sm dark:text-white text-slate-900 dark:hover:text-slate-200 hover:text-slate-950 rounded-md">
//                     <Settings size={16} />
//                     Settings
//                   </Link>
//                 </li>
//                 <li>
//                   <button
//                     onClick={onLogout}
//                     className="flex items-center gap-2 w-full px-4 py-2
//                      text-sm text-red-400 hover:text-red-500 rounded-md"
//                   >
//                     <LogOut size={16} />
//                     Logout
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           )
//         }
//       </nav>
//     </>
//   );
// };

// components/Navbar.tsx
import React from 'react';
import { Menu, Search, Bell, PenSquare } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  // const currentUser = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { user } = useAppSelector((state: RootState) => state.auth);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Menu Button (Mobile) */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} className="text-gray-700 dark:text-gray-300" />
          </button>

          {/* Logo (visible on mobile when sidebar is hidden) */}
          <Link
            to="/"
            className=" flex items-center gap-2"
          >
            <div className="rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">Blog</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 w-64">
            <Search size={18} className="text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search Icon (Mobile) */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Search size={20} className="text-gray-700 dark:text-gray-300" />
          </button>

          {isAuthenticated ? (
            <>
              {/* Write Button */}
              <Link
                to="/write"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
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

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell size={20} className="text-gray-700 dark:text-gray-300" />
                {/* Notification Badge */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <Link
                to={`/users/${user?._id}`}
                className="flex items-center gap-2"
              >
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              </Link>
            </>
          ) : (
            <>
              {/* Login/Signup for guests */}
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