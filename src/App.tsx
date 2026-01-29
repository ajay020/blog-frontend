import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { getMe, selectIsAuthenticated, logout, selectUser, } from './features/auth/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateArticle from './pages/CreateArticle';
import Profile from './pages/Profile';
import Login from './pages/Login';
import ArticleDetail from './pages/ArticleDetail';
import EditArticle from './pages/EditArticle';
import Articles from './pages/Articles';
import PageNotFound from './pages/PageNotFound';
import Navbar from './components/Navbar';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import Bookmarks from './pages/bookmarks';

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
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/users/:userId" element={<UserProfile />} />
                        <Route path="/bookmarks" element={<Bookmarks />} />

                    </Route>
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
