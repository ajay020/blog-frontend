import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser, resetStatus } from "../features/auth/authSlice";
import { RootState } from "../app/store";
import FormInput from "@/components/UI/FormInput";

const fields = [
  {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "John Doe",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "john@example.com",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "••••••••",
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    placeholder: "••••••••",
  },
] as const;


interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, status, error } = useAppSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  // Handle auth state changes
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(
      registerUser({
        name,
        email,
        password,
        confirmPassword,
      })
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
          Create an account
        </h1>

        <form onSubmit={submitHandler} className="space-y-4">
          {fields.map((field) => (
            <FormInput
              key={field.name}
              {...field}
              value={formData[field.name]}
              onChange={onChange}
            />
          ))}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white
                       transition hover:bg-blue-700
                       disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Creating account..." : "Register"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-700
                         dark:text-blue-400 dark:hover:text-blue-300"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

