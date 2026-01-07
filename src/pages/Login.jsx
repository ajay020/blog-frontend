import { loginUser, reset } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  //show toast message
  const notify = (message) => toast(message);

  const { isSuccess, isError, user, isLoading, message } = useSelector(
    (state) => state.auth
  );

  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      //show toast message
      notify(message);
    }
    if (user || isSuccess) {
      navigate("/");
    }

    dispatch(reset());
  }, [isSuccess, isError, user, isLoading, message]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    if (email && password) {
      dispatch(loginUser(userData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div
      className="container w-50 mx-auto p-2 bg-secondary text-black"
      style={{ marginTop: "5rem" }}
    >
      <h3 className="text-center">Login</h3>

      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Email"
            onChange={onChange}
            value={email}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            onChange={onChange}
            value={password}
          />
        </div>
        <div className="form-group text-center my-2">
          <button type="submit" className="btn text-white bg-black">
            Login
          </button>
        </div>
      </form>
      <div className="text-center">
        <p>Or</p>
        <p>Login with Google Account</p>
        {/* <GoogleSignIn /> */}
      </div>
    </div>
  );
};

export default Login;
