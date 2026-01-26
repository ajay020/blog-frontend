// src/features/comments/commentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '../../services/comment.service';
import { Comment, CommentState, CreateCommentData } from '../../types/comment.types';
import type { RootState } from '../../app/store';

const initialState: CommentState = {
    comments: [],
    isLoading: false,
    error: null,
};

// Get comments for an article
export const getComments = createAsyncThunk(
    'comments/getComments',
    async (articleId: string, { rejectWithValue }) => {
        try {
            const response = await commentService.getComments(articleId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch comments');
        }
    }
);

// Create a comment
export const createComment = createAsyncThunk(
    'comments/createComment',
    async (
        { articleId, data }: { articleId: string; data: CreateCommentData },
        { rejectWithValue }
    ) => {
        try {
            const response = await commentService.createComment(articleId, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create comment');
        }
    }
);

// Update a comment
export const updateComment = createAsyncThunk(
    'comments/updateComment',
    async (
        { commentId, content }: { commentId: string; content: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await commentService.updateComment(commentId, content);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update comment');
        }
    }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async (commentId: string, { rejectWithValue }) => {
        try {
            await commentService.deleteComment(commentId);
            return commentId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete comment');
        }
    }
);

// Toggle comment like
export const toggleCommentLike = createAsyncThunk(
    'comments/toggleCommentLike',
    async (commentId: string, { rejectWithValue }) => {
        try {
            const response = await commentService.toggleCommentLike(commentId);
            return { commentId, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to toggle like');
        }
    }
);

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearComments: (state) => {
            state.comments = [];
        },
        clearError: (state) => {
            state.error = null;
        },
        // Optimistic update for comment
        optimisticUpdateComment: (state, action: { payload: { commentId: string; content: string } }) => {
            const comment = findCommentById(state.comments, action.payload.commentId);
            if (comment) {
                comment.content = action.payload.content;
                comment.updatedAt = new Date().toISOString();
            }
        },
        // Optimistic delete for comment
        optimisticDeleteComment: (state, action: { payload: string }) => {
            const comment = findCommentById(state.comments, action.payload);
            if (comment) {
                comment.isDeleted = true;
                comment.content = '[Comment deleted]';
            }
        },
        // Revert optimistic update on error
        revertComment: (state, action: { payload: Comment }) => {
            const comment = findCommentById(state.comments, action.payload._id);
            if (comment) {
                Object.assign(comment, action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        // Get Comments
        builder
            .addCase(getComments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments = action.payload;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create Comment
        builder
            .addCase(createComment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.isLoading = false;

                // If it's a reply, add to parent's replies
                if (action.payload.parentComment) {
                    const parent = findCommentById(state.comments, action.payload.parentComment);
                    if (parent) {
                        if (!parent.replies) parent.replies = [];
                        parent.replies.push(action.payload);
                    }
                } else {
                    // Add as top-level comment
                    state.comments.unshift(action.payload);
                }
            })
            .addCase(createComment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update Comment - Only handle errors (optimistic update already done)
        builder
            .addCase(updateComment.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        // Delete Comment - Only handle errors (optimistic update already done)
        builder
            .addCase(deleteComment.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        // Toggle Comment Like
        builder
            .addCase(toggleCommentLike.fulfilled, (state, action) => {
                const { commentId, likesCount } = action.payload;
                const comment = findCommentById(state.comments, commentId);
                if (comment) {
                    comment.likesCount = likesCount;
                }
            });
    },
});

// Helper function to find comment by ID (including nested replies)
function findCommentById(comments: Comment[], id: string): Comment | null {
    for (const comment of comments) {
        if (comment._id === id) return comment;
        if (comment.replies) {
            const found = findCommentById(comment.replies, id);
            if (found) return found;
        }
    }
    return null;
}

export const {
    clearComments,
    clearError,
    optimisticUpdateComment,
    optimisticDeleteComment,
    revertComment,
} = commentSlice.actions;

// Selectors
export const selectComments = (state: RootState) => state.comments.comments;
export const selectCommentsLoading = (state: RootState) => state.comments.isLoading;
export const selectCommentsError = (state: RootState) => state.comments.error;

export default commentSlice.reducer;