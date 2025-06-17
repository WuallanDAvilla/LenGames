// src/components/ProtectedRoute.tsx

// O código corrigido
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import type { ReactNode } from 'react'; // Adicionamos a palavra 'type'

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    // Usamos nosso hook para pegar o usuário atual
    const { currentUser } = useAuth();

    if (!currentUser) {
        // Se NÃO há usuário logado, usamos o componente Navigate do react-router-dom
        // para redirecionar o usuário para a página de login.
        return <Navigate to="/login" />;
    }

    // Se há um usuário logado, simplesmente renderizamos o componente
    // filho que foi passado para ele (a página que queremos proteger).
    return children;
}