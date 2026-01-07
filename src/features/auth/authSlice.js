import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

//get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    bookMarks:[]
}

// register user
export const registerUser = createAsyncThunk("auth/register", async (user, thunkAPI)=>{
    try {
       return await authService.register(user);
    } catch (error) {
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)||
            error.message ||
            error.toString();
            return thunkAPI.rejectWithValue(message);
    }
});

// login user
export const loginUser = createAsyncThunk('auth/login', async(user, thunkAPI) =>{
    try {
       return await authService.login(user);
    } catch (error) {
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)||
            error.message ||
            error.toString();
            return thunkAPI.rejectWithValue(message);
    }
})

// login with google
export const loginWithGoogle = createAsyncThunk('auth/loginWighGoogle', async(googleTokenId, thunkAPI) =>{
    try {
        return await authService.loginGoogle(googleTokenId);
    } catch (error) {
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)||
            error.message ||
            error.toString();
            return thunkAPI.rejectWithValue(message);
    }
})

//bookmark post
export const bookMarkPost = createAsyncThunk("auth/bookmark", async(postId, thunkAPI) =>{
    try {
        const token = thunkAPI.getState().auth.user?.token;
        return await authService.bookMarkPost(postId, token);
    } catch (error) {
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)||
            error.message ||
            error.toString();
            return thunkAPI.rejectWithValue(message);
    }
})

//get all bookmark posts
export const getBookMarkPosts = createAsyncThunk("auth/getbookmarkposts", async( x={} ,thunkAPI) => {
    try {
        // console.log("ddddddddddddd", thunkAPI)
        const token = thunkAPI.getState().auth.user?.token;
        return await authService.getBookMarkPosts( token);
    } catch (error) {
        console.log(error);
        const message = (error.response && 
            error.response.data && 
            error.response.data.message)||
            error.message ||
            error.toString();
            return thunkAPI.rejectWithValue(message);
    }
})

// logout user
export const logout = createAsyncThunk('auth/logout', async() =>{
    authService.logout();
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
          },
    },
    extraReducers: (builder)=>{
        builder
            .addCase(registerUser.pending, (state, action)=>{
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null; 
            })
            .addCase(loginUser.pending, (state, action)=>{
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null; 
            })
            .addCase(loginWithGoogle.pending, (state, action)=>{
                state.isLoading = true;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(loginWithGoogle.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null; 
            })
            .addCase(logout.fulfilled, (state, action)=>{
                state.user = null;
            })
            .addCase(bookMarkPost.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload

                const {_id : postId} = action.payload;
                let {bookmarkedPosts} = state.user;


                if(bookmarkedPosts.some(post => post._id === postId)){
                    state.user.bookmarkedPosts =  bookmarkedPosts.filter(post => post._id !== postId);
                }else{
                    bookmarkedPosts.push(action.payload);
                }

                // update user stored in local storage
                const user =  JSON.parse (localStorage.getItem('user'));
                user.bookmarkedPosts = state.user.bookmarkedPosts;
                localStorage.setItem('user', JSON.stringify(user));
            })
            .addCase(getBookMarkPosts.pending, (state, action)=>{
                state.isLoading = false;
            })
            .addCase(getBookMarkPosts.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.bookMarks = [...action.payload];
            })
            .addCase(getBookMarkPosts.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});
export const {reset}  = authSlice.actions;
export default authSlice.reducer;
