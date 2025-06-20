import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
import { updatePassword, deleteUser, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/Settings.css";

export function Settings() {
  const { currentUser, setCurrentUser } = useAuth(); // Precisamos do setCurrentUser
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      loading: "Salvando nome...",
      success: "Nome salvo com sucesso!",
      error: "Erro ao salvar o nome.",
    });
  };

  const handleUpdateAvatar = async () => {
    if (!currentUser) return;

    const newAvatarUrl = `https://api.dicebear.com/8.x/bottts/svg?seed=${Date.now()}`;
    const promise = updateProfile(currentUser, { photoURL: newAvatarUrl }).then(
      () => {
        // Atualiza o contexto para refletir o novo avatar imediatamente
        setCurrentUser({ ...currentUser, photoURL: newAvatarUrl });
      }
    );

    toast.promise(promise, {
      loading: "Gerando novo avatar...",
      success: "Avatar atualizado!",
      error: "Erro ao atualizar o avatar.",
    });
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A nova senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    const promise = updatePassword(currentUser, newPassword);
    toast.promise(promise, {
      loading: "Atualizando senha...",
      success: "Senha atualizada!",
      error: (err) =>
        err.code === "auth/requires-recent-login"
          ? "Esta operação é sensível. Faça login novamente para continuar."
          : "Erro ao atualizar a senha.",
    });
    promise
      .then(() => {
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    const confirmationText = "EXCLUIR";
    const userInput = window.prompt(
      `Esta ação é PERMANENTE. Para confirmar, digite "${confirmationText}" na caixa abaixo.`
    );

    if (userInput === confirmationText) {
      try {
        await deleteUser(currentUser);
        toast.success("Sua conta foi excluída com sucesso.");
        navigate("/login");
      } catch (err) {
        toast.error("Erro ao excluir. Faça login novamente e tente de novo.");
      }
    } else if (userInput !== null) {
      toast.error("A confirmação não corresponde. Ação cancelada.");
    }
  };

  return (
    <div className="container settings-page-container">
      <div className="settings-content-wrapper">
        <header className="settings-header">
          <h1>Configurações da Conta</h1>
        </header>

        <section className="settings-section">
          <h2>Editar Perfil</h2>
          <form onSubmit={handleUpdateProfile} className="settings-form">
            <div className="input-group">
              <label htmlFor="displayName">Nome de Exibição</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="settings-button">
              Salvar Nome
            </button>
          </form>
          <div className="avatar-section">
            <label>Avatar Atual</label>
            <img
              src={currentUser?.photoURL || ""}
              alt="Avatar atual"
              className="settings-avatar"
            />
            <button
              onClick={handleUpdateAvatar}
              className="settings-button secondary"
            >
              Gerar Novo Avatar
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h2>Alterar Senha</h2>
          <form onSubmit={handleUpdatePassword} className="settings-form">
            <div className="input-group">
              <label htmlFor="new-password">Nova Senha</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirm-password">Confirmar Nova Senha</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                required
              />
            </div>
            <button type="submit" className="settings-button">
              Atualizar Senha
            </button>
          </form>
        </section>

        <section className="settings-section danger-zone">
          <header className="danger-zone-header">
            <h2>Zona de Perigo</h2>
          </header>
          <p>
            Esta ação é permanente e resultará na exclusão completa de todos os
            seus dados.
          </p>
          <button onClick={handleDeleteAccount} className="danger-button">
            Excluir minha conta
          </button>
        </section>
      </div>
    </div>
  );
}
