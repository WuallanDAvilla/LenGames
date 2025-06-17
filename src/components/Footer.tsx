// src/components/Footer.tsx

import './Footer.css';

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
            <li><a href="/">Home</a></li>
            <li><a href="/games">Jogos</a></li>
            <li><a href="/profile">Perfil</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Desenvolvido por</h4>
          {/* Adicionei uma classe para estilizar a lista de desenvolvedores */}
          <ul className="dev-list">
            <li>Wuallan "Len" D'Avilla - Back/Front</li>
            <li>Flávio José - Back/Front</li>
            <li>NeonCharger - Art Designer</li>
          </ul>
          <p className="project-description">Um projeto com habilidades de React e Firebase.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {currentYear} LenGames. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}