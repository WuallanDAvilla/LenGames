// src/components/ProtectedRoute.tsx

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import type { ReactNode } from "react";
import { GlobalLoader } from "./GlobalLoader.tsx";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // 1. Enquanto o estado de autenticação está sendo verificado, mostramos um loader.
  //    Isso evita um "flash" da página de login antes de redirecionar.
  if (loading) {
    return <GlobalLoader />;
  }

  // 2. Se não houver usuário logado...
  if (!currentUser) {
    // ...redireciona para o login.
    // Passamos a localização atual para que, após o login, o usuário
    // possa ser redirecionado de volta para a página que tentou acessar.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Se o usuário estiver logado e tentar acessar a página de login...
  if (currentUser && location.pathname === "/login") {
    // ...redireciona para a página inicial.
    return <Navigate to="/" replace />;
  }

  // 4. Se o usuário estiver logado e tentando acessar uma página protegida,
  //    renderiza o conteúdo da página.
  return children;
}
