import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { useState } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isCollapse, setIsCollapse] = useState(true);

  const onSuccess = (res) => {
    console.log("Logout made successfully ");
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
    setIsCollapse(!isCollapse);
  };

  return (
    <nav className="bg-slate-900 border-b border-gray-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-red-500 hover:text-red-400">
              Blog App
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            {user && (
              <>
                <Link to="/bookmarked-posts" className="hover:text-gray-300">Bookmarks</Link>
                <Link to="/addPost" className="hover:text-gray-300">Create Post</Link>
              </>
            )}
          </div>

          {/* Auth Actions */}
          <div className="flex space-x-4">
            {user ? (
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/register" className="hover:text-gray-300">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
