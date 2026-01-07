import axios from 'axios';
import { handleApiError } from '../../api/handleApiError';
import api from '../../api/axios';

const POSTS_URL = "/posts";

const delay = ms => new Promise(res => setTimeout(res, ms));

export const getPosts = async (page = 1, limit = 10) => {
    try {
        await delay(500); //simulate network delay
        const { data } = await api.get(`${POSTS_URL}?page=${page}&limit=${limit}`);
        return data;
    } catch (error) {
        handleApiError(error);
    }
};

export const createPost = async (postData) => {
    try {
        const { data } = await api.post(POSTS_URL, postData);
        return data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updatePost = async (postId, postData) => {
    try {
        const { data } = await api.patch(`${POSTS_URL}/${postId}`, postData);
        return data;
    } catch (error) {
        handleApiError(error);
    }
};

export const deletePost = async (postId) => {
    try {
        const { data } = await api.delete(`${POSTS_URL}/${postId}`);
        return data;
    } catch (error) {
        handleApiError(error);
    }
};

export const upvotePost = async (postId) => {
    try {
        const { data } = await api.post(`${POSTS_URL}/${postId}/upvote`);
        return data;
    } catch (error) {
        handleApiError(error);
    }
};

const postService = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    upvotePost
}

export default postService;