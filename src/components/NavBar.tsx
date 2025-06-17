// src/components/Navbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.ts';
import './Navbar.css'; // Vamos criar este CSS em seguida

export function Navbar() {
    const { currentUser } = useAuth(); // Pega o usuário do nosso contexto de autenticação
    const navigate = useNavigate();

    // Função para deslogar o usuário
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login'); // Redireciona para o login após o logout
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo do site, que também é um link para a Home */}
                <Link to="/" className="navbar-logo">
                    LenGames
                </Link>

                {/* Links de navegação */}
                <div className="navbar-links">
                    <Link to="/" className="nav-item">Home</Link>
                    <Link to="/games" className="nav-item">Games</Link>

                    {/* Lógica condicional: mostra links diferentes se o usuário está logado ou não */}
                    {currentUser ? (
                        <>
                            <Link to="/profile" className="nav-item">Perfil</Link>
                            <button onClick={handleLogout} className="nav-button">Sair</button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-item">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}