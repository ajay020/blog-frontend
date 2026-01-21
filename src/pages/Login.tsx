// src/pages/Login.tsx
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login, clearError, selectAuth } from '../features/auth/authSlice';
import Input from '@/components/UI/Input';
import Button from '../components/UI/Button';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useAppSelector(selectAuth);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await dispatch(login(formData));

        if (login.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
                    Sign In
                </h1>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        autoComplete="email"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />

                    <Button type="submit" variant="primary" isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Forgot password?
                    </Link>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;