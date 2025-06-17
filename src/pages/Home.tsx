import { Link } from 'react-router-dom';
import '../styles/Home.css'; 

export function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bem-vindo ao LenGames</h1>
        <p>Sua plataforma para descobrir e se divertir com mini-games incríveis.</p>
        <Link to="/games" className="home-cta-button">
          Ver os Jogos
        </Link>
      </header>

      <section className="home-section">
        <h2>O Que Oferecemos?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Jogos Casuais</h3>
            <p>Diversão rápida e fácil para qualquer momento do dia.</p>
          </div>
          <div className="feature-card">
            <h3>Perfil de Jogador</h3>
            <p>Acompanhe seu progresso e suas conquistas.</p>
          </div>
          <div className="feature-card">
            <h3>Comunidade Ativa</h3>
            <p>Conecte-se com amigos e desafie seus recordes.</p>
          </div>
        </div>
      </section>
    </div>
  );
}