import { Post } from "../types/post";

interface PostItemProps {
  post: Post
}

const PostItem = ({
  post,
}: PostItemProps) => {


  return (
    <div className="">
      <h1>{post.title}</h1>
    </div>
  );
};

export default PostItem;
