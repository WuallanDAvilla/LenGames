import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.ts";
import "./NavBar.css";

export function NavBar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await signOut(auth);
    navigate("/login");
  };

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeDropdown}>
          LenGames
        </Link>
        <div className="navbar-links">
          <NavLink to="/" className="nav-item" onClick={closeDropdown} end>
            Home
          </NavLink>
          <NavLink to="/games" className="nav-item" onClick={closeDropdown}>
            Jogos
          </NavLink>
          <NavLink
            to="/leaderboard"
            className="nav-item"
            onClick={closeDropdown}
          >
            Classificação
          </NavLink>

          {currentUser ? (
            <div className="nav-profile-menu">
              <button
                className="nav-item profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <img
                  src={currentUser.photoURL!}
                  alt="Avatar do usuário"
                  className="navbar-avatar"
                />
                <span>{currentUser.displayName || "Perfil"}</span>
                <span className="arrow-down">▼</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <Link
                    to="/conta"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    Minha Conta
                  </Link>
                  <Link
                    to="/settings"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    Configurações
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-button"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="nav-item">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
