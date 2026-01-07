import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from './postService';

const initialState = {
    posts: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    page: 1,
    hasMore: true,
};

//fetch all posts
export const fetchPosts = createAsyncThunk(
    "posts/fetch",
    async (page, thunkAPI) => {
        try {
            return await postService.getPosts(page);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const createPost = createAsyncThunk(
    "posts/create",
    async (postData, thunkAPI) => {
        try {
            return await postService.createPost(postData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updatePost = createAsyncThunk(
    "posts/update",
    async ({ postId, postData }, thunkAPI) => {
        try {
            return await postService.updatePost(postId, postData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deletePost = createAsyncThunk(
    "posts/delete",
    async (postId, thunkAPI) => {
        try {
            await postService.deletePost(postId);
            return postId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const upvotePost = createAsyncThunk(
    "posts/upvote",
    async (postId, thunkAPI) => {
        try {
            return await postService.upvotePost(postId);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        resetPosts: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // GET POSTS
            .addCase(fetchPosts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts.push(...action.payload.posts);
                state.page += 1;
                state.hasMore = action.payload.hasMore;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // CREATE POST
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
            })

            // UPDATE POST
            .addCase(updatePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex(
                    (post) => post._id === action.payload._id
                );
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })

            // DELETE POST
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(
                    (post) => post._id !== action.payload
                );
            })

            // UPVOTE POST
            .addCase(upvotePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex(
                    (post) => post._id === action.payload._id
                );
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            });
    },
});

export const { resetPosts } = postSlice.actions;
export default postSlice.reducer;

export const selectAllPosts = (state) => state.posts.posts;
export const selectPostsStatus = (state) => state.posts.status;


export const getPostById = (postId, state) => {
    const post = state.post.posts.find(post => post._id === postId);
    return post;
}