import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPostById } from "../features/post/postSlice";

const PostDetails = () => {
  const { postId } = useParams();
  const { user, username, title, content, createdAt, imageUrl } = useSelector(
    (state) => getPostById(postId, state)
  );

  const currentuser = useSelector((state) => state.auth.user);

  let date = new Date(createdAt);
  let formatedDate =
    date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();

  //   console.log(imageUrl);

  return (
    <div className="container w-50  mx-auto" style={{ marginTop: "100px" }}>
      <div className="card my-3">
        {/* {imageUrl && (
          <imgf
            src={imageUrl}
            alt=""
            style={{ width: "100%", height: "280px" }}
          />
        )} */}

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
            {/* <div className=" d-flex">
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
          </div> */}
          </div>
          <hr className=" my-1 p-0" />
          <div className="" style={{ whiteSpace: "pre-wrap" }}>
            <p className="">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
