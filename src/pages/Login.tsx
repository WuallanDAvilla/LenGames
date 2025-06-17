// src/pages/Login.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.ts';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile // <-- Importe a função updateProfile
} from 'firebase/auth';
import toast from 'react-hot-toast'; // Usaremos toast para os alertas
import '../styles/Login.css';

export function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState(''); // <-- Estado para o nome
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    if (isRegistering) {
      // --- LÓGICA DE CADASTRO ---
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Gera uma URL de avatar aleatória do DiceBear
        const avatarUrl = `https://api.dicebear.com/8.x/bottts/svg?seed=${user.uid}`;

        // Atualiza o perfil do usuário recém-criado com nome e avatar
        await updateProfile(user, {
          displayName: name,
          photoURL: avatarUrl
        });

        toast.success('Conta criada com sucesso!');
        navigate('/');
      } catch (err) {
        console.error(err);
        toast.error('Erro ao criar a conta. Verifique se o e-mail já existe.');
      }
    } else {
      // --- LÓGICA DE LOGIN ---
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login realizado com sucesso!');
        navigate('/');
      } catch (err) {
        console.error(err);
        toast.error('E-mail ou senha incorretos.');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleAuth} className="login-form">
        <h2>{isRegistering ? 'Criar Conta' : 'Conecte-se'}</h2>

        {/* Campo de nome, que só aparece no modo de cadastro */}
        {isRegistering && (
          <div className="input-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Como devemos te chamar?"
            />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu-email@exemplo.com" />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mínimo de 6 caracteres" />
        </div>

        <button type="submit" className="login-button">
          {isRegistering ? 'Cadastrar' : 'Entrar'}
        </button>

        <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="toggle-button">
          {isRegistering ? 'Já tem uma conta? Faça Login' : 'Não tem uma conta? Cadastre-se'}
        </button>
      </form>
    </div>
  );
}