import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Comment } from "../../types/post";
import {
    deleteComment,
    optimisticDeleteComment,
    optimisticEditComment,
    updateComment
} from "../../features/post/postSlice";

type Props = {
    comment: Comment;
    postId: string;
};

const CommentItem = ({ comment, postId }: Props) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((s) => s.auth.user);
    const [text, setText] = useState(comment.text);
    const [isEditing, setIsEditing] = useState(false);

    const isOwner = user?._id === comment.user._id;

    const saveEdit = () => {
        setIsEditing(false);
        
        dispatch(
            optimisticEditComment({
                postId,
                commentId: comment._id,
                text,
            })
        );

        dispatch(
            updateComment({
                postId,
                commentId: comment._id,
                text,
            })
        );
    };

    const deleteHandler = () => {
        dispatch(
            optimisticDeleteComment({
                postId,
                commentId: comment._id,
            })
        );

        dispatch(
            deleteComment({
                postId,
                commentId: comment._id,
            })
        );
    };

    return (
        <div className="dark:bg-slate-800 bg-slate-100 p-3 rounded-lg">
            <div className="flex justify-between items-start">
                <p className="text-xs text-slate-400">
                    {comment.user.name}
                </p>

                {isOwner && (
                    <div className="flex gap-2 text-xs">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-indigo-400"
                        >
                            Edit
                        </button>
                        <button
                            onClick={deleteHandler}
                            className="text-red-400"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="mt-2 flex gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 bg-slate-700 rounded px-2 py-1"
                    />
                    <button
                        onClick={saveEdit}
                        className="text-green-400 text-sm"
                    >
                        Save
                    </button>
                </div>
            ) : (
                <p className="mt-1 text-sm">{comment.text}</p>
            )}

            {comment.optimistic && (
                <p className="text-xs text-slate-500 mt-1">Saving…</p>
            )}
        </div>
    );
};

export default CommentItem;

