import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { getMe, selectIsAuthenticated, } from './features/auth/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateArticle from './pages/CreateArticle';
import Profile from './pages/Profile';
import Login from './pages/Login';
import ArticleDetail from './pages/ArticleDetail';
import EditArticle from './pages/EditArticle';
import PageNotFound from './pages/PageNotFound';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import Bookmarks from './pages/bookmarks';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import Following from './pages/Following';
import Notifications from './pages/Notifications';

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
            <Routes>
                {/* Main Layout Routes */}
                <Route element={<MainLayout />}>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/articles/:slug" element={<ArticleDetail />} />
                    <Route path="/users/:userId" element={<UserProfile />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/following" element={<Following />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/create-article" element={<CreateArticle />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/bookmarks" element={<Bookmarks />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute />}>
                    {/* Additional Protected Routes outside MainLayout */}
                    <Route path="/write" element={<CreateArticle />} />
                    <Route path="/edit-article/:id" element={<EditArticle />} />
                </Route>

                {/* Auth Routes - no layout */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Page not found */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
