import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { register, selectAuth } from "@/features/auth/authSlice";
import ErrorBanner from "@/components/common/ErrorBanner";
import Button from "@/components/UI/Button";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/authSchemas";
import FormInput from "@/components/form/form-input";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, error: serverError } = useAppSelector(selectAuth);

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const submitHandler = async (data: RegisterFormData) => {
    const result = await dispatch(
      register({
        name: data.name,
        email: data.email,
        password: data.password,
      })
    );

    if (register.fulfilled.match(result)) {
      navigate("/");
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
          Create an account
        </h1>

        {serverError && <ErrorBanner message={serverError} />}

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitHandler)}
            className="space-y-4"
          >
            <FormInput name="name" label="Name" placeholder="Jhon Doe" />

            <FormInput name="email" label="Email" placeholder="jhon@gmail.com" />

            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="....."
            />

            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="....."

            />

            <Button
              disabled={!methods.formState.isValid}
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
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
        </FormProvider>
      </div>
    </div>
  );
};

export default Register;

