import { X } from "lucide-react";
import PostForm from "./post-form";
import PostComments from "./post-comments";
import { Post } from "../../types/post";

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post?: Post; // undefined = create mode
}

const PostModal = ({ isOpen, onClose, post }: PostModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-slate-900 text-white w-full max-w-2xl rounded-xl shadow-lg relative">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                    <h2 className="text-lg font-semibold">
                        {post ? "Edit Post" : "Create Post"}
                    </h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 hover:text-red-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <PostForm post={post} onClose={onClose} />
                </div>
            </div>
        </div>
    );
};

export default PostModal;
