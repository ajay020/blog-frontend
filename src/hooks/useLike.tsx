import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { optimisticUpvote, upvotePost } from '../features/post/postSlice';
import { Post } from '../types/post';

const useLike = (post: Post) => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.auth.user?._id);
    const isUpvoted = post.upvotes.includes(userId ?? "");


    const toggleUpvote = useCallback(() => {
        if (!userId) return;

        // 1️⃣ Optimistic UI update
        dispatch(
            optimisticUpvote({
                postId: post._id,
                userId,
            })
        );

        // 2️⃣ API call
        dispatch(upvotePost(post._id));
    }, [dispatch, post, userId]);

    return {
        isUpvoted,
        toggleUpvote,
    };
}

export default useLike