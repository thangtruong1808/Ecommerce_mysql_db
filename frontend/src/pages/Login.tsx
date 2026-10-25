import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaLock, FaShieldAlt, FaSmile } from "react-icons/fa";
import AuthShell from "../components/auth/AuthShell";
import PasswordField from "../components/auth/PasswordField";
import { Button } from "../components/ui";
import { Field } from "../components/ui/Field";
import { controlClass } from "../components/ui/styles";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

interface LoginFields {
  email: string;
  password: string;
}

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function Login() {
  usePageTitle("Sign In");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [loginError, setLoginError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFields) => {
    setLoading(true);
    setLoginError("");
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success("Login successful!");
        navigate("/");
        return;
      }
      setLoginError(result.error || "Invalid email or password. Please try again.");
    } catch {
      setLoginError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in to your account"
      intro={
        <>
          Or{" "}
          <Link to="/register" className="font-ui font-semibold text-primary underline-offset-2 hover:text-primary-hover hover:underline">
            create a new account
          </Link>
        </>
      }
      aside={
        <>
          <p className="mb-2 font-ui text-sm font-semibold text-primary">Secure access</p>
          <h2 className="mb-3 font-ui text-lg font-semibold text-ink">Welcome back</h2>
          <p className="mb-6 text-muted">Sign in to manage orders, track deliveries, and continue shopping.</p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FaLock className="mt-1 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-ink">Secure sessions</span>
                <span className="text-sm text-muted">Sign-in uses an encrypted cookie session.</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaShieldAlt className="mt-1 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-ink">Pick up where you left off</span>
                <span className="text-sm text-muted">Your cart can move with you after you sign in.</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaSmile className="mt-1 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-ink">Help when you need it</span>
                <span className="text-sm text-muted">Reset a password from the sign-in page.</span>
              </span>
            </li>
          </ul>
        </>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field id="login-email" label="Email" error={errors.email?.message}>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={controlClass(Boolean(errors.email || loginError))}
            aria-invalid={errors.email || loginError ? true : undefined}
            {...register("email", {
              required: "Email is required",
              pattern: { value: emailPattern, message: "Invalid email address" },
            })}
          />
        </Field>
        <PasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          shown={showPassword}
          error={errors.password?.message}
          onToggle={() => setShowPassword((value) => !value)}
          {...register("password", { required: "Password is required" })}
        />
        {loginError ? (
          <p role="alert" className="rounded-ui border border-danger/40 bg-surface-muted px-3 py-2 text-sm text-danger">
            {loginError}
          </p>
        ) : null}
        <div className="text-right">
          <Link to="/forgot-password" className="rounded-ui font-ui text-sm font-semibold text-primary underline-offset-2 hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Forgot password?
          </Link>
        </div>
        <div className="text-center">
          <button
            type="button"
            className="rounded-ui font-ui text-sm font-semibold text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-expanded={showSample}
            onClick={() => setShowSample((value) => !value)}
          >
            {showSample ? "Hide" : "Show"} sample credentials
          </button>
          {showSample ? (
            <div className="mt-2 rounded-ui-lg border border-line bg-canvas p-4 text-left text-sm text-ink">
              <p>
                <strong>Admin:</strong> adminuser@gmail.com
                <br />
                <strong>Password:</strong> 123456!
              </p>
              <hr className="my-2 border-line" />
              <p>
                <strong>Customer:</strong> alice.johnson@gmail.com
                <br />
                <strong>Password:</strong> 123456
              </p>
            </div>
          ) : null}
        </div>
        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>
        <p className="text-center text-xs text-muted">Sign-in uses a secure cookie session.</p>
      </form>
    </AuthShell>
  );
}

export default Login;
