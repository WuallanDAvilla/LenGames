import { Link } from "react-router-dom";
import { gamesList } from "../data/gamesData";
import "../styles/Games.css";

export function Games() {
  return (
    // Envolvemos tudo em um 'div' com a classe 'container'
    <div className="container">
      <div className="games-page-header">
        <h1 className="section-title">Nossos Jogos</h1>
        <p className="section-subtitle">
          Escolha um jogo abaixo para começar a diversão!
        </p>
      </div>

      <div className="games-grid">
        {gamesList.map((game) => (
          <Link to={`/games/${game.id}`} key={game.id} className="game-card">
            <div className="game-card-cover">
              <img src={game.coverImage} alt={`Capa do jogo ${game.name}`} />
              <div className="cover-overlay"></div>{" "}
              {/* Overlay para efeito de hover */}
            </div>
            <div className="game-card-info">
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
