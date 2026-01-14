import { useEffect, useState } from "react";
import { Post } from "@/types/post";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { createNewPost, resetCreateStatus, updateExistingPost } from "@/features/post/postSlice";
import { compressImage } from "@/utils/imageCompression";
import { toast } from "react-toastify";


interface PostFormProps {
    post?: Post;
    onClose: () => void;
}

const PostForm = ({ post, onClose }: PostFormProps) => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(state => state.posts.createStatus)

    const [title, setTitle] = useState(post?.title ?? "");
    const [content, setContent] = useState(post?.content ?? "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        post?.image?.url ?? null
    );


    useEffect(() => {
        if (status == "succeeded") {
            onClose()
            dispatch(resetCreateStatus())
        }
    }, [status])

    const handleSubmit = () => {
        if (!title.trim()) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        if (post) {
            dispatch(updateExistingPost({ postId: post._id, postData: formData }));
        } else {
            dispatch(createNewPost(formData));
        }


        // onClose();
    };

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optional: validate type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image too large (max 5MB)");
            return;
        }

        // Compress
        const compressed = await compressImage(file);

        setImageFile(compressed);
        setImagePreview(URL.createObjectURL(compressed));
    };

    return (
        <div className="space-y-4">
            {
                status == "loading" && <p>Creating post...</p>
            }
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
                    onChange={(e) => handleImageChange(e)}
                    className="text-sm"
                />

                {imagePreview && (
                    <img
                        src={imagePreview}
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
