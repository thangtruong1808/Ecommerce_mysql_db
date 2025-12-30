/**
 * Authentication Context - Manages auth state, token refresh, and auto-logout
 * @author Thang Truong
 * @date 2025-12-12
 */

import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useTokenRefresh } from "../hooks/useTokenRefresh.js";
import {
  initializeSession,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  updateProfile as updateProfileApi,
} from "../utils/authApi.js";
import { hasRefreshToken } from "../utils/authUtils.js";
import { setupAuthInterceptors } from "../utils/axiosInterceptors.js";
import { startExpiryCountdown } from "../utils/convertToMelbourneTime.js";
import { setupErrorSuppression } from "../utils/errorSuppression.js";
import { initTokenRefreshRefs } from "../utils/tokenUtils.js";

const AuthContext = createContext();

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Auth Provider Component
 * @param {Object} props - Component props with children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState(null);
  const [refreshTokenExpiresAt, setRefreshTokenExpiresAt] = useState(null);
  const isRedirectingRef = useRef(false);
  const isRefreshingTokenRef = useRef(false);
  const lastRefreshTimeRef = useRef(0);
  const userFetchedTimeRef = useRef(0);
  const refreshFailureCountRef = useRef(0);
  const userRef = useRef(null);
  const tokenExpiresAtRef = useRef(null);
  const refreshTokenExpiresAtRef = useRef(null);
  const countdownRef = useRef(null); // stores interval ID

  // Keep refs in sync with state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    tokenExpiresAtRef.current = tokenExpiresAt;
  }, [tokenExpiresAt]);

  useEffect(() => {
    refreshTokenExpiresAtRef.current = refreshTokenExpiresAt;
  }, [refreshTokenExpiresAt]);

  // Configure axios to send cookies
  axios.defaults.withCredentials = true;

  // Refs object for token refresh
  const refs = {
    isRefreshingTokenRef,
    lastRefreshTimeRef,
    refreshFailureCountRef,
    userFetchedTimeRef,
    userRef,
  };

  // Initialize token refresh refs
  useEffect(() => {
    initTokenRefreshRefs(refs);
  }, [refs]);

  // Suppress console errors for silent 401 errors
  useEffect(() => {
    setupErrorSuppression();
  }, []);

  const setUserRef = useRef(setUser);
  const setErrorRef = useRef(setError);
  const setTokenExpiresAtRef = useRef(setTokenExpiresAt);
  const setRefreshTokenExpiresAtRef = useRef(setRefreshTokenExpiresAt);

  // Keep setter refs in sync
  useEffect(() => {
    setUserRef.current = setUser;
    setErrorRef.current = setError;
    setTokenExpiresAtRef.current = setTokenExpiresAt;
    setRefreshTokenExpiresAtRef.current = setRefreshTokenExpiresAt;
  });

  // Setup the consolidated authentication interceptors (proactive and reactive)
  useEffect(() => {
    const interceptorProps = {
      setUser: (...args) => setUserRef.current(...args),
      setError: (...args) => setErrorRef.current(...args),
      isRedirectingRef,
      getTokenExpiresAt: () => tokenExpiresAtRef.current,
      setTokenExpiresAt: (...args) => setTokenExpiresAtRef.current(...args),
      setRefreshTokenExpiresAt: (...args) =>
        setRefreshTokenExpiresAtRef.current(...args),
    };
    const ejectInterceptors = setupAuthInterceptors(interceptorProps);
    return () => {
      ejectInterceptors();
    };
  }, [
    setUser,
    setError,
    setTokenExpiresAt,
    setRefreshTokenExpiresAt,
    isRedirectingRef,
    tokenExpiresAtRef,
  ]);

  /**
   * Initialize auth state on mount by calling the dedicated session-check endpoint.
   * This is now the single source of truth for session restoration on app load.
   * @author Thang Truong
   * @date 2025-12-28
   */
  useEffect(() => {
    initializeSession(
      setUser,
      setTokenExpiresAt,
      setLoading,
      setRefreshTokenExpiresAt
    );
  }, []);

  // Use token refresh hook for periodic checks (e.g., for other tabs)
  useTokenRefresh(
    user,
    refs,
    setUser,
    setError,
    isRedirectingRef,
    setTokenExpiresAt,
    () => refreshTokenExpiresAtRef.current,
    setRefreshTokenExpiresAt
  );

  /**
   * Restore user state when page becomes visible after inactivity
   * This handles cases where access token expired during inactivity
   * @author Thang Truong
   * @date 2025-01-28
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When page becomes visible, check if user state needs restoration
      if (
        document.visibilityState === "visible" &&
        hasRefreshToken() &&
        !userRef.current &&
        !isFetchingUserRef.current
      ) {
        // Restore user state if refresh token exists but user is null
        fetchUser(
          setUser,
          setError,
          setLoading,
          isFetchingUserRef,
          userFetchedTimeRef,
          hasRefreshToken,
          setTokenExpiresAt,
          isRefreshingTokenRef
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [setUser, setError, setLoading]);

  /**
   * Login user - silently handles 401 errors without console logging
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Result object with success status
   * @author Thang Truong
   * @date 2025-12-12
   */
  const login = async (email, password) => {
    return loginApi(
      email,
      password,
      setUser,
      setError,
      setTokenExpiresAt,
      setRefreshTokenExpiresAt
    );
  };

  /**
   * Register new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Result object with success status
   * @author Thang Truong
   * @date 2025-12-12
   */
  const register = async (name, email, password) => {
    return registerApi(
      name,
      email,
      password,
      setUser,
      setError,
      setRefreshTokenExpiresAt
    );
  };

  /**
   * Logout user
   * @author Thang Truong
   * @date 2025-12-12
   */
  const logout = async () => {
    return logoutApi(
      setUser,
      setError,
      setTokenExpiresAt,
      setRefreshTokenExpiresAt
    );
  };

  /**
   * Update user profile
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Result object with success status
   * @author Thang Truong
   * @date 2025-12-12
   */
  const updateProfile = async (userData) => {
    return updateProfileApi(userData, setUser, setError);
  };

  // Start countdown < 5s from refresh token expiry and auto-logout
  useEffect(() => {
    if (!refreshTokenExpiresAt) return;

    // Clear previous countdown
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    // Start new countdown
    countdownRef.current = startExpiryCountdown(
      refreshTokenExpiresAt,
      async () => {
        try {
          await logout(
            setUser,
            setError,
            setTokenExpiresAt,
            setRefreshTokenExpiresAt
          );
        } catch (err) {
          return err;
          // console.error("Logout failed:", err);
        }
      }
    );

    // Cleanup on unmount
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [refreshTokenExpiresAt]);

  // console.log("AuthContext tokenExpiresAt:", tokenExpiresAt);
  // console.log("AuthContext refreshTokenExpiresAt:", refreshTokenExpiresAt);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    tokenExpiresAt,
    setTokenExpiresAt,
    refreshTokenExpiresAt,
    setRefreshTokenExpiresAt,
  };

  /* Auth context provider */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
