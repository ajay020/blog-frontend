import CommentItem from "./comment-item";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Comment } from "../../types/post";
import { addComment, optimisticAddComment } from "../../features/post/postSlice";
import { nanoid } from "@reduxjs/toolkit";

interface Props {
    postId: string;
}

const PostComments = ({ postId }: Props) => {
    const dispatch = useAppDispatch();
    const [text, setText] = useState("");
    const user = useAppSelector((s) => s.auth.user);

    const comments = useAppSelector((state) => {
        const post =
            state.posts.posts.find((p) => p._id === postId) ||
            state.posts.selectedPost;

        return post?.comments ?? [];
    });


    // console.log("Rendering PostComments for postId:", "with comments:", comments);

    const submitComment = () => {
        if (!text.trim() || !user) return;

        const optimisticComment: Comment = {
            _id: nanoid(),
            text,
            user: { _id: user._id, name: user.name },
            createdAt: new Date().toISOString(),
            optimistic: true,
        };

        console.log("Submitting OPT comment:", optimisticComment);

        // 1️⃣ Optimistic UI
        dispatch(
            optimisticAddComment({
                postId,
                comment: optimisticComment,
            })
        );

        // 2️⃣ API call
        dispatch(addComment({ postId, text }));

        setText("");
    };

    return (
        <div className="border-t border-slate-700 pt-4 space-y-4">
            <h3 className="text-sm font-semibold">Comments</h3>

            <div className=" space-y-3 overflow-y-auto">
                {comments.map((comment) => (
                    <CommentItem key={comment._id} comment={comment} />
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
                />
                <button
                    onClick={submitComment}
                    className="px-3 py-2 bg-indigo-600 rounded-lg"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default PostComments;
