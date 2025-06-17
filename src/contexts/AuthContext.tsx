// src/contexts/AuthContext.tsx

// O código corrigido
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'; // Adicionamos 'type' antes de ReactNode
import { onAuthStateChanged, type User } from 'firebase/auth'; // Adicionamos 'type' antes de User
import { auth } from '../firebase.ts';

// 1. Define o tipo de dados que nosso contexto vai fornecer
interface AuthContextType {
    currentUser: User | null; // O usuário pode ser um objeto 'User' do Firebase ou 'null'
    loading: boolean;         // Um booleano para sabermos se a verificação inicial já terminou
}

// 2. Cria o Contexto com um valor padrão
const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

// 3. Cria um "hook" customizado para facilitar o uso do nosso contexto em outras páginas
export function useAuth() {
    return useContext(AuthContext);
}

// 4. Cria o componente "Provedor" que vai "abraçar" toda a nossa aplicação
interface AuthProviderProps {
    children: ReactNode; // A propriedade 'children' representa os componentes filhos
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 5. useEffect vai rodar assim que o componente for montado
    useEffect(() => {
        // onAuthStateChanged é um "ouvinte" do Firebase. Ele é acionado
        // sempre que um usuário faz login ou logout. É mágico!
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user); // Define o usuário atual (ou null se deslogado)
            setLoading(false);    // Avisa que o carregamento inicial terminou
        });

        // Função de limpeza: quando o componente for "desmontado", removemos o "ouvinte"
        return unsubscribe;
    }, []); // O array vazio [] garante que isso rode apenas uma vez.

    // 6. Prepara o valor que será compartilhado com toda a aplicação
    const value = {
        currentUser,
        loading,
    };

    // 7. Retorna o Provedor com o valor, envolvendo os componentes filhos.
    // Só renderiza a aplicação quando a verificação do Firebase terminar.
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}