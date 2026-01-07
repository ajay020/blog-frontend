import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { createPost } from "../features/post/postService";

const AddPost = () => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const { title, content } = postData;
  const { status } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const onChange = (e) => {
    setPostData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!title) return;
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("image", postData.image);

    dispatch(createPost(formData));
    setPostData({ title: "", content: "" });
    navigate("/");
  };

  if (status === "loading") {
    return <h2>Posting...</h2>;
  }

  return (
    <div
      className="container w-50 mx-auto bg-secondary p-2 text-black"
      style={{ marginTop: "5rem" }}
    >
      <h3 className="text-center">Create Post </h3>
      <form onSubmit={submitHandler} encType="multipart/form-data">
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
        <div className="form-group">
          <label htmlFor="uploadFile">Upload image</label>
          <input
            onChange={(e) => (postData.image = e.target.files[0])}
            name="image"
            type="file"
            className="form-control"
            id="uploadFile"
          />
        </div>
        <div className="form-group my-2">
          <button type="submit" className="btn btn-primary">
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
