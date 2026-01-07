import { useState } from "react";
import PostModal from "../components/post/post-modal";

const AddPost = () => {
  const [isModelOpen, setIsModelOpen] = useState(true);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Post</h2>
      <PostModal isOpen={isModelOpen} onClose={() => { setIsModelOpen(false) }} />
    </div>
  );
};

export default AddPost;
