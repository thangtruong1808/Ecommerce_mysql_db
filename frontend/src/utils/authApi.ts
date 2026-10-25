import axios from "axios";
import type { LoginResponse, LoginSuccess, RegisterSuccess, User } from "@shared/auth";
import {
  login as requestLogin,
  logout as requestLogout,
  register as requestRegister,
  sessionCheck,
  updateProfile as requestProfileUpdate,
} from "../api/auth";

export interface AuthUser {
  id?: number;
  _id?: number;
  name?: string;
  email?: string;
  role?: string;
}

type SetUser = (user: AuthUser | null) => void;
type SetError = (error: string | null) => void;
type SetExpiry = (value: number | null) => void;
type SetLoading = (value: boolean) => void;

export interface AuthResult {
  success: boolean;
  error?: string;
}

function isLoginSuccess(data: LoginResponse): data is LoginSuccess {
  return typeof (data as LoginSuccess)._id === "number" && typeof (data as LoginSuccess).accessTokenExpiresAt === "number";
}

function messageFrom(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: { msg?: string }[] } | undefined;
    return data?.message || data?.errors?.[0]?.msg || fallback;
  }
  return fallback;
}

export async function initializeSession(
  setUser: SetUser,
  setTokenExpiresAt: SetExpiry,
  setLoading: SetLoading | null,
  setRefreshTokenExpiresAt: SetExpiry,
): Promise<void> {
  try {
    const data = await sessionCheck();
    if (data.user && data.accessTokenExpiresAt) {
      setUser(data.user);
      setTokenExpiresAt(data.accessTokenExpiresAt);
      setRefreshTokenExpiresAt(data.refreshTokenExpiresAt ?? null);
    } else {
      setUser(null);
      setTokenExpiresAt(null);
      setRefreshTokenExpiresAt(null);
    }
  } catch {
    setUser(null);
    setTokenExpiresAt(null);
    setRefreshTokenExpiresAt(null);
  } finally {
    setLoading?.(false);
  }
}

export async function login(
  email: string,
  password: string,
  setUser: SetUser,
  setError: SetError,
  setTokenExpiresAt: SetExpiry,
  setRefreshTokenExpiresAt: SetExpiry,
): Promise<AuthResult> {
  try {
    const data = await requestLogin({ email, password });
    if (!isLoginSuccess(data)) {
      const message = ("message" in data && data.message) || "Invalid email or password";
      setError(message);
      return { success: false, error: message };
    }
    const { accessTokenExpiresAt, refreshTokenExpiresAt, ...userData } = data;
    setUser(userData);
    setTokenExpiresAt(accessTokenExpiresAt);
    setRefreshTokenExpiresAt(refreshTokenExpiresAt ?? null);
    setError(null);
    return { success: true };
  } catch (error) {
    const message = messageFrom(error, "Login failed. Please try again.");
    setError(message);
    return { success: false, error: message };
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
  setUser: SetUser,
  setError: SetError,
  setTokenExpiresAt: SetExpiry,
  setRefreshTokenExpiresAt: SetExpiry,
): Promise<AuthResult> {
  try {
    const data: RegisterSuccess = await requestRegister({ name, email, password });
    const { accessTokenExpiresAt, refreshTokenExpiresAt, ...userData } = data;
    setUser(userData);
    setTokenExpiresAt(accessTokenExpiresAt);
    setRefreshTokenExpiresAt(refreshTokenExpiresAt ?? null);
    setError(null);
    return { success: true };
  } catch (error) {
    const message = messageFrom(error, "Registration failed");
    setError(message);
    return { success: false, error: message };
  }
}

export async function logout(
  setUser: SetUser,
  setError: SetError,
  setTokenExpiresAt?: SetExpiry,
  setRefreshTokenExpiresAt?: SetExpiry,
): Promise<void> {
  try {
    await requestLogout();
  } catch {
    // The local session is cleared even when the server call fails.
  } finally {
    setUser(null);
    setError(null);
    setTokenExpiresAt?.(null);
    setRefreshTokenExpiresAt?.(null);
  }
}

export async function updateProfile(
  userData: { name?: string; email?: string; password?: string },
  setUser: SetUser,
  setError: SetError,
): Promise<AuthResult> {
  try {
    const user: User = await requestProfileUpdate(userData);
    setUser(user);
    setError(null);
    return { success: true };
  } catch (error) {
    const message = messageFrom(error, "Update failed");
    setError(message);
    return { success: false, error: message };
  }
}
