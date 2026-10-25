import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaHeadset, FaIdBadge, FaUsers } from "react-icons/fa";
import AuthShell from "../components/auth/AuthShell";
import PasswordField from "../components/auth/PasswordField";
import { Button } from "../components/ui";
import { Field } from "../components/ui/Field";
import { controlClass } from "../components/ui/styles";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

interface RegisterFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function Register() {
  usePageTitle("Create Account");
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFields>();
  const password = watch("password");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFields) => {
    setLoading(true);
    try {
      const result = await registerUser(data.name, data.email, data.password);
      if (result.success) {
        toast.success("Registration successful!");
        navigate("/");
        return;
      }
      toast.error(result.error || "Registration failed");
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      intro={
        <>
          Or{" "}
          <Link to="/login" className="font-ui font-semibold text-primary underline-offset-2 hover:text-primary-hover hover:underline">
            sign in to your existing account
          </Link>
        </>
      }
      aside={
        <>
          <p className="mb-2 font-ui text-sm font-semibold text-primary">New account</p>
          <h2 className="mb-3 font-ui text-lg font-semibold text-ink">Create an account to shop and track orders</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FaIdBadge className="mt-1 text-primary" aria-hidden="true" />
              <span className="text-sm text-muted">Use your name and email. Passwords need at least 6 characters.</span>
            </li>
            <li className="flex items-start gap-3">
              <FaUsers className="mt-1 text-primary" aria-hidden="true" />
              <span className="text-sm text-muted">A customer account can review products after a purchase.</span>
            </li>
            <li className="flex items-start gap-3">
              <FaHeadset className="mt-1 text-primary" aria-hidden="true" />
              <span className="text-sm text-muted">You can reset a forgotten password from the sign-in page.</span>
            </li>
          </ul>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field id="register-name" label="Full name" error={errors.name?.message}>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Alex Johnson"
            className={controlClass(Boolean(errors.name))}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
              maxLength: { value: 100, message: "Name must be less than 100 characters" },
            })}
          />
        </Field>
        <Field id="register-email" label="Email" error={errors.email?.message}>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={controlClass(Boolean(errors.email))}
            {...register("email", {
              required: "Email is required",
              pattern: { value: emailPattern, message: "Invalid email address" },
              maxLength: { value: 255, message: "Email must be less than 255 characters" },
            })}
          />
        </Field>
        <PasswordField
          id="register-password"
          label="Password"
          autoComplete="new-password"
          placeholder="Create a password"
          shown={showPassword}
          error={errors.password?.message}
          onToggle={() => setShowPassword((value) => !value)}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
            maxLength: { value: 100, message: "Password must be less than 100 characters" },
          })}
        />
        <PasswordField
          id="register-confirm"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          shown={showConfirm}
          error={errors.confirmPassword?.message}
          onToggle={() => setShowConfirm((value) => !value)}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Register
        </Button>
        <p className="text-center text-xs text-muted">Registration uses a secure cookie session.</p>
      </form>
    </AuthShell>
  );
}

export default Register;
