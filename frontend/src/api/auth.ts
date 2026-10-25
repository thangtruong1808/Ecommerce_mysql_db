import type {
  LoginRequest,
  LoginResponse,
  ProfileUpdateRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterSuccess,
  SessionCheckResponse,
  User,
} from "@shared/auth";
import { apiGet, apiPost, apiPut } from "./client";

export const sessionCheck = () => apiGet<SessionCheckResponse>("/api/auth/session-check");

export const login = (body: LoginRequest) =>
  apiPost<LoginResponse, LoginRequest>("/api/auth/login", body);

export const register = (body: RegisterRequest) =>
  apiPost<RegisterSuccess, RegisterRequest>("/api/auth/register", body);

export const refreshSession = () =>
  apiPost<RefreshResponse>("/api/auth/refresh", {}, { withCredentials: true });

export const logout = () => apiPost<unknown>("/api/auth/logout");

export const updateProfile = (body: ProfileUpdateRequest) =>
  apiPut<User, ProfileUpdateRequest>("/api/auth/profile", body);
