import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login, clearError, selectAuth } from '../features/auth/authSlice';
import Button from '../components/UI/Button';
import ErrorBanner from '@/components/common/ErrorBanner';
import FormInput from '@/components/form/form-input';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '@/schemas/authSchemas';

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useAppSelector(selectAuth);

    const methods = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });
    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (isAuthenticated) {
            reset();
            navigate('/');
        }
    }, [isAuthenticated, navigate, reset]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const submitHandler = async (data: LoginFormData) => {
        await dispatch(
            login(data)
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
                    Sign In
                </h1>

                {error && (<ErrorBanner message={error} />)}

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                        <FormInput
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                        />

                        <FormInput
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>
                </FormProvider>

                <div className="mt-4 text-center">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Forgot password?
                    </Link>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?
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

