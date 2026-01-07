import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deletePost } from "../features/post/postSlice";
import { FaThumbsUp } from "react-icons/fa";
import { FiThumbsUp } from "react-icons/fi";
import { BsBookmark, BsBookFill } from "react-icons/bs";
import { upvotePost } from "./../features/post/postSlice";
import { useState } from "react";
import { bookMarkPost } from "../features/auth/authSlice";

const PostItem = ({
  post: { _id, user, username, title, content, createdAt, upvotes, imageUrl },
}) => {
  const { user: currentuser } = useSelector((state) => state.auth);

  const isUpvoted = upvotes.some((userId) => currentuser?._id === userId);

  const isBookMarked = currentuser?.bookmarkedPosts?.some(
    (item) => item._id?.toString() === _id?.toString()
  );

  const [toggleLike, setToggleLike] = useState(isUpvoted);
  const [toggleBookMark, setToggleBookMark] = useState(isBookMarked);
  const dispatch = useDispatch();

  const onClickHandler = (postId) => {
    dispatch(deletePost(postId));
  };

  let date = new Date(createdAt);
  let formatedDate =
    date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();

  let handleUpvote = (postId) => {
    if (currentuser) {
      dispatch(upvotePost(postId));
      setToggleLike(!toggleLike);
    }
  };

  let handleBookMark = (postId) => {
    if (currentuser) {
      dispatch(bookMarkPost(postId));
      setToggleBookMark(!toggleBookMark);
    }
  };

  const readMore = (
    <div>
      <p className="p-0 m-0 d-inline">{content.slice(0, 180)}</p>
      <span className="p-0 ms-1 text-primary">
        <Link to={`/post-details/${_id}`}>Read more...</Link>
      </span>
    </div>
  );

  return (
    <div className="card my-2" style={{ width: "30rem" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div className=" me-2">
            <p className="card-title fw-bold m-0 p-0 text-capitalize fs-5 lh-1">
              {title}
            </p>
            <small className=" m-0 p-0 fst-normal text-capitalize ">
              {username ? username : "Anonymous"}
            </small>
            <small className=" ms-2 p-0 fst-italic fw-lighter ">
              {formatedDate}
            </small>
          </div>
          <div className=" d-flex">
            {currentuser && currentuser._id === user.toString() && (
              <>
                <i
                  onClick={() => onClickHandler(_id)}
                  className="bi bi-trash3-fill me-3 text-danger"
                  role={"button"}
                ></i>
                <Link to={`/updatePost/${_id.toString()}`}>
                  <i className="bi bi-pencil-square" role={"button"}></i>
                </Link>
              </>
            )}
          </div>
        </div>
        <hr className=" my-1 p-0" />
        <div className="d-flex justify-content-between">
          <p className="card-text">
            {content.length > 100 ? readMore : content}
          </p>
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              style={{ width: "80px", height: "80px" }}
            />
          )}
        </div>
      </div>
      <div className="card-footer p-2 d-flex justify-content-between">
        <div className="d-flex align-items-center  ms-3">
          {toggleLike ? (
            <FaThumbsUp role={"button"} onClick={() => handleUpvote(_id)} />
          ) : (
            <FiThumbsUp role={"button"} onClick={() => handleUpvote(_id)} />
          )}

          <span className="ms-2 text-secondary">{upvotes.length}</span>
        </div>
        <div>
          <div className="me-3">
            {toggleBookMark ? (
              <BsBookFill role={"button"} onClick={() => handleBookMark(_id)} />
            ) : (
              <BsBookmark role={"button"} onClick={() => handleBookMark(_id)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
