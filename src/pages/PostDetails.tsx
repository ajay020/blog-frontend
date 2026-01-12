import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPostById } from "../features/post/postSlice";
import PostComments from "../components/post/post-comments";
import PostActions from "../components/post/post-actions";
import PostDetailsSkeleton from "../components/post/post-detail-skeleton";
import { useBookmark } from "../hooks/useBookmark";

const PostDetails = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useAppDispatch();

  // console.log("PostDetails mounted for postId:", postId);

  const { selectedPost, status } = useAppSelector(
    (state) => state.posts
  );

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
    }
  }, [postId, dispatch]);

  if (status == "loading" || !selectedPost) {
    return <PostDetailsSkeleton />;
  }

  const post = selectedPost;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-white">

      {/* Back */}
      <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
        <ArrowLeft size={18} />
        Back
      </Link>

      {/* Author */}
      <div className="mb-4">
        <p className="text-sm text-slate-400">
          Posted by <span className="text-white">{post.author.name}</span>
        </p>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">
        {post.title}
      </h1>

      {/* Image */}
      {post.image?.url && (
        <img
          src={post.image.url}
          className="w-full rounded-xl mb-6 max-h-[500px] object-cover"
          alt="post"
        />
      )}

      {/* Content */}
      <p className="text-slate-300 leading-relaxed mb-6">
        {post.content}
      </p>

      {/* Actions */}
      <PostActions postId={post._id} />

      {/* Comments */}
      <PostComments postId={post._id} />
    </div>
  );
};

export default PostDetails;
