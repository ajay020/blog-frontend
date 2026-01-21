import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import followService from '../../services/follow.service';
import { FollowUser } from '../../types/follow.types';
import type { RootState } from '../../app/store';

interface FollowState {
    followers: FollowUser[];
    following: FollowUser[];
    isFollowing: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: FollowState = {
    followers: [],
    following: [],
    isFollowing: false,
    isLoading: false,
    error: null,
};

// Follow user
export const followUser = createAsyncThunk(
    'follow/followUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await followService.followUser(userId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to follow user');
        }
    }
);

// Unfollow user
export const unfollowUser = createAsyncThunk(
    'follow/unfollowUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await followService.unfollowUser(userId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to unfollow user');
        }
    }
);

// Get followers
export const getFollowers = createAsyncThunk(
    'follow/getFollowers',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await followService.getFollowers(userId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get followers');
        }
    }
);

// Get following
export const getFollowing = createAsyncThunk(
    'follow/getFollowing',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await followService.getFollowing(userId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get following');
        }
    }
);

// Check if following
export const checkIsFollowing = createAsyncThunk(
    'follow/checkIsFollowing',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await followService.isFollowing(userId);
            return response.data.isFollowing;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to check follow status');
        }
    }
);

const followSlice = createSlice({
    name: 'follow',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearFollowData: (state) => {
            state.followers = [];
            state.following = [];
            state.isFollowing = false;
        },
    },
    extraReducers: (builder) => {
        // Follow User
        builder
            .addCase(followUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(followUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isFollowing = true;
            })
            .addCase(followUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Unfollow User
        builder
            .addCase(unfollowUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(unfollowUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isFollowing = false;
            })
            .addCase(unfollowUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Get Followers
        builder
            .addCase(getFollowers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFollowers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.followers = action.payload;
            })
            .addCase(getFollowers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Get Following
        builder
            .addCase(getFollowing.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFollowing.fulfilled, (state, action) => {
                state.isLoading = false;
                state.following = action.payload;
            })
            .addCase(getFollowing.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Check Is Following
        builder
            .addCase(checkIsFollowing.pending, (state) => {
                state.error = null;
            })
            .addCase(checkIsFollowing.fulfilled, (state, action) => {
                state.isFollowing = action.payload;
            })
            .addCase(checkIsFollowing.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearFollowData } = followSlice.actions;

// Selectors
export const selectFollowers = (state: RootState) => state.follow.followers;
export const selectFollowing = (state: RootState) => state.follow.following;
export const selectIsFollowing = (state: RootState) => state.follow.isFollowing;
export const selectFollowLoading = (state: RootState) => state.follow.isLoading;
export const selectFollowError = (state: RootState) => state.follow.error;

export default followSlice.reducer;