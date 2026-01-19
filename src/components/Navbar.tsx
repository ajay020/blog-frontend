import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { logoutUser, resetStatus } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import PostModal from "./post/post-modal";
import { LogOut, Settings, UserCircle, UserCircle2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isModelOpen, setIsModelOpen] = useState(false);
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
    dispatch(logoutUser());
    dispatch(resetStatus());
    navigate("/");
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
            <div className="flex space-x-4">

              <ThemeToggle />

              {user ? (
                <>
                  {/* <button
                    className="flex gap-2 items-center border rounded-xl px-2 py-1 hover:text-gray-300"
                    onClick={() => setIsModelOpen(true)}
                  >
                    <LucidePencil size={14} /> Write
                  </button> */}

                  <Link
                    className="flex gap-2 items-center border rounded-xl px-2 py-1 hover:text-gray-300"
                    to="/article/new" >Write</Link>

                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className=" hover:text-gray-300 px-3 py-1 rounded"
                  >
                    <UserCircle size={28} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-gray-300">Login</Link>
                  <Link to="/register" className="hover:text-gray-300">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
        {
          isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute py-2 right-2 top-full bg-white  dark:bg-slate-800 w-48 ring-1 ring-black/20 z-50">
              {/* Profile header */}
              <div className="flex gap-3 py-3 px-4 items-center border-b border-slate-600">
                <UserCircle2 className="text-gray-900 dark:text-white" size={28} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Menu items */}
              <ul className="flex flex-col py-2">
                <li>
                  <button className="flex items-center gap-2 w-full 
                  px-4 py-2 text-sm dark:text-white text-slate-900 dark:hover:text-slate-200 hover:text-slate-950 rounded-md">
                    <Settings size={16} />
                    Settings
                  </button>
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
      <PostModal isOpen={isModelOpen} onClose={() => { setIsModelOpen(false) }} />
    </>
  );
};

export default Navbar;


