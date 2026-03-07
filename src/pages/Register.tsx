import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { register, selectAuth } from "@/features/auth/authSlice";
import ErrorBanner from "@/components/common/ErrorBanner";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

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
  const { isLoading, error, fieldErrors } = useAppSelector(selectAuth);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords didn't match");
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
        {error && <ErrorBanner message={error} />}

        <form onSubmit={submitHandler} className="space-y-4">
          {fields.map((field) => (
            <Input
              key={field.name}
              {...field}
              value={formData[field.name]}
              onChange={onChange}
              required
              error={fieldErrors[field.name]}
            />
          ))}

          <Button type="submit" variant="primary" isLoading={isLoading}>
            Register
          </Button>

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

