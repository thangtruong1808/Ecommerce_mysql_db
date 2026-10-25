import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { FaArrowLeft, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import AuthShell from "../components/auth/AuthShell";
import { Button } from "../components/ui";
import { Field } from "../components/ui/Field";
import { controlClass } from "../components/ui/styles";
import usePageTitle from "../hooks/usePageTitle";

interface ResetFields {
  email: string;
}

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function messageFrom(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "Failed to send reset email. Please try again.";
  }
  const data = error.response?.data as { message?: string; errors?: { msg?: string }[] } | undefined;
  if (error.response?.status === 400 && data?.errors?.length) {
    return data.errors.map((item) => item.msg).filter(Boolean).join(", ") || "Invalid email address";
  }
  return data?.message || "Failed to send reset email. Please try again.";
}

function ResetPassword() {
  usePageTitle("Reset Password");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFields>();

  const onSubmit = async (data: ResetFields) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", { email: data.email });
      setEmailSent(true);
      toast.success(response.data?.message || "If that email exists, a password reset link has been sent.");
    } catch (error) {
      toast.error(messageFrom(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset password"
      intro={
        <>
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </>
      }
      aside={
        <>
          <p className="mb-2 text-sm font-semibold text-primary">Password recovery</p>
          <h2 className="mb-4 text-4xl font-bold leading-tight text-ink">Reset your password</h2>
          <p className="mb-6 text-muted">We email a link that expires in 1 hour. The message does not confirm whether the address is registered.</p>
          <ul className="space-y-4 text-sm text-muted">
            <li className="flex items-start gap-3">
              <FaShieldAlt className="mt-1 text-primary" aria-hidden="true" />
              The reset link expires after 1 hour.
            </li>
            <li className="flex items-start gap-3">
              <FaEnvelope className="mt-1 text-primary" aria-hidden="true" />
              Check the inbox for the address you enter.
            </li>
          </ul>
        </>
      }
    >
      {emailSent ? (
        <div className="space-y-4 text-center">
          <FaEnvelope className="mx-auto text-3xl text-success" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-ink">Check your email</h2>
          <p className="text-sm text-muted">
            If that address can receive mail from the store, a reset link is on its way. The link expires in 1 hour.
          </p>
          <Link
            to="/login"
            className="inline-flex h-10 w-full items-center justify-center rounded-ui-sm bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field id="reset-email" label="Email address" error={errors.email?.message}>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className={controlClass(Boolean(errors.email))}
              {...register("email", {
                required: "Email is required",
                pattern: { value: emailPattern, message: "Invalid email address" },
              })}
            />
          </Field>
          <Button type="submit" className="w-full" loading={loading}>
            Send reset link
          </Button>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 rounded-ui-sm text-sm text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <FaArrowLeft aria-hidden="true" />
            Back to sign in
          </Link>
        </form>
      )}
    </AuthShell>
  );
}

export default ResetPassword;
