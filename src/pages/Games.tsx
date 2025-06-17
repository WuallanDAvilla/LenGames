import { Link } from 'react-router-dom';
import { gamesList } from '../data/gamesData';
import '../styles/Games.css';

export function Games() {
  return (
    <div className="games-page-container">
      <h1>Nossos Jogos</h1>
      <p className="games-subtitle">Escolha um jogo abaixo para começar a diversão!</p>

      <div className="games-grid">
        {gamesList.map((game) => (
          <Link to={`/games/${game.id}`} key={game.id} className="game-card">
            
      
            <div className="game-card-cover">

              <img src={game.coverImage} alt={`Capa do jogo ${game.name}`} />
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