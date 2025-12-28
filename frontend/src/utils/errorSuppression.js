/**
 * Error Suppression Utilities
 * Suppresses console errors for silent 401 errors and expected authentication errors
 * @author Thang Truong
 * @date 2025-12-23
 */

import { hasRefreshToken } from "./authUtils.js";

/**
 * Check if current route is protected (requires authentication)
 * @returns {boolean} True if route is protected
 * @author Thang Truong
 * @date 2025-12-12
 */
const isProtectedRoute = () => {
  const path = window.location.pathname;
  const protectedPaths = [
    "/profile",
    "/checkout",
    "/orders",
    "/invoices",
    "/admin",
  ];
  return protectedPaths.some((protectedPath) => path.startsWith(protectedPath));
};

/**
 * Check if error should be suppressed
 * @param {Object} error - Error object
 * @returns {boolean} True if error should be suppressed
 * @author Thang Truong
 * @date 2025-12-23
 */
const shouldSuppressError = (error) => {
  // Suppress silent errors
  if (error?._silent || error?.config?._silent) {
    return true;
  }

  // Suppress 401 errors from auth endpoints that should be silent
  if (error?.response?.status === 401) {
    const path = window.location.pathname;
    const isProtected = isProtectedRoute();
    const isAuthPage =
      path === "/login" ||
      path === "/register" ||
      path.startsWith("/forgot-password") ||
      path.startsWith("/reset-password");
    const isPublicPage = !isProtected && !isAuthPage;
    const isAuthEndpoint =
      error.config?.url?.includes("/api/auth/") ||
      error.config?.url?.includes("/api/auth/refresh");
    const isRefreshEndpoint = error.config?.url?.includes("/api/auth/refresh");

    // Suppress 401 errors from refresh endpoints (expected during token refresh)
    // or from auth endpoints on public pages
    // Also suppress 401 errors on protected routes when refresh token exists (token refresh in progress)
    if (
      isRefreshEndpoint ||
      (isPublicPage && isAuthEndpoint) ||
      error.config?._silent
    ) {
      return true;
    }

    // Suppress 401 errors on protected routes when refresh token exists
    // These occur during token refresh and should be silent
    if (isProtected && hasRefreshToken()) {
      return true;
    }
  }

  return false;
};

/**
 * Setup console error suppression for silent authentication errors
 * Suppresses both JavaScript errors and network request errors from refresh endpoint
 * @returns {Function} Cleanup function
 * @author Thang Truong
 * @date 2025-12-23
 */
export const setupErrorSuppression = () => {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Check for network error strings like "GET /api/some/path 401 (Unauthorized)"
    if (
      typeof args[0] === "string" &&
      args[0].includes(" 401") &&
      args[0].includes("/api/")
    ) {
      // If a refresh token exists, we expect a 401 to occur as part of the silent refresh flow.
      // In this case, we suppress the error to avoid polluting the console.
      if (hasRefreshToken()) {
        return; // Suppress the error.
      }
    }

    // Fallback for object-based errors and other cases
    const error = args[0];
    if (shouldSuppressError(error)) {
      return; // Suppress silent errors based on existing logic
    }

    // Log all other errors normally
    originalConsoleError.apply(console, args);
  };

  // Override console.warn to suppress refresh endpoint warnings
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("/api/auth/refresh")) {
      return; // Suppress refresh endpoint warnings
    }
    originalConsoleWarn.apply(console, args);
  };

  // Handle unhandled promise rejections (axios errors)
  const handleUnhandledRejection = (event) => {
    const error = event.reason;
    if (shouldSuppressError(error)) {
      event.preventDefault();
      return;
    }
    // Also suppress if it's a refresh endpoint error
    if (error?.config?.url?.includes("/api/auth/refresh")) {
      event.preventDefault();
      return;
    }
  };

  window.addEventListener("unhandledrejection", handleUnhandledRejection);

  return () => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  };
};

export { isProtectedRoute };
