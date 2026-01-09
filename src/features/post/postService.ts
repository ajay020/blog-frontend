import api from '../../api/axios';
import { Comment, Post } from '../../types/post';

const POSTS_URL = "/posts";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getPosts = async (
    page = 1,
    limit = 10
): Promise<{ posts: Post[]; hasMore: boolean }> => {
    await delay(500); // Simulate network delay
    const { data } = await api.get(`${POSTS_URL}?page=${page}&limit=${limit}`);

    return data;
};

export const createPost = async (postData: Partial<Post>): Promise<Post> => {
    const { data } = await api.post<Post>(POSTS_URL, postData);
    return data;
};

export const updatePost = async (
    postId: string,
    postData: Partial<Post>
): Promise<Post> => {
    const { data } = await api.patch<Post>(`${POSTS_URL}/${postId}`, postData);
    return data;
};

export const deletePost = async (postId: string): Promise<{ id: string }> => {
    const { data } = await api.delete(`${POSTS_URL}/${postId}`);
    return data;
};

export const upvotePost = async (postId: string): Promise<Post> => {
    const { data } = await api.post<Post>(`${POSTS_URL}/upvote/${postId}`);
    return data;
};

export const addComment = async (
    postId: string,
    text: string
): Promise<Comment> => {
    const { data } = await api.post(`${POSTS_URL}/${postId}/comments`, { text });
    return data;
};

const deleteCommentApi = async ({
    postId,
    commentId,
}: {
    postId: string;
    commentId: string;
}) => {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
    return { postId, commentId };
};

const updateCommentApi = async ({
    postId,
    commentId,
    text,
}: {
    postId: string;
    commentId: string;
    text: string;
}) => {
    const { data } = await api.put(
        `${POSTS_URL}/${postId}/comments/${commentId}`,
        { text }
    );

    return {
        postId,
        commentId,
        text: data.text,
    }
};


const getPostById = async (postId: string): Promise<Post> => {
    const { data } = await api.get(`${POSTS_URL}/${postId}`);
    return data;
};

const postService = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    upvotePost,
    addComment,
    deleteCommentApi,
    updateCommentApi,
    getPostById
}

export default postService;