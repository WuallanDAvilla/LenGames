// src/components/NavBar.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.ts';
import './NavBar.css';

export function NavBar() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        setDropdownOpen(false);
        await signOut(auth);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={() => setDropdownOpen(false)}>LenGames</Link>
                <div className="navbar-links">
                    <Link to="/" className="nav-item" onClick={() => setDropdownOpen(false)}>Home</Link>
                    <Link to="/games" className="nav-item" onClick={() => setDropdownOpen(false)}>Games</Link>
                    {/* --- AQUI ESTÁ A MUDANÇA --- */}
                    <Link to="/leaderboard" className="nav-item" onClick={() => setDropdownOpen(false)}>Ranking</Link>

                    {currentUser ? (
                        <div className="nav-profile-menu">
                            <button className="nav-item profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <img src={currentUser.photoURL!} alt="Avatar" className="navbar-avatar" />
                                <span>{currentUser.displayName || "Perfil"}</span>
                                <span className="arrow-down">▼</span>
                            </button>
                            {dropdownOpen && (
                                <div className="dropdown-content">
                                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Ver Perfil</Link>
                                    <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Configurações</Link>
                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout} className="dropdown-item logout-button">Sair</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="nav-item">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}