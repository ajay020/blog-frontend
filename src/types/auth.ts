import { BookmarkedPost, Post } from "./post";

export interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
    bookmarkedPosts?: Post[];
}

export interface AuthState {
    user: User | null;
    bookmarks: BookmarkedPost[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}
