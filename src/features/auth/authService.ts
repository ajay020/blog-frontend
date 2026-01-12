import api from "../../api/axios";
import { User } from "../../types/auth";
import { BookmarkedPost } from "../../types/post";

const USERS_URL = "/users";

/**
 * Register user
 */
export const register = async (
    userData: { name: string; email: string; password: string, confirmPassword: string }
): Promise<User> => {
    const { data } = await api.post(`${USERS_URL}/register`, userData);
    const user = data.data as User;
    // console.log("Registered user data:", data);

    if (user?.token) {
        localStorage.setItem("user", JSON.stringify(user));
    }
    return user;
};

/**
 * Login user
 */
export const login = async (
    userData: { email: string; password: string }
): Promise<User> => {
    const { data } = await api.post(`${USERS_URL}/login`, userData);
    const user = data.data as User;

    console.log("Login user data:", user);

    if (user?.token) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    return user;
};

/**
 * Logout
 */
export const logout = () => {
    localStorage.removeItem("user");
};

const getBookmarkedPosts = async (): Promise<BookmarkedPost[]> => {
    const { data } = await api.get(`${USERS_URL}/bookmark-posts`);

    console.log("Fetched bookmarked posts:", data);

    return data;
}

const authService = {
    register,
    login,
    logout,
    getBookmarkedPosts
};

export default authService;
