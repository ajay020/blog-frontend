import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login-old';
import PageNotFound from './pages/PageNotFound';
import PostDetails from './pages/PostDetails';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useEffect } from 'react';
import { fetchBookmarkedPosts } from './features/auth/authSlice';
import { selectTheme } from './features/theme/themeSlice';
import 'react-toastify/dist/ReactToastify.css';
import CreateArticle from './pages/NewArticle';

function App() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((s) => s.auth.user);
    const theme = useAppSelector(selectTheme);

    // Apply theme class to document on mount and when theme changes
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // fetch bookmarked posts
    useEffect(() => {
        if (user) {
            dispatch(fetchBookmarkedPosts());
        }
    }, [user, dispatch]);

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/article/new' element={<CreateArticle />} />
                <Route path='/articles/:id/edit' element={<CreateArticle />} />
                <Route path='/posts/:postId' element={<PostDetails />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <ToastContainer />
        </Router>
    );
}

export default App;