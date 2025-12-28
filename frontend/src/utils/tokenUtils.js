/**
 * Token Utilities
 * Helper functions for token management
 * @author Thang Truong
 * @date 2025-12-23
 */

import axios from "axios";
import { hasRefreshToken } from "./authUtils.js";
import { isProtectedRoute } from "./errorSuppression.js";

// Store refs for token refresh state
let tokenRefreshRefs = null;

// Request queue for queuing requests during token refresh
let refreshPromise = null;

/**
 * Initialize token refresh refs
 * @param {Object} refs - Refs object from AuthContext
 * @author Thang Truong
 * @date 2025-12-23
 */
export const initTokenRefreshRefs = (refs) => {
  tokenRefreshRefs = refs;
};

/**
 * Ensure fresh access token before making API requests
 * Queues requests during refresh to prevent 401 errors
 * @returns {Promise<boolean>} True if token refresh succeeded or not needed
 * @author Thang Truong
 * @date 2025-12-23
 */
export const ensureValidAccessToken = async () => {
  // Only refresh on protected routes
  if (!isProtectedRoute()) {
    return true;
  }

  // If no refresh token, can't refresh
  if (!hasRefreshToken()) {
    return false;
  }

  // If refs not initialized, skip (fallback to interceptor)
  if (!tokenRefreshRefs) {
    return true;
  }

  // If refresh is already in progress, wait for it
  if (refreshPromise) {
    try {
      await refreshPromise;
      return true;
    } catch {
      return false;
    }
  }

  const { isRefreshingTokenRef, lastRefreshTimeRef } = tokenRefreshRefs;

  // If refresh was recent (within 5 seconds), skip to avoid rate limiting
  const now = Date.now();
  if (now - lastRefreshTimeRef.current < 5000) {
    return true;
  }

  // Start refresh and queue all requests until it completes
  refreshPromise = (async () => {
    try {
      isRefreshingTokenRef.current = true;
      lastRefreshTimeRef.current = now;

      const refreshResponse = await axios.post(
        "/api/auth/refresh",
        {},
        {
          validateStatus: (status) => status === 200 || status === 401,
          _silent: true,
          withCredentials: true,
        }
      );

      isRefreshingTokenRef.current = false;

      if (refreshResponse.status === 200) {
        return true;
      }

      // Refresh failed - token expired
      throw new Error("Token refresh failed");
    } catch (error) {
      isRefreshingTokenRef.current = false;
      throw error;
    } finally {
      // Clear the promise so new requests can start a new refresh if needed
      refreshPromise = null;
    }
  })();

  try {
    await refreshPromise;
    return true;
  } catch {
    return false;
  }
};
