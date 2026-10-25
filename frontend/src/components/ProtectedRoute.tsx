import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

function SessionStatus({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4" role="status">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 rounded-full border-2 border-line border-b-primary motion-safe:animate-spin" />
        <p className="mt-4 text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const auth = useAuth() as {
    isAuthenticated?: boolean;
    isAdmin?: boolean;
    loading?: boolean;
  };
  const loading = Boolean(auth.loading);
  const isAuthenticated = Boolean(auth.isAuthenticated);
  const isAdmin = Boolean(auth.isAdmin);

  if (loading) {
    return <SessionStatus label="Checking your session" />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;
