/**
 * Token Refresh Hook
 * Handles periodic token expiration checks and token refresh logic
 * @author Thang Truong
 * @date 2025-01-28
 */

import { useEffect, useRef } from "react";
import axios from "axios";
import { isProtectedRoute } from "../utils/errorSuppression.js";
import { handleTokenExpiration, hasRefreshToken } from "../utils/authUtils.js";
import { initializeSession } from "../utils/authApi.js";

/**
 * Hook to check refresh token expiration periodically
 * @param {Object} user - Current user object
 * @param {Object} refs - Refs object containing isRefreshingTokenRef, lastRefreshTimeRef, refreshFailureCountRef, userFetchedTimeRef
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @param {Object} isRedirectingRef - Ref to track if redirecting
 * @param {Function} setTokenExpiresAt - Function to set token expiration state
 * @author Thang Truong
 * @date 2025-01-28
 */
export const useTokenRefresh = (
  user,
  refs,
  setUser,
  setError,
  isRedirectingRef,
  setTokenExpiresAt,
  getRefreshTokenExpiresAt,
  setRefreshTokenExpiresAt
) => {
  const { isRefreshingTokenRef, lastRefreshTimeRef, refreshFailureCountRef } =
    refs;

  useEffect(() => {
    if (!hasRefreshToken()) return;

    const proactivelyRefreshRefreshToken = async () => {
      const refreshTokenExpiresAt = getRefreshTokenExpiresAt();
      if (!refreshTokenExpiresAt) return;

      const now = Date.now();
      const oneMinute = 60 * 1000;

      if (refreshTokenExpiresAt < now) {
        await handleTokenExpiration(setUser, setError, isRedirectingRef);
        return;
      }

      // Proactively refresh if the refresh token expires in the next minute
      if (refreshTokenExpiresAt - now < oneMinute) {
        if (
          isRefreshingTokenRef.current ||
          now - lastRefreshTimeRef.current < 30000 // 30 seconds
        ) {
          return;
        }

        isRefreshingTokenRef.current = true;
        lastRefreshTimeRef.current = now;

        try {
          const response = await axios.post(
            "/api/auth/refresh",
            {},
            {
              validateStatus: (status) => status === 200 || status === 401,
              _silent: true,
              withCredentials: true,
            }
          );

          if (response.status === 200) {
            refreshFailureCountRef.current = 0;
            if (response.data.accessTokenExpiresAt) {
              setTokenExpiresAt(response.data.accessTokenExpiresAt);
            }
            if (response.data.refreshTokenExpiresAt) {
              setRefreshTokenExpiresAt(response.data.refreshTokenExpiresAt);
            }
          } else if (response.status === 401) {
            await handleTokenExpiration(setUser, setError, isRedirectingRef);
          }
        } catch (error) {
          if (error.response?.status !== 429) {
            await handleTokenExpiration(setUser, setError, isRedirectingRef);
          }
        } finally {
          setTimeout(() => {
            isRefreshingTokenRef.current = false;
          }, 10000);
        }
      }
    };

    const interval = setInterval(proactivelyRefreshRefreshToken, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [
    user,
    refs,
    setUser,
    setError,
    isRedirectingRef,
    getRefreshTokenExpiresAt,
    setRefreshTokenExpiresAt,
  ]);
};

/**
 * Refresh access token - called automatically when access token expires
 * Prevents duplicate calls to avoid 429 rate limit errors
 * @param {Object} refs - Refs object containing isRefreshingTokenRef, lastRefreshTimeRef, refreshFailureCountRef
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @param {Object} isRedirectingRef - Ref to track if redirecting
 * @param {Function} setRefreshTokenExpiresAt - Function to set refresh token expiration
 * @returns {Promise<boolean>} Success status
 * @author Thang Truong
 * @date 2025-12-17
 */
export const refreshToken = async (
  refs,
  setUser,
  setError,
  isRedirectingRef,
  setRefreshTokenExpiresAt
) => {
  const { isRefreshingTokenRef, lastRefreshTimeRef, refreshFailureCountRef } =
    refs;

  const now = Date.now();
  if (isRefreshingTokenRef.current || now - lastRefreshTimeRef.current < 5000) {
    return false;
  }

  isRefreshingTokenRef.current = true;
  lastRefreshTimeRef.current = now;

  if (!hasRefreshToken()) {
    return false;
  }

  try {
    const response = await axios.post(
      "/api/auth/refresh",
      {},
      {
        validateStatus: (status) => status === 200 || status === 401,
        _silent: true,
        withCredentials: true,
      }
    );
    isRefreshingTokenRef.current = false;
    if (response.status === 200) {
      refreshFailureCountRef.current = 0;
      if (response.data.refreshTokenExpiresAt && setRefreshTokenExpiresAt) {
        setRefreshTokenExpiresAt(response.data.refreshTokenExpiresAt);
      }
      return true;
    }
    await handleTokenExpiration(setUser, setError, isRedirectingRef);
    return false;
  } catch (error) {
    isRefreshingTokenRef.current = false;
    if (error.response?.status === 429) {
      error._silent = true;
      if (error.config) {
        error.config._silent = true;
      }
      return false;
    }
    if (error.response?.status === 401) {
      await handleTokenExpiration(setUser, setError, isRedirectingRef);
    } else {
      setUser(null);
    }
    return false;
  }
};
