// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.ts'; // Verifique se o caminho está correto!
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';

// Importando nosso CSS. Verifique se o caminho está correto para sua estrutura!
import '../styles/Login.css';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Conta criada com sucesso! Você será redirecionado.');
        navigate('/');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login realizado com sucesso!');
        navigate('/');
      }
    } catch (err) {
      console.error("Erro de autenticação:", err);
      let friendlyMessage = "Ocorreu um erro. Tente novamente.";
      if (err instanceof Error && 'code' in err) {
        const errorCode = (err as { code: string }).code;
        switch (errorCode) {
          case 'auth/email-already-in-use':
            friendlyMessage = "Este e-mail já está cadastrado. Tente fazer login.";
            break;
          case 'auth/invalid-email':
            friendlyMessage = "O formato do e-mail é inválido.";
            break;
          case 'auth/invalid-credential':
            friendlyMessage = "E-mail ou senha incorretos.";
            break;
          case 'auth/weak-password':
            friendlyMessage = "A senha é muito fraca. Use pelo menos 6 caracteres.";
            break;
          default:
            friendlyMessage = "Erro ao tentar realizar a operação. Verifique os dados.";
        }
      }
      setError(friendlyMessage);
    }
  };

  // ***** ATENÇÃO AQUI: ESTA É A ESTRUTURA CORRETA *****
  return (
    // 1. Este DIV é o container de tela cheia que centraliza tudo.
    <div className="login-container"> 
      
      {/* 2. Este FORM é a caixa azul escura com o conteúdo. */}
      <form onSubmit={handleAuth} className="login-form">
        <h2>{isRegistering ? 'Criar Conta' : 'Conecte-se'}</h2>
        
        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu-email@exemplo.com"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mínimo de 6 caracteres"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button">
          {isRegistering ? 'Cadastrar' : 'Entrar'}
        </button>

        <button 
          type="button" 
          onClick={() => setIsRegistering(!isRegistering)} 
          className="toggle-button"
        >
          {isRegistering ? 'Já tem uma conta? Faça Login' : 'Não tem uma conta? Cadastre-se'}
        </button>
      </form>
    </div>
  );
}