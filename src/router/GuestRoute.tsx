import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";
import { GlobalLoader } from "../components/GlobalLoader/GlobalLoader";

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <GlobalLoader />;
  }
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
}
