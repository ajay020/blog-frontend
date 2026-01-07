import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import postService from './postService';
import { PostState } from '../../types/post';
import { Post } from '../../types/post';
import { RootState } from '../../app/store';

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

export const upvoteExistingPost = createAsyncThunk<
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
    Post,
    { postId: string; text: string },
    { rejectValue: string }
>("posts/addComment", async ({ postId, text }, thunkAPI) => {
    try {
        return await postService.addComment(postId, text);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});


const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        resetPosts: () => initialState,
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
            .addCase(upvoteExistingPost.fulfilled, (state, action) => {
                state.posts = state.posts.map(post =>
                    post._id === action.payload._id ? action.payload : post
                );
            });
    },
});

export const { resetPosts } = postSlice.actions;
export default postSlice.reducer;


export const selectAllPosts = (state: RootState) => state.posts.posts;
export const selectPostsStatus = (state: RootState) => state.posts.status;


export const getPostById = (state: RootState, postId: string) => {
    const post = state.posts.posts.find(post => post._id === postId);
    return post;
}