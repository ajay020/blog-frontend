import { Comment } from "../../types/post";

interface Props {
    comment: Comment;
}

const CommentItem = ({ comment }: Props) => {
    return (
        <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400">{comment.user.name}</p>
            <p className="text-sm">{comment.text}</p>
        </div>
    );
};

export default CommentItem;
