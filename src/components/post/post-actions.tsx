import { MessageCircle, MoreVertical } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useBookmark } from "../../hooks/useBookmark";
import BookMarkBtn from "../BookMarkBtn";
import useLike from "../../hooks/useLike";
import LikeButton from "../LikeBtn";
import { useEffect, useRef, useState } from "react";
import { clearSelectedPost, deleteExistingPost, optimisticDeletePost } from "../../features/post/postSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { optimisticDeleteBookmark } from "@/features/auth/authSlice";

interface Props {
    postId: string;
}

const PostActions = ({ postId }: Props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch()
    const deleteSatus = useAppSelector((state) => state.posts.deleteStatus)
    const user = useAppSelector((state) => state.auth.user)

    const post = useAppSelector((state) => {
        return state.posts.selectedPost

    });

    const { toggleUpvote, isUpvoted } = useLike(post!)
    const { isBookmarked, toggleBookmark } = useBookmark(post!);
    const navigate = useNavigate()

    const isValidUser = user?._id === post?.author._id

    console.log("IsValid post", post)

    console.log("IsValid user", user?._id, post?.author._id)

    //  Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handlePostDelete = () => {
        dispatch(optimisticDeletePost({ postId }))
        dispatch(deleteExistingPost(postId))
        dispatch(optimisticDeleteBookmark({ postId }))
    }

    useEffect(() => {
        if (deleteSatus === "succeeded") {
            toast.success("Post deleted");
            setTimeout(() => navigate("/"), 1000)
            dispatch(clearSelectedPost())
        }
    }, [deleteSatus, navigate])

    if (!post) return null;

    return (
        <div className="relative
            flex justify-between gap-6
            border-y border-slate-800 px-4 py-4 mb-6">
            <div className="flex gap-4">
                <LikeButton
                    post={post}
                    isUpvoted={isUpvoted}
                    toggleUpvote={toggleUpvote}
                />

                <div className="flex items-center gap-2 text-slate-400">
                    <MessageCircle size={20} />
                    {post.comments.length}
                </div>
            </div>

            <div className="flex gap-4">
                <BookMarkBtn
                    isBookmarked={isBookmarked}
                    toggleBookmark={toggleBookmark}
                />
                {
                    isValidUser && (
                        <button
                            className="text-slate-400 hover:text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <MoreVertical size={18} />
                        </button>
                    )
                }

            </div>

            {/* Dropdown menu */}
            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-700 rounded-md shadow-lg z-50"
                >
                    <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-500"
                        onClick={() => {
                            // console.log("Edit post:", postId);
                            setIsMenuOpen(false);
                        }}
                    >
                        Edit Post
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-500"
                        onClick={() => {
                            handlePostDelete()
                            setIsMenuOpen(false);
                        }}
                    >
                        Delete Post
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostActions;
