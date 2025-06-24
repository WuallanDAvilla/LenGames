// ARQUIVO CORRIGIDO: src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
// AQUI ESTÁ A CORREÇÃO: `setDoc` foi removido pois não era utilizado.
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { auth, db, googleProvider } from "../services/firebase";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef); // `getDoc` é usado aqui

      if (!userDocSnap.exists()) {
        const batch = writeBatch(db);
        const username =
          user.email?.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "") || user.uid;

        const usernameDocRef = doc(db, "usernames", username);

        batch.set(userDocRef, {
          username: username,
          displayName: user.displayName || "Novo Usuário",
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          highScores: {},
        });
        batch.set(usernameDocRef, { uid: user.uid });
        await batch.commit();
        console.log("Novo usuário do Google salvo no Firestore.");
      }
    } catch (error) {
      console.error("Erro durante o login com Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

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
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
