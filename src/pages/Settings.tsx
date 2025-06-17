// src/pages/Settings.tsx

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { updatePassword, deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // <-- MUDANÇA 1: Importe o 'toast'
import '../styles/Settings.css';

export function Settings() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // --- MUDANÇA 2: Não precisamos mais dos estados de 'message' e 'error' ---
  // const [message, setMessage] = useState('');
  // const [error, setError] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Você precisa estar logado para mudar a senha.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A nova senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    // Usando o toast.promise para feedback automático de carregando, sucesso e erro
    const promise = updatePassword(currentUser, newPassword);

    toast.promise(promise, {
      loading: 'Atualizando senha...',
      success: 'Senha atualizada com sucesso!',
      error: 'Erro ao atualizar. Tente fazer login novamente.',
    });

    promise.then(() => {
        setNewPassword('');
        setConfirmPassword('');
    }).catch(err => {
        console.error("Erro ao atualizar a senha:", err);
    });
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) {
      toast.error("Nenhum usuário logado para excluir.");
      return;
    }
    
    // O window.confirm ainda é bom para ações destrutivas
    const isConfirmed = window.confirm(
      "Você tem CERTEZA que quer excluir sua conta? Esta ação não pode ser desfeita!"
    );

    if (isConfirmed) {
      try {
        await deleteUser(currentUser);
        toast.success("Sua conta foi excluída com sucesso.");
        navigate('/login');
      } catch (err) {
        console.error("Erro ao excluir conta:", err);
        toast.error("Erro ao excluir. Tente fazer login novamente.");
      }
    }
  };

  return (
    <div className="settings-page-container">
      <div className="settings-card">
        <h1>Configurações da Conta</h1>

        <div className="settings-section">
          <h2>Alterar Senha</h2>
          <form onSubmit={handleUpdatePassword}>
            {/* O formulário continua o mesmo */}
            <div className="input-group">
              <label htmlFor="new-password">Nova Senha</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirm-password">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                required
              />
            </div>
            <button type="submit" className="settings-button">Atualizar Senha</button>
          </form>
        </div>

        {/* --- MUDANÇA 3: Removemos as mensagens de feedback estáticas daqui --- */}

        <div className="settings-section danger-zone">
          <h2>Zona de Perigo</h2>
          <p>Esta ação é permanente e não pode ser desfeita.</p>
          <button onClick={handleDeleteAccount} className="danger-button">
            Excluir Minha Conta
          </button>
        </div>
      </div>
    </div>
  );
}