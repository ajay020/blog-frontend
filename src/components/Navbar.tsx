import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import { LogOut, Settings, UserCircle2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { selectIsAuthenticated, logout } from "@/features/auth/authSice2";

const Navbar = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  //  Close menu when clicking outside
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false)
  };

  return (
    <>
      <nav className="relative bg-white dark:bg-slate-900 border-b border-gray-700 text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo / Brand */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold text-red-500 hover:text-red-400">
                Blog App
              </Link>
            </div>

            {/* Auth Actions */}
            <div className="flex items-center space-x-4">



              {isAuthenticated ? (
                <>
                  <Link
                    className="flex gap-2 items-center border rounded-xl px-2 py-1 hover:text-gray-300"
                    to="/create-article" >Write</Link>

                  <Link to="/dashboard">Dashboard</Link>

                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className=" hover:text-gray-300 px-3 py-1 rounded"
                  >
                    <img
                      src={user?.avatar || 'default-avatar.png'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border-2 hover:border-gray-400"
                    />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-gray-300">Login</Link>
                  <Link to="/register" className="hover:text-gray-300">Register</Link>
                </>
              )}

              <ThemeToggle />
            </div>
          </div>
        </div>
        {
          isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute py-2 right-2 top-full bg-white  dark:bg-slate-800 w-48 ring-1 ring-black/20 z-50">
              {/* Profile header */}
              <Link to={"/profile"}>
                <div className="flex gap-3 py-3 px-4 items-center border-b border-slate-600">
                  <UserCircle2 className="text-gray-900 dark:text-white" size={28} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">view profile</p>
                  </div>
                </div>
              </Link>

              {/* Menu items */}
              <ul className="flex flex-col py-2">
                <li>
                  <Link to="/settings" className="flex items-center gap-2 w-full 
                  px-4 py-2 text-sm dark:text-white text-slate-900 dark:hover:text-slate-200 hover:text-slate-950 rounded-md">
                    <Settings size={16} />
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 w-full px-4 py-2
                     text-sm text-red-400 hover:text-red-500 rounded-md"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )
        }
      </nav>
    </>
  );
};

export default Navbar;


