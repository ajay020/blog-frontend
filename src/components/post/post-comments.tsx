import CommentItem from "./comment-item";
import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { Comment } from "../../types/post";
import { addComment } from "../../features/post/postSlice";

interface Props {
    comments: Comment[];
    postId: string;
}

const PostComments = ({ comments, postId }: Props) => {
    const dispatch = useAppDispatch();
    const [text, setText] = useState("");

    const submitComment = () => {
        if (!text.trim()) return;
        dispatch(addComment({ postId, text }));
        setText("");
    };

    return (
        <div className="border-t border-slate-700 pt-4 space-y-4">
            <h3 className="text-sm font-semibold">Comments</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto">
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
