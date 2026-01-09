import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import postService from './postService';
import { Comment, PostState } from '../../types/post';
import { Post } from '../../types/post';
import { RootState } from '../../app/store';

interface OptimisticUpvotePayload {
    postId: string;
    userId: string;
}

const initialState: PostState = {
    posts: [],
    status: "idle",
    error: null,
    page: 1,
    hasMore: true,
};

//fetch all posts
export const fetchPosts = createAsyncThunk<
    { posts: Post[]; hasMore: boolean },
    void,
    { rejectValue: string }
>("posts/fetchAll", async (_, thunkAPI) => {
    try {
        return await postService.getPosts(1);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const fetchMorePosts = createAsyncThunk<
    { posts: Post[]; hasMore: boolean },
    void,
    { state: any; rejectValue: string }
>("posts/fetchMore", async (_, thunkAPI) => {
    try {
        const { page } = thunkAPI.getState().post;
        return await postService.getPosts(page + 1);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const createNewPost = createAsyncThunk<
    Post,
    Partial<Post>,
    { rejectValue: string }
>("posts/create", async (postData, thunkAPI) => {
    try {
        return await postService.createPost(postData);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const updateExistingPost = createAsyncThunk<
    Post,
    { postId: string; postData: Partial<Post> },
    { rejectValue: string }
>("posts/update", async ({ postId, postData }, thunkAPI) => {
    try {
        return await postService.updatePost(postId, postData);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const deleteExistingPost = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("posts/delete", async (postId, thunkAPI) => {
    try {
        const response = await postService.deletePost(postId);
        return response.id;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const upvotePost = createAsyncThunk<
    Post,
    string,
    { rejectValue: string }
>("posts/upvote", async (postId, thunkAPI) => {
    try {
        return await postService.upvotePost(postId);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const addComment = createAsyncThunk<
    { postId: string; comment: Comment },
    { postId: string; text: string },
    { rejectValue: string }
>("posts/addComment", async ({ postId, text }, thunkAPI) => {
    try {
        const comment = await postService.addComment(postId, text);
        return { postId, comment };
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const deleteComment = createAsyncThunk<
    { postId: string; commentId: string },
    { postId: string; commentId: string },
    { rejectValue: string }
>
    (
        "posts/deleteComment",
        async ({ postId, commentId }, thunkAPI) => {
            try {
                await postService.deleteCommentApi({ postId, commentId });
                return { postId, commentId };
            } catch (error: any) {
                throw thunkAPI.rejectWithValue(error.message);
            }
        }
    );

export const updateComment = createAsyncThunk<
    { postId: string; commentId: string; text: string },
    { postId: string; commentId: string; text: string },
    { rejectValue: string }
>(
    "posts/updateComment",
    async ({
        postId,
        commentId,
        text,
    }, thunkAPI) => {
        try {
            return await postService.updateCommentApi({ postId, commentId, text });
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const fetchPostById = createAsyncThunk<
    Post,
    string,
    { rejectValue: string }
>
    (
        "posts/getById",
        async (postId, thunkAPI) => {
            try {
                return await postService.getPostById(postId);
            } catch (error: any) {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
    );


const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        resetPosts: () => initialState,
        optimisticUpvote(state, action: PayloadAction<OptimisticUpvotePayload>) {
            const { postId, userId } = action.payload;
            const post = state.posts.find((p) => p._id === postId);
            if (!post) return;

            const alreadyUpvoted = post.upvotes.includes(userId);

            if (alreadyUpvoted) {
                post.upvotes = post.upvotes.filter((id) => id !== userId);
            } else {
                post.upvotes.push(userId);
            }
        },
        optimisticAddComment(
            state,
            action: PayloadAction<{ postId: string; comment: Comment }>) {

            const { postId, comment } = action.payload;
            const post = state.posts.find((p) => p._id === postId)
                || state.selectedPost;

            if (!post) return;

            post.comments.push(comment);
        },
        optimisticEditComment: (
            state,
            action: PayloadAction<{
                postId: string;
                commentId: string;
                text: string;
            }>
        ) => {
            const { postId, commentId, text } = action.payload;

            const post =
                state.posts.find((p) => p._id === postId) ||
                state.selectedPost;

            if (!post) return;

            const comment = post.comments.find((c) => c._id === commentId);
            if (!comment) return;

            comment.text = text;
        },

        optimisticDeleteComment: (
            state,
            action: PayloadAction<{ postId: string; commentId: string }>
        ) => {
            const { postId, commentId } = action.payload;

            const post =
                state.posts.find((p) => p._id === postId) ||
                state.selectedPost;

            if (!post) return;

            post.comments = post.comments.filter((c => c._id !== commentId));
        },
    },
    extraReducers: (builder) => {
        builder
            // FETCH INITIAL POSTS
            .addCase(fetchPosts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts = action.payload.posts;
                state.hasMore = action.payload.hasMore;
                state.page = 1;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to fetch posts";
            })

            // FETCH MORE POSTS (INFINITE SCROLL)
            .addCase(fetchMorePosts.fulfilled, (state, action) => {
                state.posts.push(...action.payload.posts);
                state.page += 1;
                state.hasMore = action.payload.hasMore;
            })

            // CREATE
            .addCase(createNewPost.fulfilled, (state, action: PayloadAction<Post>) => {
                state.posts.unshift(action.payload);
            })

            // UPDATE
            .addCase(updateExistingPost.fulfilled, (state, action) => {
                state.posts = state.posts.map(post =>
                    post._id === action.payload._id ? action.payload : post
                );
            })

            // DELETE
            .addCase(deleteExistingPost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(post => post._id !== action.payload);
            })

            // UPVOTE
            .addCase(upvotePost.fulfilled, (state, action) => {
                state.posts = state.posts.map(post =>
                    post._id === action.payload._id ? action.payload : post
                );
            })

            .addCase(upvotePost.rejected, (state, action) => {
                // rollback
                const { postId, userId } = action.meta.arg
                    ? (action.meta.arg as any)
                    : {};

                const post = state.posts.find((p) => p._id === postId);
                if (!post || !userId) return;

                // reverse the optimistic change
                if (post.upvotes.includes(userId)) {
                    post.upvotes = post.upvotes.filter((id) => id !== userId);
                } else {
                    post.upvotes.push(userId);
                }

                state.error = "Failed to upvote. Please try again.";
            })

            .addCase(fetchPostById.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.selectedPost = action.payload;
            })
            .addCase(fetchPostById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to fetch post";
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const { postId, comment } = action.payload;

                const post =
                    state.posts.find((p) => p._id === postId) || state.selectedPost;

                if (!post) return;

                // remove optimistic comment
                post.comments = post.comments.filter(
                    (c) => !c.optimistic
                );

                // add real comment from server
                post.comments.unshift(comment);
            })

            .addCase(addComment.rejected, (state, action) => {
                const { postId } = action.meta.arg;
                const post =
                    state.posts.find((p) => p._id === postId) || state.selectedPost;

                if (!post) return;

                // rollback optimistic comment
                post.comments = post.comments.filter(
                    (c) => !c.optimistic
                );

                state.error = "Failed to add comment";
            })
            .addCase(updateComment.rejected, (state, action) => {
                state.error = action.payload || "Failed to update comment";
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.error = action.payload || "Failed to delete comment";
            });

        ;
    },
});

export const {
    resetPosts,
    optimisticUpvote,
    optimisticAddComment,
    optimisticEditComment,
    optimisticDeleteComment
} = postSlice.actions;
export default postSlice.reducer;


export const selectAllPosts = (state: RootState) => state.posts.posts;
export const selectPostsStatus = (state: RootState) => state.posts.status;


export const getPostById = (state: RootState, postId: string) => {
    const post = state.posts.posts.find(post => post._id === postId);
    return post;
}
