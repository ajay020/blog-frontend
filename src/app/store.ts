import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '@/features/theme/themeSlice'
import articleSlice from '@/features/articles/articleSlice'
import followSlice from "@/features/follow/followSlice"
import commentReducer from '@/features/comments/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    articles: articleSlice,
    follow: followSlice,
    comments: commentReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;