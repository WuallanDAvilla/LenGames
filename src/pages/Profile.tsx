import { useAuth } from "../contexts/AuthContext.tsx";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.ts";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Profile.css";

export function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="container profile-page-container">
        <p>Carregando informações do usuário...</p>
      </div>
    );
  }

  return (
    <div className="container profile-page-container">
      <div className="profile-card">
        <header className="profile-header">
          <img
            src={currentUser.photoURL!}
            alt="Avatar do usuário"
            className="profile-avatar"
          />
          <h1 className="profile-name">{currentUser.displayName}</h1>
          <p className="profile-email">{currentUser.email}</p>
        </header>

        <section className="profile-details">
          <div className="detail-item">
            <span className="detail-label">ID de Usuário</span>
            <span className="detail-value">{currentUser.uid}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Membro desde</span>
            <span className="detail-value">
              {new Date(currentUser.metadata.creationTime!).toLocaleDateString(
                "pt-BR"
              )}
            </span>
          </div>
        </section>

        <footer className="profile-actions">
          <Link to="/settings" className="profile-button primary">
            Ir para Configurações
          </Link>
          <button onClick={handleLogout} className="profile-button danger">
            Sair
          </button>
        </footer>
      </div>
    </div>
  );
}
