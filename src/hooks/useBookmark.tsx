import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { Post } from "../types/post";
import { optimisticToggleBookmark, toggleBookmark } from "../features/post/postSlice";
import { optimisticToggleBookmarkAuth } from "../features/auth/authSlice";

export const useBookmark = (post: Post) => {
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector(
        (state) => state.auth.status === "loading"
    );

    const isBookmarked = useAppSelector((state) =>
        state.auth.bookmarks.some((p) => p._id === post._id)
    );

    const toggle = useCallback(() => {
        // Optimistic update – posts slice
        dispatch(
            optimisticToggleBookmark({
                postId: post._id,
            })
        );

        // Optimistic update – auth slice
        dispatch(
            optimisticToggleBookmarkAuth({
                post,
            })
        );

        // Backend request
        dispatch(toggleBookmark(post._id));
    }, [dispatch, post]);

    return {
        isBookmarked,
        toggleBookmark: toggle,
        isLoading,
    };
};
