import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import bookmarkService from '@/services/bookmark.service';
import { RootState } from '@/app/store';
import { Article } from '../../types/article.types';
import { GetBookmarksParams } from '../../types/bookmark.types';

interface BookmarkState {
    bookmarks: Article[];
    bookmarkedArticleIds: string[];
    loading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        total: number;
    };
}

const initialState: BookmarkState = {
    bookmarks: [],
    bookmarkedArticleIds: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        total: 0,
    },
};

// Async thunks
export const toggleBookmark = createAsyncThunk(
    'bookmarks/toggle',
    async (articleId: string, { rejectWithValue }) => {
        try {
            const response = await bookmarkService.toggleBookmark(articleId);
            return {
                articleId,
                isBookmarked: response.data.isBookmarked,
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to toggle bookmark');
        }

    }
);

export const getBookmarks = createAsyncThunk(
    'bookmarks/getAll',
    async (params: GetBookmarksParams = {}, { rejectWithValue }) => {
        try {
            const response = await bookmarkService.getBookmarks(params);
            return response;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to fetch bookmarks');
        }
    }
);

export const checkIsBookmarked = createAsyncThunk(
    'bookmarks/check',
    async (articleId: string, { rejectWithValue }) => {
        try {
            const response = await bookmarkService.isBookmarked(articleId);
            return {
                articleId,
                isBookmarked: response.data.isBookmarked,
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to check bookmark');
        }
    }
);

export const removeBookmark = createAsyncThunk(
    'bookmarks/remove',
    async (bookmarkId: string, { rejectWithValue }) => {
        try {
            await bookmarkService.removeBookmark(bookmarkId);
            return bookmarkId;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to remove bookmark');
        }
    }
);

const bookmarkSlice = createSlice({
    name: 'bookmarks',
    initialState,
    reducers: {
        clearBookmarks: (state) => {
            state.bookmarks = [];
            state.bookmarkedArticleIds = [];
            state.pagination = initialState.pagination;
        },
        addBookmarkedArticleId: (state, action: PayloadAction<string>) => {
            if (!state.bookmarkedArticleIds.includes(action.payload)) {
                state.bookmarkedArticleIds.push(action.payload);
            }
        },
        removeBookmarkedArticleId: (state, action: PayloadAction<string>) => {
            state.bookmarkedArticleIds = state.bookmarkedArticleIds.filter(
                (id) => id !== action.payload
            );
        },
    },
    extraReducers: (builder) => {
        builder
            // Toggle bookmark
            .addCase(toggleBookmark.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleBookmark.fulfilled, (state, action) => {
                state.loading = false;
                const { articleId, isBookmarked } = action.payload;


                if (isBookmarked) {
                    // Add to array if not already present
                    if (!state.bookmarkedArticleIds.includes(articleId)) {
                        state.bookmarkedArticleIds.push(articleId);
                    }
                } else {
                    // Remove from array
                    state.bookmarkedArticleIds = state.bookmarkedArticleIds.filter(
                        (id) => id !== articleId
                    );
                }

                console.log(isBookmarked, articleId)

            })
            .addCase(toggleBookmark.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get bookmarks
            .addCase(getBookmarks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookmarks.fulfilled, (state, action) => {
                state.loading = false;
                state.bookmarks = action.payload.data;
                state.pagination = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    total: action.payload.total,
                };
                // Update bookmarked article IDs
                action.payload.data.forEach((article) => {
                    if (!state.bookmarkedArticleIds.includes(article._id)) {
                        state.bookmarkedArticleIds.push(article._id);
                    }
                });
            })
            .addCase(getBookmarks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Check if bookmarked
            .addCase(checkIsBookmarked.fulfilled, (state, action) => {
                const { articleId, isBookmarked } = action.payload;

                if (isBookmarked) {
                    if (!state.bookmarkedArticleIds.includes(articleId)) {
                        state.bookmarkedArticleIds.push(articleId);
                    }
                } else {
                    state.bookmarkedArticleIds = state.bookmarkedArticleIds.filter(
                        (id) => id !== articleId
                    );
                }
            })

            // Remove bookmark
            .addCase(removeBookmark.fulfilled, (state, action) => {
                state.bookmarks = state.bookmarks.filter(
                    (bookmark) => bookmark._id !== action.payload
                );
            });
    },
});

export const { clearBookmarks, addBookmarkedArticleId, removeBookmarkedArticleId } =
    bookmarkSlice.actions;

// Selectors
export const selectBookmarks = (state: RootState) => state.bookmarks.bookmarks;
export const selectBookmarksLoading = (state: RootState) => state.bookmarks.loading;
export const selectBookmarksError = (state: RootState) => state.bookmarks.error;
export const selectBookmarksPagination = (state: RootState) =>
    state.bookmarks.pagination;
export const selectIsArticleBookmarked = (articleId: string) => (state: RootState) =>
    state.bookmarks.bookmarkedArticleIds.includes(articleId);

export default bookmarkSlice.reducer;