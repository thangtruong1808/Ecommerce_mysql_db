/**
 * Axios Interceptors
 * Handles request and response interceptors for authentication
 * @author Thang Truong
 * @date 2025-12-23
 */

import axios from "axios";
import { isProtectedRoute } from "./errorSuppression.js";
import { handleTokenExpiration, hasRefreshToken } from "./authUtils.js";
import { fetchUser } from "./authApi.js";

/**
 * Handle token refresh for 401 responses
 * @param {Object} originalRequest - Original request config
 * @param {Object} refs - Refs object
 * @param {Function} setUser - Set user function
 * @param {Function} setError - Set error function
 * @param {Object} isRedirectingRef - Redirect ref
 * @returns {Promise} Refresh result
 * @author Thang Truong
 * @date 2025-12-23
 */
const handleTokenRefresh = async (
  originalRequest,
  refs,
  setUser,
  setError,
  isRedirectingRef
) => {
  const { isRefreshingTokenRef, lastRefreshTimeRef } = refs;
  const path = window.location.pathname;
  const isProtected = isProtectedRoute();
  const isAuthPage =
    path === "/login" ||
    path === "/register" ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password");
  const isPublicPage = !isProtected && !isAuthPage;

  if (isPublicPage || !hasRefreshToken()) {
    return null;
  }

  const now = Date.now();
  if (isRefreshingTokenRef.current || now - lastRefreshTimeRef.current < 5000) {
    return null;
  }

  isRefreshingTokenRef.current = true;
  lastRefreshTimeRef.current = now;

  try {
    const refreshResponse = await axios.post(
      "/api/auth/refresh",
      {},
      {
        validateStatus: (status) => status === 200 || status === 401,
        _silent: true,
        withCredentials: true,
      }
    );

    if (refreshResponse.status === 200) {
      originalRequest._retry = false;
      return axios(originalRequest);
    } else {
      isRefreshingTokenRef.current = false;
      if (isProtected) {
        await handleTokenExpiration(setUser, setError, isRedirectingRef);
      }
      return null;
    }
  } catch (refreshError) {
    isRefreshingTokenRef.current = false;
    if (isProtected) {
      await handleTokenExpiration(setUser, setError, isRedirectingRef);
    }
    return null;
  }
};

/**
 * Setup request interceptor to queue requests during token refresh
 * This prevents 401 errors by ensuring requests wait for token refresh to complete
 * @param {Object} refs - Refs object from AuthContext
 * @returns {Function} Cleanup function
 * @author Thang Truong
 * @date 2025-12-23
 */
export const setupRequestInterceptor = (refs) => {
  const requestInterceptor = axios.interceptors.request.use(
    async (config) => {
      // Mark ALL refresh token calls as silent to prevent console errors
      if (config.url?.includes("/api/auth/refresh")) {
        config._silent = true;
        return config;
      }

      // Don't queue auth endpoints
      if (
        config.url?.includes("/api/auth/login") ||
        config.url?.includes("/api/auth/register") ||
        config.url?.includes("/api/auth/profile") ||
        config.url?.includes("/api/auth/me")
      ) {
        return config;
      }

      // Queue requests on protected routes during token refresh
      const path = window.location.pathname;
      const isProtected = isProtectedRoute();
      if (isProtected && hasRefreshToken() && refs) {
        const { isRefreshingTokenRef } = refs;

        // If refresh is in progress, wait for it to complete
        if (isRefreshingTokenRef.current) {
          // Wait for refresh to complete (max 5 seconds)
          const startTime = Date.now();
          while (
            isRefreshingTokenRef.current &&
            Date.now() - startTime < 5000
          ) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
  return () => axios.interceptors.request.eject(requestInterceptor);
};

/**
 * Setup response interceptor to handle expected 401 errors silently
 * Marks all refresh endpoint 401 errors as silent to prevent console logging
 * @returns {Function} Cleanup function
 * @author Thang Truong
 * @date 2025-12-23
 */
export const setupResponseInterceptor = () => {
  const responseInterceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const { config, response } = error;
      const isRefreshEndpoint = config?.url?.includes("/api/auth/refresh");

      // If a 401 error occurs (but not on the refresh endpoint itself) and we have a
      // refresh token, we assume the main `setupTokenRefreshInterceptor` will handle it.
      // To prevent this error from being logged as an "unhandled rejection", we
      // return a new, pending promise, effectively swallowing the error here.
      if (response?.status === 401 && !isRefreshEndpoint && hasRefreshToken()) {
        return new Promise(() => {});
      }

      // For all other errors (like 500s, or 401s when no refresh is possible),
      // reject the promise so they can be handled by other parts of the app.
      return Promise.reject(error);
    }
  );
  return () => axios.interceptors.response.eject(responseInterceptor);
};

/**
 * Setup axios interceptor for automatic token refresh and auto-logout
 * @param {Object} refs - Refs object containing isRefreshingTokenRef, lastRefreshTimeRef, refreshFailureCountRef
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @param {Object} isRedirectingRef - Ref to track if redirecting
 * @returns {Function} Cleanup function
 * @author Thang Truong
 * @date 2025-12-23
 */
export const setupTokenRefreshInterceptor = (
  refs,
  setUser,
  setError,
  isRedirectingRef
) => {
  const {
    isRefreshingTokenRef,
    lastRefreshTimeRef,
    refreshFailureCountRef,
    isFetchingUserRef,
    userFetchedTimeRef,
    userRef,
  } = refs;

  const interceptor = axios.interceptors.response.use(
    async (response) => {
      // Check if response is 401 (treated as valid by validateStatus)
      // This happens when dashboard API functions use validateStatus to prevent browser console errors
      if (
        response.status === 401 &&
        response.config &&
        !response.config._retry
      ) {
        const originalRequest = response.config;
        // Don't handle 401 from auth endpoints
        if (
          originalRequest.url?.includes("/api/auth/login") ||
          originalRequest.url?.includes("/api/auth/profile") ||
          originalRequest.url?.includes("/api/auth/register")
        ) {
          return response;
        }
        originalRequest._retry = true;
        const result = await handleTokenRefresh(
          originalRequest,
          refs,
          setUser,
          setError,
          isRedirectingRef
        );
        return result || response;
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      // Handle 429 errors (rate limit) - don't retry, just reject silently
      if (error.response?.status === 429) {
        // Don't show toast for rate limit errors - they're expected during rapid refreshes
        return Promise.reject(error);
      }
      // Only handle 401 errors
      if (!error.response || error.response.status !== 401) {
        return Promise.reject(error);
      }
      // Don't intercept 401 errors from auth endpoints
      if (
        originalRequest.url?.includes("/api/auth/login") ||
        originalRequest.url?.includes("/api/auth/profile") ||
        originalRequest.url?.includes("/api/auth/register")
      ) {
        return Promise.reject(error);
      }
      // Handle 401 errors on protected endpoints only
      // Don't try to refresh token on public pages for unauthenticated users
      const path = window.location.pathname;
      const isProtected = isProtectedRoute();
      const isAuthPage =
        path === "/login" ||
        path === "/register" ||
        path.startsWith("/forgot-password") ||
        path.startsWith("/reset-password");
      const isPublicPage = !isProtected && !isAuthPage;

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        // If refresh endpoint returns 401, refresh token expired
        if (originalRequest.url?.includes("/api/auth/refresh")) {
          // Mark all refresh endpoint 401 errors as silent (they're expected during token refresh)
          error._silent = true;
          if (error.config) {
            error.config._silent = true;
          }
          // Only clear user and redirect if on protected route
          if (isProtected) {
            await handleTokenExpiration(setUser, setError, isRedirectingRef);
          }
          return Promise.reject(error);
        }
        // Only try to refresh token on protected pages
        // On public pages, just reject the error silently
        if (isPublicPage) {
          error._silent = true;
          if (error.config) {
            error.config._silent = true;
          }
          return Promise.reject(error);
        }
        // Mark 401 errors on protected routes as silent if refresh token exists
        // This prevents console errors when token refresh is in progress
        if (isProtected && hasRefreshToken()) {
          error._silent = true;
          if (error.config) {
            error.config._silent = true;
          }
        }
        // Try to refresh token (only on protected pages)
        // Prevent duplicate refresh calls to avoid 429 rate limit errors
        const now = Date.now();
        if (
          isRefreshingTokenRef.current ||
          now - lastRefreshTimeRef.current < 5000
        ) {
          // If refresh is in progress or was recent, don't re-throw the error.
          // Instead, return a pending promise to prevent the original call from failing
          // and causing an unhandled promise rejection.
          return new Promise(() => {});
        }

        isRefreshingTokenRef.current = true;
        lastRefreshTimeRef.current = now;

        // Mark refresh call as silent to suppress console errors
        try {
          const refreshResponse = await axios.post(
            "/api/auth/refresh",
            {},
            {
              validateStatus: (status) => status === 200 || status === 401,
              _silent: true, // Mark as silent to suppress console errors
              withCredentials: true,
            }
          );
          isRefreshingTokenRef.current = false;
          if (refreshResponse.status === 200) {
            // Token refreshed successfully - reset failure count
            refreshFailureCountRef.current = 0;
            // If user state is null, restore it after successful token refresh
            // This handles cases where user state was lost due to inactivity
            if (userRef && !userRef.current && hasRefreshToken()) {
              // Restore user state after successful token refresh
              const tempFetchingRef = { current: false };
              fetchUser(
                setUser,
                setError,
                () => {},
                tempFetchingRef,
                userFetchedTimeRef,
                hasRefreshToken
              );
            }
            // Retry original request - mark as silent to suppress console errors
            originalRequest._silent = true;
            return axios(originalRequest);
          } else {
            // Refresh token expired - only logout if on protected route
            if (isProtected) {
              await handleTokenExpiration(setUser, setError, isRedirectingRef);
            }
            return Promise.reject(error);
          }
        } catch (refreshError) {
          isRefreshingTokenRef.current = false;
          // Handle 429 errors gracefully - don't logout user
          if (refreshError.response?.status === 429) {
            refreshError._silent = true;
            if (refreshError.config) {
              refreshError.config._silent = true;
            }
            // Don't logout on rate limit - just reject the original error
            return Promise.reject(error);
          }
          // Mark refresh error as silent to suppress console errors
          if (refreshError.config) {
            refreshError.config._silent = true;
          }
          refreshError._silent = true;
          // Refresh failed - check if it's 401 (expired) or other error
          if (refreshError.response?.status === 401) {
            // Mark 401 from refresh endpoint as silent (expected during token refresh)
            refreshError._silent = true;
            if (refreshError.config) {
              refreshError.config._silent = true;
            }
            // Refresh token expired - only logout if on protected route
            if (isProtected) {
              await handleTokenExpiration(setUser, setError, isRedirectingRef);
            }
          }
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  return () => axios.interceptors.response.eject(interceptor);
};
