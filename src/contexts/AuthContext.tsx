// src/contexts/AuthContext.tsx

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase.ts';
import { GlobalLoader } from '../components/GlobalLoader.tsx'; // <-- MUDANÇA 1: Importe o nosso novo loader

// ... (interface AuthContextType e const AuthContext continuam iguais)
interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
}
const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}

// ... (interface AuthProviderProps continua igual)
interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
    };

    // --- MUDANÇA 2: Lógica de renderização ---
    // Agora, em vez de não renderizar nada enquanto carrega,
    // vamos mostrar o GlobalLoader.
    return (
        <AuthContext.Provider value={value}>
            {loading ? <GlobalLoader /> : children}
        </AuthContext.Provider>
    );
}