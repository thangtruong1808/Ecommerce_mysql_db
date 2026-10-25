import { toast } from "react-toastify";
import { isProtectedRoute } from "./errorSuppression.js";

interface RedirectFlag {
  current: boolean;
}

export async function handleTokenExpiration(
  setUser: (user: null) => void,
  setError: (error: null) => void,
  isRedirectingRef: RedirectFlag,
): Promise<void> {
  if (isRedirectingRef.current) {
    return;
  }
  isRedirectingRef.current = true;
  const path = window.location.pathname;
  const isAuthPage =
    path === "/login" ||
    path === "/register" ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password");

  if (!isAuthPage && isProtectedRoute()) {
    setUser(null);
    setError(null);
    toast.info("You have been logged out.");
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
    return;
  }
  isRedirectingRef.current = false;
}

export function hasRefreshToken(): boolean {
  return document.cookie.split(";").some((cookie) => cookie.trim().startsWith("refreshToken="));
}

export function shouldSuppress401Toast(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const response = (error as { response?: { status?: number } }).response;
  if (response?.status !== 401 || !hasRefreshToken() || !isProtectedRoute()) {
    return false;
  }
  const url = (error as { config?: { url?: string } }).config?.url || "";
  if (
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/register") ||
    url.includes("/api/auth/profile") ||
    url.includes("/api/auth/refresh")
  ) {
    return false;
  }
  return true;
}
