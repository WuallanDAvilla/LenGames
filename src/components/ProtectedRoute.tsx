import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import type { ReactNode } from 'react'; 

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return children;
}