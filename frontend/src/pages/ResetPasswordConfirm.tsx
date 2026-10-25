import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import AuthShell from "../components/auth/AuthShell";
import PasswordField from "../components/auth/PasswordField";
import { Button } from "../components/ui";
import usePageTitle from "../hooks/usePageTitle";

interface ConfirmFields {
  password: string;
  confirmPassword: string;
}

function ResetPasswordConfirm() {
  usePageTitle("Confirm Password Reset");
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConfirmFields>();
  const password = watch("password");

  useEffect(() => {
    if (!success) {
      return undefined;
    }
    const timer = setTimeout(() => navigate("/login"), 3000);
    return () => clearTimeout(timer);
  }, [navigate, success]);

  const onSubmit = async (data: ConfirmFields) => {
    if (!token) {
      toast.error("This reset link is missing a token.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", { token, password: data.password });
      setSuccess(true);
      toast.success("Password has been reset successfully");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message || "Failed to reset password"
        : "Failed to reset password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthShell title="Password reset">
        <div className="space-y-4 text-center">
          <FaCheckCircle className="mx-auto text-3xl text-success" aria-hidden="true" />
          <p className="text-muted">Your password has been reset. Taking you to sign in.</p>
          <Button type="button" className="w-full" onClick={() => navigate("/login")}>
            Go to sign in
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set a new password"
      intro={<p>Choose a password with at least 6 characters.</p>}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <PasswordField
          id="new-password"
          label="New password"
          autoComplete="new-password"
          placeholder="New password"
          shown={showPassword}
          error={errors.password?.message}
          onToggle={() => setShowPassword((value) => !value)}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
        />
        <PasswordField
          id="confirm-new-password"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          shown={showConfirmPassword}
          error={errors.confirmPassword?.message}
          onToggle={() => setShowConfirmPassword((value) => !value)}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Reset password
        </Button>
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 rounded-ui font-ui text-sm font-semibold text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <FaArrowLeft aria-hidden="true" />
          Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
}

export default ResetPasswordConfirm;
