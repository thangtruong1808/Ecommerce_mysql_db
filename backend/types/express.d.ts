export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface SessionData {
  user: AuthUser | null;
  accessTokenExpiresAt: number | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      token?: string;
      guestSessionId?: string;
      guestCartId?: number | null;
      sessionData?: SessionData;
    }
  }
}
