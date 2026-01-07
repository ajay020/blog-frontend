import { useState } from "react";
import { Post } from "../../types/post";
import { useAppDispatch } from "../../app/hooks";
import { createNewPost, updateExistingPost } from "../../features/post/postSlice";

interface PostFormProps {
    post?: Post;
    onClose: () => void;
}

const PostForm = ({ post, onClose }: PostFormProps) => {
    const dispatch = useAppDispatch();

    const [title, setTitle] = useState(post?.title ?? "");
    const [content, setContent] = useState(post?.content ?? "");
    const [image, setImage] = useState<string | null>(post?.image?.url ?? null);

    const handleSubmit = () => {
        if (!title.trim()) return;

        const payload = {
            title,
            content,
            image: image ? { url: image } : undefined,
        };

        if (post) {
            dispatch(updateExistingPost({ postData: payload, postId: post._id }));
        } else {
            dispatch(createNewPost(payload));
        }

        onClose();
    };

    return (
        <div className="space-y-4">
            {/* Title */}
            <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Content */}
            <textarea
                placeholder="Write something..."
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Image Upload */}
            <div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        e.target.files && setImage(URL.createObjectURL(e.target.files[0]))
                    }
                    className="text-sm"
                />

                {image && (
                    <img
                        src={image}
                        alt="preview"
                        className="mt-3 rounded-lg max-h-60 object-cover"
                    />
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
                >
                    {post ? "Update" : "Post"}
                </button>
            </div>
        </div>
    );
};

export default PostForm;
