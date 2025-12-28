/**
 * Authentication Context - Manages auth state, token refresh, and auto-logout
 * @author Thang Truong
 * @date 2025-12-12
 */

import { createContext, useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { setupErrorSuppression } from "../utils/errorSuppression.js";
import { setupAuthInterceptors } from "../utils/axiosInterceptors.js";
import { useTokenRefresh } from "../hooks/useTokenRefresh.js";
import {
  initializeSession,
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  updateProfile as updateProfileApi,
} from "../utils/authApi.js";
import { hasRefreshToken } from "../utils/authUtils.js";
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
  const isRedirectingRef = useRef(false);
  const isRefreshingTokenRef = useRef(false);
  const lastRefreshTimeRef = useRef(0);
  const userFetchedTimeRef = useRef(0);
  const refreshFailureCountRef = useRef(0);
  const userRef = useRef(null);
  const tokenExpiresAtRef = useRef(null);

  // Keep refs in sync with state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    tokenExpiresAtRef.current = tokenExpiresAt;
  }, [tokenExpiresAt]);

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

  // Setup the consolidated authentication interceptors (proactive and reactive)
  useEffect(() => {
    return setupAuthInterceptors(
      setUser,
      setError,
      isRedirectingRef,
      () => tokenExpiresAtRef.current, // Getter function for expiration time
      setTokenExpiresAt
    );
  }, []); // Removed setTokenExpiresAt from deps to ensure it only runs once

  /**
   * Initialize auth state on mount by calling the dedicated session-check endpoint.
   * This is now the single source of truth for session restoration on app load.
   * @author Thang Truong
   * @date 2025-12-28
   */
  useEffect(() => {
    initializeSession(setUser, setTokenExpiresAt, setLoading);
  }, []);

  // Use token refresh hook for periodic checks (e.g., for other tabs)
  useTokenRefresh(
    user,
    refs,
    setUser,
    setError,
    isRedirectingRef,
    setTokenExpiresAt
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
    return loginApi(email, password, setUser, setError, setTokenExpiresAt);
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
    return registerApi(name, email, password, setUser, setError);
  };

  /**
   * Logout user
   * @author Thang Truong
   * @date 2025-12-12
   */
  const logout = async () => {
    return logoutApi(setUser, setError, setTokenExpiresAt);
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

  console.log("AuthContext user:", user);
  console.log("AuthContext loading:", loading);
  console.log("AuthContext error:", error);
  console.log("AuthContext isAuthenticated:", !!user);
  console.log("AuthContext isAdmin:", user?.role === "admin");
  console.log("AuthContext tokenExpiresAt:", tokenExpiresAt);

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
  };

  /* Auth context provider */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
