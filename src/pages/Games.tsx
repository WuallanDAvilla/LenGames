// src/pages/Games.tsx

import { Link } from 'react-router-dom';
import { gamesList } from '../data/gamesData'; // Importa a lista do nosso arquivo de dados
import '../styles/Games.css';

export function Games() {
  return (
    <div className="games-page-container">
      <h1>Nossos Jogos</h1>
      <p className="games-subtitle">Escolha um jogo abaixo para começar a diversão!</p>

      <div className="games-grid">
        {gamesList.map((game) => (
          <Link to={`/games/${game.id}`} key={game.id} className={`game-card ${game.theme}-hover`}>
            <div className="game-card-icon-wrapper">
              <game.Icon className="game-card-icon" />
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