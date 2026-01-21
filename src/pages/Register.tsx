import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import FormInput from "@/components/UI/FormInput";
import { register, selectAuth } from "@/features/auth/authSlice";

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

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const { isLoading, error } = useAppSelector(selectAuth);


  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const result = await dispatch(
      register({
        name,
        email,
        password,
      })
    );

    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
          Create an account
        </h1>


        {error && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

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
            {isLoading ? "Creating account..." : "Register"}
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

