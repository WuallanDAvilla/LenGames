// src/pages/Settings.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { updatePassword, deleteUser, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/Settings.css';

export function Settings() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Estados para a edição do perfil
  const [displayName, setDisplayName] = useState('');

  // Estados para a mudança de senha
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Carrega o nome do usuário atual quando o componente monta
  useEffect(() => {
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const promise = updateProfile(currentUser, { displayName });
    toast.promise(promise, {
      loading: 'Salvando perfil...',
      success: 'Perfil salvo com sucesso!',
      error: 'Erro ao salvar o perfil.',
    });
  };

  const handleUpdateAvatar = async () => {
    if (!currentUser) return;

    // Gera uma nova URL de avatar aleatória
    const newAvatarUrl = `https://api.dicebear.com/8.x/bottts/svg?seed=${Date.now()}`;
    const promise = updateProfile(currentUser, { photoURL: newAvatarUrl });

    toast.promise(promise, {
      loading: 'Gerando novo avatar...',
      success: 'Avatar atualizado com sucesso!',
      error: 'Erro ao atualizar o avatar.',
    });
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem."); return;
    }
    if (newPassword.length < 6) {
      toast.error("A nova senha precisa ter no mínimo 6 caracteres."); return;
    }

    const promise = updatePassword(currentUser, newPassword);
    toast.promise(promise, {
      loading: 'Atualizando senha...',
      success: 'Senha atualizada!',
      error: 'Erro ao atualizar. Tente fazer login novamente.',
    });
    promise.then(() => {
      setNewPassword(''); setConfirmPassword('');
    }).catch(err => console.error(err));
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    const isConfirmed = window.confirm(
      "Você tem CERTEZA que quer excluir sua conta? Esta ação não pode ser desfeita!"
    );

    if (isConfirmed) {
      try {
        await deleteUser(currentUser);
        toast.success("Sua conta foi excluída com sucesso.");
        navigate('/login');
      } catch (err) {
        console.error(err);
        toast.error("Erro ao excluir. Tente fazer login novamente.");
      }
    }
  };

  return (
    <div className="settings-page-container">
      <div className="settings-card">
        <h1>Configurações da Conta</h1>

        {/* --- NOVA SEÇÃO DE EDITAR PERFIL --- */}
        <div className="settings-section">
          <h2>Editar Perfil</h2>
          <form onSubmit={handleUpdateProfile} className="profile-edit-form">
            <div className="input-group">
              <label htmlFor="displayName">Nome de Exibição</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="settings-button">Salvar Nome</button>
          </form>
          <div className="avatar-section">
            <p>Avatar atual:</p>
            <img
              src={currentUser?.photoURL || ''}
              alt="Avatar"
              className="settings-avatar"
            />
            <button onClick={handleUpdateAvatar} className="settings-button secondary">Gerar Novo Avatar</button>
          </div>
        </div>

        {/* Seção de Alterar Senha (código inalterado) */}
        <div className="settings-section">
          <h2>Alterar Senha</h2>
          <form onSubmit={handleUpdatePassword}>
            <div className="input-group"><label htmlFor="new-password">Nova Senha</label><input type="password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo de 6 caracteres" required /></div>
            <div className="input-group"><label htmlFor="confirm-password">Confirmar Nova Senha</label><input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" required /></div>
            <button type="submit" className="settings-button">Atualizar Senha</button>
          </form>
        </div>

        {/* Zona de Perigo (código inalterado) */}
        <div className="settings-section danger-zone">
          <h2>Zona de Perigo</h2>
          <p>Esta ação é permanente e não pode ser desfeita.</p>
          <button onClick={handleDeleteAccount} className="danger-button">Excluir Minha Conta</button>
        </div>
      </div>
    </div>
  );
}