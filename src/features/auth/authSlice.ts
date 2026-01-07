import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { AuthState, User } from '../../types/auth';
import { Post } from '../../types/post';

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

export const bookmarkPost = createAsyncThunk<
    Post,
    string,
    { rejectValue: string }
>("auth/bookmarkPost", async (postId, thunkAPI) => {
    try {
        return await authService.bookmarkPost(postId);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});


export const fetchBookmarkedPosts = createAsyncThunk<
    Post[],
    void,
    { rejectValue: string }
>("auth/fetchBookmarks", async (_, thunkAPI) => {
    try {
        return await authService.getBookmarkedPosts();
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

            // BOOKMARK POST (toggle logic)
            .addCase(bookmarkPost.fulfilled, (state, action) => {
                state.status = "succeeded";

                const post = action.payload;
                const exists = state.bookmarks.some(
                    (p) => p._id === post._id
                );

                state.bookmarks = exists
                    ? state.bookmarks.filter((p) => p._id !== post._id)
                    : [...state.bookmarks, post];
            })

            // FETCH BOOKMARKS
            .addCase(fetchBookmarkedPosts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchBookmarkedPosts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.bookmarks = action.payload;
            })
            .addCase(fetchBookmarkedPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? "Failed to load bookmarks";
            });
    },
});


export const { resetStatus } = authSlice.actions;
export default authSlice.reducer;