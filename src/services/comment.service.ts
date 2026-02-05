// src/services/comment.service.ts
import api from './api';
import {
  CreateCommentData,
  CommentResponse,
  CommentsResponse,
} from '../types/comment.types';

class CommentService {
  // Get comments for an article
  async getComments(articleId: string): Promise<CommentsResponse> {
    const response = await api.get<CommentsResponse>(`/articles/${articleId}/comments`);
    return response.data;
  }

  // Create a comment
  async createComment(
    articleId: string,
    data: CreateCommentData
  ): Promise<CommentResponse> {
    const response = await api.post<CommentResponse>(
      `/articles/${articleId}/comments`,
      data
    );
    return response.data;
  }

  // Update a comment
  async updateComment(commentId: string, content: string): Promise<CommentResponse> {
    const response = await api.put<CommentResponse>(`/comments/${commentId}`, {
      content,
    });
    return response.data;
  }

  // Delete a comment
  async deleteComment(commentId: string): Promise<{ success: boolean }> {
    const response = await api.delete<{ success: boolean }>(
      `/comments/${commentId}`
    );
    return response.data;
  }

  // Like/Unlike a comment
  async toggleCommentLike(
    commentId: string
  ): Promise<{ success: boolean; data: { likesCount: number; isLiked: boolean } }> {
    const response = await api.put<{
      success: boolean;
      data: { likesCount: number; isLiked: boolean };
    }>(`/comments/${commentId}/like`);
    return response.data;
  }
}

export default new CommentService();