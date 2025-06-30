import { useState } from "react";
import { Link } from "react-router-dom";
import UpdateLog from "../components/UpdateLog/UpdateLog";
import Modal from "../components/Modal/Modal"; 
import "../styles/Home.css";

export function Home() {
  const [isLogModalOpen, setLogModalOpen] = useState(false);

  return (
    <>
      <div className="home-container">
        <section className="home-hero">
          <h1 className="home-title">
            Bem-vindo ao <span className="highlight-text">PixelRush</span>
          </h1>
          <p className="home-subtitle">
            Sua plataforma para descobrir e se divertir com minijogos incríveis.
          </p>
          <div className="home-cta-container">
            <Link to="/games" className="home-cta-button">
              Ver os Jogos
            </Link>
            <button
              className="home-changelog-button"
              onClick={() => setLogModalOpen(true)}
            >
              Ver Novidades ✨
            </button>
          </div>
        </section>

        <section className="home-features">
          <div className="container">
            <h2 className="section-title">O que vem?</h2>
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
          </div>
        </section>
      </div>
      <Modal isOpen={isLogModalOpen} onClose={() => setLogModalOpen(false)}>
        <UpdateLog />
      </Modal>
    </>
  );
}
