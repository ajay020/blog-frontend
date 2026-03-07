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
        console.log("API RESPONSE: ", response);
        return response;
    },
    (error: AxiosError<any>) => {
        const status = error.response?.status;
        const data = error.response?.data;

        // Handle 401 Unauthorized
        // if (status === 401) {
        //     localStorage.removeItem('token');
        //     localStorage.removeItem('user');
        //     window.location.href = '/login';
        // }

        console.log("API_ERROR: ", error.response?.data)

        // Capture both general error and field-level errors
        const formattedError = {
            message: data?.message || 'An error occurred',
            errors: data?.errors || []
        };

        return Promise.reject(formattedError);
    }
);

export default api;