import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { registerUser } from "../features/auth/authSlice";
import { reset } from "../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;
  const { user, isSuccess, isError, message, isLoading } = useSelector(
    (state) => state.auth
  );

  //show toast message
  const notify = (message) => toast(message);

  useEffect(() => {
    if (isError) {
      console.log(message);
      notify(message);
    }
    if (isSuccess || user) {
      // register successful, go to home page
      navigate("/");
    }
    dispatch(reset());
  }, [isSuccess, isError, message, user, dispatch]);

  const onChange = (e) => {
    setFormData((prvState) => ({
      ...prvState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      notify("Please enter all fields");
      return;
    }

    if (password !== password2) {
      notify("Password didn't match");
      //   console.log("Password didn't match");
      return;
    }

    const userData = {
      name,
      email,
      password,
    };
    dispatch(registerUser(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div
      className="container w-50 mx-auto  p-2 bg-secondary text-black"
      style={{ marginTop: "5rem" }}
    >
      <h3 className="text-center">Register</h3>

      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            onChange={onChange}
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter name"
            value={name}
            name="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            onChange={onChange}
            type="email"
            name="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            onChange={onChange}
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            name="password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            onChange={onChange}
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Confirm Password"
            value={password2}
            name="password2"
          />
        </div>
        <div className="form-group text-center my-2">
          <button type="submit" className="btn bg-black text-white">
            Register
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

export default Register;
