import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../features/post/postSlice";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
// import { useEffect } from "react";

const UpdatePost = () => {
  const { postId } = useParams();

  const { posts, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.post
  );
  const post = posts.find((post) => post._id === postId);

  const [formData, setFormData] = useState({
    title: post?.title,
    content: post?.content,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { title, content } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const postData = {
      ...formData,
    };
    dispatch(updatePost({ postData, postId }));
    setFormData({ title: "", content: "" });
    navigate("/");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div
      className="container w-50 mx-auto bg-secondary p-2"
      style={{ marginTop: "5rem" }}
    >
      <h3 className="text-center">Update Post </h3>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="titleInput">Post Title</label>
          <input
            onChange={onChange}
            type="text"
            name="title"
            value={title}
            className="form-control"
            id="titleInput"
            aria-describedby="titleHelp"
            placeholder="Enter title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="postContent">Post Content</label>
          <textarea
            onChange={onChange}
            name="content"
            value={content}
            type="text"
            className="form-control"
            id="postContent"
            placeholder="write here..."
          />
        </div>
        <div className="form-group my-2">
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePost;
