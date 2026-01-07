import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// attach token automatically
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user?.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
