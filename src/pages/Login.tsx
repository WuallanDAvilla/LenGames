import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "../services/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import toast from "react-hot-toast";
import "../styles/Login.css";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle } = useAuth();

  const from = location.state?.from?.pathname || "/";
  const [isRegistering, setIsRegistering] = useState(
    location.state?.isRegistering || false
  );

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Login com Google realizado com sucesso!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Falha no login com Google. Tente novamente.");
    }
    setIsLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isRegistering) {
      if (!name || !username) {
        toast.error("Por favor, preencha todos os campos.");
        setIsLoading(false);
        return;
      }
      if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        toast.error(
          "Nome de usuário inválido (use apenas letras, números e _)."
        );
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error("A senha precisa ter no mínimo 6 caracteres.");
        setIsLoading(false);
        return;
      }

      const usernameDocRef = doc(db, "usernames", username.toLowerCase());
      const usernameDocSnap = await getDoc(usernameDocRef);

      if (usernameDocSnap.exists()) {
        toast.error("Este nome de usuário já está em uso. Tente outro.");
        setIsLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const avatarUrl = `https://api.dicebear.com/8.x/bottts/svg?seed=${user.uid}`;

        await updateProfile(user, { displayName: name, photoURL: avatarUrl });

        const batch = writeBatch(db);
        const userDocRef = doc(db, "users", user.uid);
        batch.set(userDocRef, {
          username: username.toLowerCase(),
          displayName: name,
          email: user.email,
          photoURL: avatarUrl,
          createdAt: new Date(),
          highScores: {},
        });
        batch.set(usernameDocRef, { uid: user.uid });
        await batch.commit();

        toast.success("Conta criada com sucesso!");
        navigate(from, { replace: true });
      } catch (err) {
        console.error(err);
        toast.error("Erro ao criar a conta. Verifique o e-mail.");
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login realizado com sucesso!");
        navigate(from, { replace: true });
      } catch (err) {
        console.error(err);
        toast.error("E-mail ou senha incorretos.");
      }
    }
    setIsLoading(false);
  };

  return (
    <main className="login-page-container">
      <div className="login-wrapper">
        <Link to="/" className="login-logo">
          PixelRush
        </Link>

        <form onSubmit={handleAuth} className="login-form">
          <h1 className="form-title">
            {isRegistering ? "Criar Conta" : "Conecte-se"}
          </h1>

          {isRegistering && (
            <>
              <div className="input-group">
                <label htmlFor="name">Nome de Exibição</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Como devemos te chamar?"
                />
              </div>
              <div className="input-group">
                <label htmlFor="username">Nome de Usuário</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Apenas letras, números e _"
                />
              </div>
            </>
          )}

          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu-email@exemplo.com"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo de 6 caracteres"
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading
              ? "Processando..."
              : isRegistering
              ? "Cadastrar"
              : "Entrar"}
          </button>
        </form>

        <div className="separator">
          <span>OU</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="google-auth-button"
          disabled={isLoading}
        >
          Entrar com Google
        </button>

        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="toggle-auth-button"
          disabled={isLoading}
        >
          {isRegistering
            ? "Já tem uma conta? Faça Login"
            : "Não tem uma conta? Cadastre-se"}
        </button>
      </div>
    </main>
  );
}
