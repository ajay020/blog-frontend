import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { loginUser, resetStatus } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import FormInput from "@/components/UI/FormInput";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const { user, error } = useAppSelector(
    (state) => state.auth
  );

  const { email, password } = formData;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetStatus());
    }
  }, [error, dispatch]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const userData = {
      email,
      password,
    };

    if (email && password) {
      dispatch(loginUser(userData));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
          Sign In
        </h1>

        <form onSubmit={submitHandler} className="space-y-4">
          <FormInput
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={onChange}
            placeholder="john@example.com"
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={onChange}
            placeholder="password"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white
                       transition hover:bg-blue-700
                       disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>

          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
