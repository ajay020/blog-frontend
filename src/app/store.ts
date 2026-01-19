import { configureStore } from '@reduxjs/toolkit';
import postReducer from '../features/post/postSlice';
import authReducer from '../features/auth/authSice2';
import themeReducer from '@/features/theme/themeSlice'
import articleSlice from '@/features/articles/articleSlice'


export const store = configureStore({
  reducer: {
    posts: postReducer,
    auth: authReducer,
    theme: themeReducer,
    articles: articleSlice
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;