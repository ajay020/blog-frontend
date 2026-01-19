// src/services/article.service.ts
import api from './api';
import {
    Article,
    CreateArticleData,
    UpdateArticleData,
    GetArticlesParams,
    ArticleResponse,
    ArticlesResponse,
    LikeResponse,
} from '../types/article.types';

class ArticleService {
    // Get all articles with pagination and filters
    async getArticles(params?: GetArticlesParams): Promise<ArticlesResponse> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.tag) queryParams.append('tag', params.tag);
        if (params?.category) queryParams.append('category', params.category);
        if (params?.search) queryParams.append('search', params.search);

        const response = await api.get<ArticlesResponse>(
            `/articles?${queryParams.toString()}`
        );

        return response.data;
    }

    // Get single article by slug
    async getArticle(slug: string): Promise<ArticleResponse> {
        const response = await api.get<ArticleResponse>(`/articles/${slug}`);
        return response.data;
    }

    // Get single article by ID (for editing)
    async getArticleById(id: string): Promise<ArticleResponse> {
        const response = await api.get<ArticleResponse>(`/articles/id/${id}`);
        return response.data;
    }

    // Create new article
    async createArticle(data: CreateArticleData): Promise<ArticleResponse> {
        const response = await api.post<ArticleResponse>('/articles', data);
        return response.data;
    }

    // Update article
    async updateArticle(
        id: string,
        data: UpdateArticleData
    ): Promise<ArticleResponse> {
        const response = await api.put<ArticleResponse>(`/articles/${id}`, data);
        return response.data;
    }

    // Delete article
    async deleteArticle(id: string): Promise<{ success: boolean; data: {} }> {
        const response = await api.delete<{ success: boolean; data: {} }>(
            `/articles/${id}`
        );
        return response.data;
    }

    // Like/Unlike article
    async toggleLike(id: string): Promise<LikeResponse> {
        const response = await api.put<LikeResponse>(`/articles/${id}/like`);
        return response.data;
    }

    // Get user's articles (drafts + published)
    async getMyArticles(): Promise<{ success: boolean; data: Article[] }> {
        const response = await api.get<{ success: boolean; data: Article[] }>(
            '/articles/me/articles'
        );
        return response.data;
    }

    // Get featured articles
    async getFeaturedArticles(): Promise<{ success: boolean; data: Article[] }> {
        const response = await api.get<{ success: boolean; data: Article[] }>(
            '/articles/featured'
        );
        return response.data;
    }

    // Get articles by specific author
    async getArticlesByAuthor(
        authorId: string,
        params?: GetArticlesParams
    ): Promise<ArticlesResponse> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await api.get<ArticlesResponse>(
            `/articles/author/${authorId}?${queryParams.toString()}`
        );

        return response.data;
    }
}

export default new ArticleService();