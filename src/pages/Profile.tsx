// src/pages/Profile.tsx

import { useAuth } from '../contexts/AuthContext.tsx';
import { auth } from '../firebase.ts';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  // Pegamos o usuário e a função de logout do nosso contexto
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Você foi desconectado com sucesso.");
      navigate('/login'); // Manda o usuário para a página de login
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Não foi possível sair. Tente novamente.");
    }
  };

  // Estilos básicos para a página não ficar "pelada"
  const pageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    color: 'white',
    fontFamily: 'Segoe UI, sans-serif'
  };

  const cardStyle: React.CSSProperties = {
    background: '#0f3460',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'left',
    width: '100%',
    maxWidth: '500px'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#e94560',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '30px'
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ textAlign: 'center', marginTop: 0 }}>Perfil do Usuário</h1>
        {/* Usamos a sintaxe "currentUser && (...)" para garantir que o código só
            tente acessar os dados do usuário se ele não for nulo. */}
        {currentUser && (
          <div>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>ID de Usuário (UID):</strong> {currentUser.uid}</p>
            <p><strong>Conta criada em:</strong> {new Date(currentUser.metadata.creationTime!).toLocaleDateString()}</p>

            <button onClick={handleLogout} style={buttonStyle}>
              Sair (Logout)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}