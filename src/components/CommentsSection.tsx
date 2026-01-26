import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    getComments,
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    selectComments,
    selectCommentsLoading,
    clearComments,
    optimisticUpdateComment,
    revertComment,
    optimisticDeleteComment,
} from '../features/comments/commentSlice';
import { selectUser } from '../features/auth/authSlice';
import { Comment } from '../types/comment.types';
import { MessageCircle, Heart, Edit2, Trash2, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentsSectionProps {
    articleId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId }) => {
    const dispatch = useAppDispatch();
    const comments = useAppSelector(selectComments);
    const isLoading = useAppSelector(selectCommentsLoading);
    const currentUser = useAppSelector(selectUser);

    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        dispatch(getComments(articleId));

        return () => {
            dispatch(clearComments());
        };
    }, [articleId, dispatch]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        await dispatch(
            createComment({
                articleId,
                data: { content: newComment, parentComment: replyingTo || undefined },
            })
        );

        setNewComment('');
        setReplyingTo(null);
    };

    const handleUpdate = async (commentId: string) => {
        if (!editContent.trim()) return;

        // Find the original comment to revert if needed
        const findComment = (comments: Comment[]): Comment | null => {
            for (const comment of comments) {
                if (comment._id === commentId) return comment;
                if (comment.replies) {
                    const found = findComment(comment.replies);
                    if (found) return found;
                }
            }
            return null;
        };

        const originalComment = findComment(comments);
        if (!originalComment) return;

        // Optimistic update - Update UI immediately
        dispatch(optimisticUpdateComment({ commentId, content: editContent }));
        setEditingId(null);
        setEditContent('');

        // Make API call in background
        const result = await dispatch(updateComment({ commentId, content: editContent }));

        // Revert if failed
        if (updateComment.rejected.match(result)) {
            dispatch(revertComment(originalComment));
            alert('Failed to update comment. Please try again.');
            setEditingId(commentId);
            setEditContent(originalComment.content);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        // Find the original comment to revert if needed
        const findComment = (comments: Comment[]): Comment | null => {
            for (const comment of comments) {
                if (comment._id === commentId) return comment;
                if (comment.replies) {
                    const found = findComment(comment.replies);
                    if (found) return found;
                }
            }
            return null;
        };

        const originalComment = findComment(comments);
        if (!originalComment) return;

        // Optimistic update - Delete from UI immediately
        dispatch(optimisticDeleteComment(commentId));

        // Make API call in background
        const result = await dispatch(deleteComment(commentId));

        // Revert if failed
        if (deleteComment.rejected.match(result)) {
            dispatch(revertComment(originalComment));
            alert('Failed to delete comment. Please try again.');
        }
    };

    const handleLike = async (commentId: string) => {
        if (!currentUser) {
            alert('Please login to like comments');
            return;
        }
        await dispatch(toggleCommentLike(commentId));
    };

    const startEdit = (comment: Comment) => {
        setEditingId(comment._id);
        setEditContent(comment.content);
    };

    const renderComment = (comment: Comment, isReply = false) => {
        const isAuthor = currentUser?._id === comment.author._id;
        const isLiked = currentUser && comment.likes.includes(currentUser._id);

        return (
            <div
                key={comment._id}
                className={`${isReply ? 'ml-12 mt-4' : 'mb-6'} ${comment.isDeleted ? 'opacity-60' : ''
                    }`}
            >
                <div className="flex gap-3">
                    <img
                        src={comment.author.avatar || '/default-avatar.png'}
                        alt={comment.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {comment.author.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        {comment.updatedAt !== comment.createdAt && ' (edited)'}
                                    </p>
                                </div>

                                {isAuthor && !comment.isDeleted && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(comment)}
                                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comment._id)}
                                            className="text-gray-500 hover:text-red-600 dark:text-gray-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {editingId === comment._id ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdate(comment._id)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                            )}
                        </div>

                        {/* Comment Actions */}
                        {!comment.isDeleted && (
                            <div className="flex gap-4 mt-2 text-sm">
                                <button
                                    onClick={() => handleLike(comment._id)}
                                    className={`flex items-center gap-1 ${isLiked
                                        ? 'text-red-500'
                                        : 'text-gray-500 hover:text-red-500 dark:text-gray-400'
                                        }`}
                                    disabled={!currentUser}
                                >
                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                    {comment.likesCount}
                                </button>

                                {!isReply && currentUser && (
                                    <button
                                        onClick={() => setReplyingTo(comment._id)}
                                        className="flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:text-gray-400"
                                    >
                                        <Reply className="w-4 h-4" />
                                        Reply
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Reply Form */}
                        {replyingTo === comment._id && (
                            <form onSubmit={handleSubmitComment} className="mt-4">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Reply
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setReplyingTo(null);
                                            setNewComment('');
                                        }}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-4 space-y-4">
                                {comment.replies.map((reply) => renderComment(reply, true))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Comments ({comments.length})
            </h2>

            {/* New Comment Form */}
            {currentUser ? (
                <form onSubmit={handleSubmitComment} className="mb-8">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isLoading}
                        className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Please login to leave a comment
                    </p>
                </div>
            )}

            {/* Comments List */}
            {isLoading && comments.length === 0 ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                        No comments yet. Be the first to comment!
                    </p>
                </div>
            ) : (
                <div>{comments.map((comment) => renderComment(comment))}</div>
            )}
        </div>
    );
};

export default CommentsSection;