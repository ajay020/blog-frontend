export interface Post {
    _id: string;
    title: string;
    content?: string;
    image?: {
        url: string;
    };
    author: {
        _id: string;
        name: string;
    };
    upvotes: string[];
    comments: Comment[];
    createdAt: string;
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
    selectedPost?: Post;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    page: number;
    hasMore: boolean;
}   