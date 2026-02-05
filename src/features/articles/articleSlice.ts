import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import articleService from '../../services/article.service';
import {
    ArticleState,
    CreateArticleData,
    UpdateArticleData,
    GetArticlesParams,
} from '../../types/article.types';
import type { RootState } from '../../app/store';

// Initial state
const initialState: ArticleState = {
    articles: [],
    currentArticle: null,
    myArticles: [],
    featuredArticles: [],
    isLoading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 10,
    },
};

// Async thunks

// Get all articles
export const getArticles = createAsyncThunk(
    'articles/getArticles',
    async (params: GetArticlesParams | undefined, { rejectWithValue }) => {
        try {
            const response = await articleService.getArticles(params);
            return response;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to fetch articles');
        }
    }
);

// Get single article
export const getArticle = createAsyncThunk(
    'articles/getArticle',
    async (slug: string, { rejectWithValue }) => {
        try {
            const response = await articleService.getArticle(slug);
            return response.data;
        } catch (error: unknown) {

            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue('Failed to fetch article');
        }
    }
);

// Get single article by ID (for editing)
export const getArticleById = createAsyncThunk(
    'articles/getArticleById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await articleService.getArticleById(id);
            return response.data;
        } catch (error: unknown) {

            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue('Failed to fetch article');
        }
    }
);

// Create article
export const createArticle = createAsyncThunk(
    'articles/createArticle',
    async (data: CreateArticleData, { rejectWithValue }) => {
        try {
            const response = await articleService.createArticle(data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to create article');
        }
    }
);

// Update article
export const updateArticle = createAsyncThunk(
    'articles/updateArticle',
    async (
        { id, data }: { id: string; data: UpdateArticleData },
        { rejectWithValue }
    ) => {
        try {
            const response = await articleService.updateArticle(id, data);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to update article');
        }
    }
);

// Delete article
export const deleteArticle = createAsyncThunk(
    'articles/deleteArticle',
    async (id: string, { rejectWithValue }) => {
        try {
            await articleService.deleteArticle(id);
            return id;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to delete article');
        }
    }
);

// Toggle like
export const toggleLike = createAsyncThunk(
    'articles/toggleLike',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await articleService.toggleLike(id);
            return { id, ...response.data };
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to toggle like');
        }
    }
);

// Get my articles
export const getMyArticles = createAsyncThunk(
    'articles/getMyArticles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await articleService.getMyArticles();
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to fetch your articles');
        }
    }
);

// Get featured articles
export const getFeaturedArticles = createAsyncThunk(
    'articles/getFeaturedArticles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await articleService.getFeaturedArticles();
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to fetch featured articles');
        }
    }
);

// Article slice
const articleSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },
        // Clear current article
        clearCurrentArticle: (state) => {
            state.currentArticle = null;
        },
        // Set current page
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.pagination.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Get Articles
        builder
            .addCase(getArticles.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.isLoading = false;

                // If page 1, replace articles (refresh)
                // Otherwise, append for infinite scroll
                if (action.payload.currentPage === 1) {
                    state.articles = action.payload.data;
                } else {
                    // Append new articles, avoiding duplicates
                    const existingIds = new Set(state.articles.map(a => a._id));
                    const newArticles = action.payload.data.filter(
                        article => !existingIds.has(article._id)
                    );
                    state.articles = [...state.articles, ...newArticles];
                }

                state.pagination = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    total: action.payload.total,
                    limit: state.pagination.limit,
                };
            })
            .addCase(getArticles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Get Single Article
        builder
            .addCase(getArticle.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentArticle = action.payload;
            })
            .addCase(getArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Get Article By ID (for editing)
        builder
            .addCase(getArticleById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getArticleById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentArticle = action.payload;
            })
            .addCase(getArticleById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create Article
        builder
            .addCase(createArticle.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.articles.unshift(action.payload);
                state.myArticles.unshift(action.payload);
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update Article
        builder
            .addCase(updateArticle.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.isLoading = false;

                // Update in articles list
                const index = state.articles.findIndex(
                    (article) => article._id === action.payload._id
                );
                if (index !== -1) {
                    state.articles[index] = action.payload;
                }

                // Update in myArticles list
                const myIndex = state.myArticles.findIndex(
                    (article) => article._id === action.payload._id
                );
                if (myIndex !== -1) {
                    state.myArticles[myIndex] = action.payload;
                }

                // Update current article
                if (state.currentArticle?._id === action.payload._id) {
                    state.currentArticle = action.payload;
                }
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Delete Article
        builder
            .addCase(deleteArticle.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.isLoading = false;

                // Remove from articles list
                state.articles = state.articles.filter(
                    (article) => article._id !== action.payload
                );

                // Remove from myArticles list
                state.myArticles = state.myArticles.filter(
                    (article) => article._id !== action.payload
                );

                // Clear current article if it was deleted
                if (state.currentArticle?._id === action.payload) {
                    state.currentArticle = null;
                }
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Toggle Like
        builder
            .addCase(toggleLike.pending, (state) => {
                state.error = null;
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                const { id, likesCount } = action.payload;

                // Update in articles list
                const article = state.articles.find((a) => a._id === id);
                if (article) {
                    article.likesCount = likesCount;
                }

                // Update current article
                if (state.currentArticle?._id === id) {
                    state.currentArticle.likesCount = likesCount;
                }
            })
            .addCase(toggleLike.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        // Get My Articles
        builder
            .addCase(getMyArticles.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getMyArticles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myArticles = action.payload;
            })
            .addCase(getMyArticles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Get Featured Articles
        builder
            .addCase(getFeaturedArticles.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFeaturedArticles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.featuredArticles = action.payload;
            })
            .addCase(getFeaturedArticles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

// Actions
export const { clearError, clearCurrentArticle, setCurrentPage } = articleSlice.actions;

// Selectors
export const selectArticles = (state: RootState) => state.articles.articles;
export const selectCurrentArticle = (state: RootState) => state.articles.currentArticle;
export const selectMyArticles = (state: RootState) => state.articles.myArticles;
export const selectFeaturedArticles = (state: RootState) => state.articles.featuredArticles;
export const selectArticlesLoading = (state: RootState) => state.articles.isLoading;
export const selectArticlesError = (state: RootState) => state.articles.error;
export const selectPagination = (state: RootState) => state.articles.pagination;

export default articleSlice.reducer;