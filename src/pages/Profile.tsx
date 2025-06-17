// src/pages/Profile.tsx

import { useAuth } from '../contexts/AuthContext.tsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.ts';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Profile.css'; // Usaremos um arquivo CSS dedicado

export function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        {currentUser && (
          <>
            <div className="profile-header">
              <img
                src={currentUser.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${currentUser.uid}`}
                alt="Avatar do usuário"
                className="profile-avatar"
              />
              <h1 className="profile-name">{currentUser.displayName || "Usuário Anônimo"}</h1>
              <p className="profile-email">{currentUser.email}</p>
            </div>

            <div className="profile-details">
              <p><strong>ID de Usuário:</strong> {currentUser.uid}</p>
              <p><strong>Conta criada em:</strong> {new Date(currentUser.metadata.creationTime!).toLocaleDateString()}</p>
            </div>

            <div className="profile-actions">
              <Link to="/settings" className="profile-button">Ir para Configurações</Link>
              <button onClick={handleLogout} className="profile-button-logout">
                Sair (Logout)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}