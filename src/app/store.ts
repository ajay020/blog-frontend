import { configureStore } from '@reduxjs/toolkit';
import postReducer from '../features/post/postSlice';
import authReducer from '../features/auth/authSlice';
import themeReducer from '@/features/theme/themeSlice'


export const store = configureStore({
  reducer: {
    posts: postReducer,
    auth: authReducer,
    theme: themeReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;