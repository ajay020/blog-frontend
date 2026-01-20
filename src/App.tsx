import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { getMe, selectIsAuthenticated, logout, selectUser, } from './features/auth/authSice2';
import ProtectedRoute from './components/ProtectedRoute';
import { Link } from 'react-router-dom';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateArticle from './pages/CreateArticle';
import Profile from './pages/Profile';
import ThemeToggle from './components/ThemeToggle';
import Login from './pages/Login';
import ArticleDetail from './pages/ArticleDetail';
import EditArticle from './pages/EditArticle';
import Articles from './pages/Articles';
import PageNotFound from './pages/PageNotFound';

function App() {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    // Check if user is authenticated on app load
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getMe());
        }
    }, [dispatch, isAuthenticated]);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/articles/:slug" element={<ArticleDetail />} />
                    <Route path="/" element={<Articles />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/edit-article/:id" element={<EditArticle />} />
                        <Route path="/create-article" element={<CreateArticle />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;


const Navbar = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
                <Link to="/" className="text-xl font-bold">My Blog</Link>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/create-article">Write</Link>
                            <div className="flex items-center gap-2">
                                <img
                                    src={user?.avatar || 'default-avatar.png'}
                                    alt={user?.name}
                                    className="w-8 h-8 rounded-full"
                                />
                                <span>{user?.name}</span>
                            </div>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Sign Up</Link>
                        </>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
};
