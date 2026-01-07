import { configureStore } from '@reduxjs/toolkit';
import postReducer from '../features/post/postSlice';
import authReducer from '../features/auth/authSlice';


export const store = configureStore({
  reducer: {
    posts: postReducer,
    auth: authReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;