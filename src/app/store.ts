import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '@/features/theme/themeSlice'
import articleReducer from '@/features/articles/articleSlice'
import followReducer from "@/features/follow/followSlice"
import commentReducer from '@/features/comments/commentSlice';
import bookmarkReducer from "@/features/bookmark/bookmarkSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    articles: articleReducer,
    follow: followReducer,
    comments: commentReducer,
    bookmarks: bookmarkReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;