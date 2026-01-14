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
    bookmarked?: boolean;
}

export interface BookmarkedPost {
    _id: string;
    author: {
        _id: string;
        name: string;
    };
    title: string;
    createdAt: string;
}

export interface Comment {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    text: string;
    optimistic?: boolean;
    createdAt?: string;
    isEditing?: boolean;
}


export interface PostState {
    posts: Post[];
    selectedPost?: Post | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    deleteStatus: "idle" | "loading" | "succeeded" | "failed";
    updateStatus: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    page: number;
    hasMore: boolean;
}   