export interface Post {
    _id: string;
    title: string;
    content: string;
    author?: string;
    createdAt?: string;
    updatedAt?: string;
    upvotes?: number;
    image?: {
        url: string;
    };
    comments: Comment[];
}

export interface Comment {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    text: string;
    createdAt?: string;
}


export interface PostState {
    posts: Post[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    page: number;
    hasMore: boolean;
}   