import { ApiError } from '@/utils/apiError';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const api: AxiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add token to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError<any>) => {
        if (error.response) {
            const { status, data } = error.response;

            const message = data?.message || "Request failed";
            const errors = data?.errors || [];

            if (status === 401) {
                localStorage.removeItem("token");
            }

            return Promise.reject(
                new ApiError(message, status, errors)
            );
        }

        // Network error
        if (error.request) {
            return Promise.reject(
                new ApiError("Network error. Please check connection.")
            );
        }

        // Unknown error
        return Promise.reject(
            new ApiError(error.message)
        );
    }
);

export default api;