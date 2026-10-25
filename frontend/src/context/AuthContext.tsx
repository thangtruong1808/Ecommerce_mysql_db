import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useTokenRefresh } from "../hooks/useTokenRefresh.js";
import {
  initializeSession,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  updateProfile as updateProfileApi,
  type AuthResult,
  type AuthUser,
} from "../utils/authApi";
import { hasRefreshToken } from "../utils/authUtils";
import { setupAuthInterceptors } from "../utils/axiosInterceptors.js";
import { startExpiryCountdown } from "../utils/convertToMelbourneTime.js";
import { setupErrorSuppression } from "../utils/errorSuppression.js";
import { initTokenRefreshRefs } from "../utils/tokenUtils.js";

export type { AuthResult, AuthUser };

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (userData: { name?: string; email?: string; password?: string }) => Promise<AuthResult>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  tokenExpiresAt: number | null;
  setTokenExpiresAt: (value: number | null) => void;
  refreshTokenExpiresAt: number | null;
  setRefreshTokenExpiresAt: (value: number | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);
  const [refreshTokenExpiresAt, setRefreshTokenExpiresAt] = useState<number | null>(null);
  const isRedirectingRef = useRef(false);
  const isRefreshingTokenRef = useRef(false);
  const lastRefreshTimeRef = useRef(0);
  const userFetchedTimeRef = useRef(0);
  const refreshFailureCountRef = useRef(0);
  const userRef = useRef<AuthUser | null>(null);
  const tokenExpiresAtRef = useRef<number | null>(null);
  const refreshTokenExpiresAtRef = useRef<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restoringRef = useRef(false);
  const tokenRefs = useRef({
    isRefreshingTokenRef,
    lastRefreshTimeRef,
    refreshFailureCountRef,
    userFetchedTimeRef,
    userRef,
  });

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    tokenExpiresAtRef.current = tokenExpiresAt;
  }, [tokenExpiresAt]);

  useEffect(() => {
    refreshTokenExpiresAtRef.current = refreshTokenExpiresAt;
  }, [refreshTokenExpiresAt]);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    initTokenRefreshRefs(tokenRefs.current);
  }, []);

  useEffect(() => {
    setupErrorSuppression();
  }, []);

  useEffect(() => {
    const ejectInterceptors = setupAuthInterceptors({
      setUser,
      setError,
      isRedirectingRef,
      getTokenExpiresAt: () => tokenExpiresAtRef.current,
      setTokenExpiresAt,
      setRefreshTokenExpiresAt,
    });
    return () => {
      ejectInterceptors();
    };
  }, []);

  useEffect(() => {
    void initializeSession(setUser, setTokenExpiresAt, setLoading, setRefreshTokenExpiresAt);
  }, []);

  useTokenRefresh(
    user,
    tokenRefs.current,
    setUser,
    setError,
    isRedirectingRef,
    setTokenExpiresAt,
    () => refreshTokenExpiresAtRef.current,
    setRefreshTokenExpiresAt,
  );

  useEffect(() => {
    const onVisible = () => {
      if (
        document.visibilityState !== "visible" ||
        !hasRefreshToken() ||
        userRef.current ||
        restoringRef.current
      ) {
        return;
      }
      restoringRef.current = true;
      void initializeSession(setUser, setTokenExpiresAt, null, setRefreshTokenExpiresAt).finally(() => {
        restoringRef.current = false;
      });
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const login = (email: string, password: string) =>
    loginApi(email, password, setUser, setError, setTokenExpiresAt, setRefreshTokenExpiresAt);

  const register = (name: string, email: string, password: string) =>
    registerApi(name, email, password, setUser, setError, setTokenExpiresAt, setRefreshTokenExpiresAt);

  const logout = () => logoutApi(setUser, setError, setTokenExpiresAt, setRefreshTokenExpiresAt);

  const updateProfile = (userData: { name?: string; email?: string; password?: string }) =>
    updateProfileApi(userData, setUser, setError);

  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  useEffect(() => {
    if (!refreshTokenExpiresAt) {
      return undefined;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    countdownRef.current = startExpiryCountdown(refreshTokenExpiresAt, async () => {
      try {
        await logoutRef.current();
      } catch (err) {
        return err;
      }
    });
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [refreshTokenExpiresAt]);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    tokenExpiresAt,
    setTokenExpiresAt,
    refreshTokenExpiresAt,
    setRefreshTokenExpiresAt,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
