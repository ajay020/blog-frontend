import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '@/features/theme/themeSlice'
import articleReducer from '@/features/articles/articleSlice'
import followReducer from "@/features/follow/followSlice"
import commentReducer from '@/features/comments/commentSlice';
import bookmarkReducer from "@/features/bookmark/bookmarkSlice";
import { rtkApi } from '@/services/api/rtkApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    articles: articleReducer,
    follow: followReducer,
    comments: commentReducer,
    bookmarks: bookmarkReducer,

    [rtkApi.reducerPath]: rtkApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;