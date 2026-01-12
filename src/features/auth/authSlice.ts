import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from './authService';
import { AuthState, User } from '../../types/auth';
import { BookmarkedPost, Post } from '../../types/post';

//get user from localStorage
const storedUser = JSON.parse(localStorage.getItem("user") || "null") as User | null;
console.log("Stored user from localStorage:", storedUser);

const initialState: AuthState = {
    user: storedUser,
    bookmarks: [],
    status: "idle",
    error: null,
};

export const registerUser = createAsyncThunk<
    User,
    { name: string; email: string; password: string, confirmPassword: string },
    { rejectValue: string }
>("auth/register", async (userData, thunkAPI) => {
    try {
        return await authService.register(userData);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});


export const loginUser = createAsyncThunk<
    User,
    { email: string; password: string },
    { rejectValue: string }
>("auth/login", async (userData, thunkAPI) => {
    try {
        return await authService.login(userData);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async () => {
        authService.logout();
    }
);

export const fetchBookmarkedPosts = createAsyncThunk<
    BookmarkedPost[],
    void,
    { rejectValue: string }
>("auth/fetchBookmarkedPosts", async (_, thunkAPI) => {
    try {
        const posts = await authService.getBookmarkedPosts();
        return posts;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = "idle";
            state.error = null;
        },

        optimisticToggleBookmarkAuth(
            state,
            action: PayloadAction<{ post: Post }>
        ) {
            const exists = state.bookmarks.find(
                (p) => p._id === action.payload.post._id
            );

            if (exists) {
                // remove
                state.bookmarks = state.bookmarks.filter(
                    (p) => p._id !== action.payload.post._id
                );
            } else {
                // add
                const bookmarkPost = {
                    _id: action.payload.post._id,
                    title: action.payload.post.title,
                    author: action.payload.post.author,
                    createdAt: action.payload.post.createdAt,
                }
                state.bookmarks.unshift(bookmarkPost);
            }
        }

    },
    extraReducers: (builder) => {
        builder
            // REGISTER
            .addCase(registerUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Registration failed";
            })

            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Login failed";
                state.user = null;
            })

            // LOGOUT
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.bookmarks = [];
            })
            // FETCH BOOKMARKED POSTS
            .addCase(fetchBookmarkedPosts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchBookmarkedPosts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.bookmarks = action.payload;
            })
            .addCase(fetchBookmarkedPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to fetch bookmarked posts";
            });
    },
});


export const { resetStatus, optimisticToggleBookmarkAuth} = authSlice.actions;

export default authSlice.reducer;