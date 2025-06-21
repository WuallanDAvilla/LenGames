// src/components/GuestRoute.tsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";
import { GlobalLoader } from "./GlobalLoader";

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { currentUser, loading } = useAuth();

  // Se a autenticação ainda estiver carregando, mostra o loader
  if (loading) {
    return <GlobalLoader />;
  }

  // Se o usuário JÁ ESTIVER LOGADO, redireciona para a página inicial
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  // Se não estiver logado, permite que o usuário veja o conteúdo (a página de Login)
  return children;
}
