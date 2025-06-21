// src/components/LoginToPlay.tsx

import { Link, useLocation } from "react-router-dom";
import "./LoginToPlay.css"; // Vamos criar este CSS a seguir

interface LoginToPlayProps {
  gameName: string;
}

export function LoginToPlay({ gameName }: LoginToPlayProps) {
  const location = useLocation();

  return (
    <div className="login-to-play-container">
      <div className="login-to-play-box">
        <h2>Ação necessária!</h2>
        <p>
          Você precisa estar conectado para jogar <strong>{gameName}</strong> e
          salvar suas pontuações.
        </p>
        <div className="login-to-play-actions">
          <Link to="/login" state={{ from: location }} className="login-button">
            Fazer Login
          </Link>
          <Link
            to="/login"
            state={{ from: location, isRegistering: true }}
            className="register-button"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  );
}
