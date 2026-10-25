import type { SqlBoolean, UserRole } from "./common";

/** User row returned by session and profile routes. Password is not included. */
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

/** Login success uses `_id` rather than `id`. */
export interface LoginSuccess {
  _id: number;
  name: string;
  email: string;
  role: UserRole;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt?: number;
}

export interface LoginFailure {
  message: string;
}

export type LoginResponse = LoginSuccess | LoginFailure;

export interface RegisterSuccess {
  _id: number;
  name: string;
  email: string;
  role: UserRole;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt?: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshResponse {
  message: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

export interface SessionCheckResponse {
  user: User | null;
  accessTokenExpiresAt?: number;
  refreshTokenExpiresAt?: number;
}

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
}

export interface UserAddress {
  id: number;
  user_id: number;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  is_default: SqlBoolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserAddressInput {
  address: string;
  city: string;
  postal_code: string;
  country: string;
  is_default?: SqlBoolean;
}
