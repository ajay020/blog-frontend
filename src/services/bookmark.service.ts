// services/bookmarkService.ts
import api from './api';
import {
    BookmarksResponse,
    ToggleBookmarkResponse,
    IsBookmarkedResponse,
    RemoveBookmarkResponse,
    GetBookmarksParams,
} from '../types/bookmark.types';

class BookmarkService {
    // Toggle bookmark (add/remove)
    async toggleBookmark(articleId: string): Promise<ToggleBookmarkResponse> {
        const response = await api.put<ToggleBookmarkResponse>(
            `/articles/${articleId}/bookmark`
        );
        return response.data;
    }

    // Get user's bookmarks with pagination
    async getBookmarks(params?: GetBookmarksParams): Promise<BookmarksResponse> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await api.get<BookmarksResponse>(
            `/bookmarks?${queryParams.toString()}`
        );
        return response.data;
    }

    // Check if article is bookmarked
    async isBookmarked(articleId: string): Promise<IsBookmarkedResponse> {
        const response = await api.get<IsBookmarkedResponse>(
            `/articles/${articleId}/is-bookmarked`
        );
        return response.data;
    }

    // Remove bookmark by ID
    async removeBookmark(bookmarkId: string): Promise<RemoveBookmarkResponse> {
        const response = await api.delete<RemoveBookmarkResponse>(
            `/bookmarks/${bookmarkId}`
        );
        return response.data;
    }
}

export default new BookmarkService();