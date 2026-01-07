import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getBookMarkPosts } from "./../features/auth/authSlice";

const BookMarkPostList = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    isError,
    message,
    user: currentUser,
    bookMarks,
  } = useSelector((state) => state.auth);
  //   console.log(bookmarkPosts, isLoading, isError, message);

  //show toast message
  const notify = (message) => toast(message);

  useEffect(() => {
    if (isError) {
      notify(message);
    }

    function fetchBookMarkPosts() {
      dispatch(getBookMarkPosts());
      console.log("fetching posts..");
    }
    if (currentUser) {
      fetchBookMarkPosts();
      console.log("fetching posts..1");
    }
  }, [isError, message, dispatch]);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div
      className="
    container-fluid d-flex
    flex-column align-items-center
    bg-secondary  vh-100"
      style={{ marginTop: "55px" }}
    >
      {bookMarks.length === 0 && (
        <div>
          <h2>No Bookmark available</h2>
          <h1>Bookmark your favourite Posts</h1>
        </div>
      )}
      {bookMarks.map((post) => (
        <div key={post._id} className="card my-2" style={{ width: "26rem" }}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className=" me-2">
                <Link to={`/post-details/${post._id}`}>
                  <p className="card-title fw-bold m-0 p-0 text-capitalize fs-5 lh-1">
                    {post.title}
                  </p>
                </Link>
                <small className=" m-0 p-0 fst-normal text-capitalize ">
                  {currentUser ? currentUser.name : "Anonymous"}
                </small>
              </div>
            </div>
            <hr className=" my-1 p-0" />
            {/* <p className="card-text">{content}</p> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookMarkPostList;
