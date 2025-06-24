import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>LenGames</h4>
          <p>Sua plataforma de mini-jogos para se divertir a qualquer hora.</p>
        </div>
        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/games">Jogos</Link>
            </li>
            <li>
              <Link to="/conta">Minha Conta</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Equipe de Desenvolvedores</h4>
          <ul className="dev-list">
            <li>Len D'Avilla - Back/Front</li>
            <li>Flávio José - Back/Front</li>
            <li>NeonCharger - Art Designer</li>
            <li>Arthur - BetaTester</li>
          </ul>
          <p className="project-description">
            Um projeto construído com React e Firebase.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {currentYear} LenGames. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
