import api from "../../api/axios";
import { User } from "../../types/auth";
import { Post } from "../../types/post";

const USERS_URL = "/users";

/**
 * Register user
 */
export const register = async (
    userData: { name: string; email: string; password: string, confirmPassword: string }
): Promise<User> => {
    const { data } = await api.post(`${USERS_URL}/register`, userData);
    console.log("Registered user data:", data);
    if (data?.token) {
        localStorage.setItem("user", JSON.stringify(data));
    }
    return data;
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
    console.log("Loging TOKEN:", user.token);


    if (user?.token) {
        localStorage.setItem("user", JSON.stringify(user));
        console.log("User saved to localStorage:", user);
    }

    return user;
};

/**
 * Bookmark post
 */
export const bookmarkPost = async (postId: string): Promise<Post> => {
    const { data } = await api.post(`${USERS_URL}/bookmark-post`, { postId });
    return data;

};

/**
 * Get bookmarked posts
 */
export const getBookmarkedPosts = async (): Promise<Post[]> => {
    const { data } = await api.get(`${USERS_URL}/get-bookmark-posts`);
    return data;
};

/**
 * Logout
 */
export const logout = () => {
    localStorage.removeItem("user");
};

const authService = {
    register,
    login,
    logout,
    bookmarkPost,
    getBookmarkedPosts,
};

export default authService;
