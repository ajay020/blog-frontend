import api from './api';
import {
    FollowResponse,
    FollowersResponse,
    IsFollowingResponse,
} from '../types/follow.types';
import { User } from '../types/auth.types';

class FollowService {
    // Follow a user
    async followUser(userId: string): Promise<FollowResponse> {
        const response = await api.put<FollowResponse>(`/users/${userId}/follow`);
        return response.data;
    }

    // Unfollow a user
    async unfollowUser(userId: string): Promise<FollowResponse> {
        const response = await api.put<FollowResponse>(`/users/${userId}/unfollow`);
        return response.data;
    }

    // Get user's followers
    async getFollowers(userId: string): Promise<FollowersResponse> {
        const response = await api.get<FollowersResponse>(`/users/${userId}/followers`);
        return response.data;
    }

    // Get user's following
    async getFollowing(userId: string): Promise<FollowersResponse> {
        const response = await api.get<FollowersResponse>(`/users/${userId}/following`);
        return response.data;
    }

    // Check if following a user
    async isFollowing(userId: string): Promise<IsFollowingResponse> {
        const response = await api.get<IsFollowingResponse>(`/users/${userId}/is-following`);
        return response.data;
    }

    // Get user by ID (public profile)
    async getUserById(userId: string): Promise<{ success: boolean; data: User }> {
        const response = await api.get<{ success: boolean; data: User }>(`/users/${userId}`);
        return response.data;
    }
}

export default new FollowService();