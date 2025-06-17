// src/pages/Games.tsx

import { Link } from 'react-router-dom';
import '../styles/Games.css';

// --- MUDANÇA: O Jogo da Forca foi removido desta lista ---
const gamesList = [
  {
    id: 'jogo-da-velha',
    name: 'Jogo da Velha',
    description: 'O clássico atemporal. Desafie um amigo ou o computador.',
    imageUrl: 'https://images.unsplash.com/photo-1608111283303-a567afd93683?q=80&w=1780'
  },
  {
    id: 'genius',
    name: 'Jogo da Memória (Genius)',
    description: 'Teste sua memória e agilidade seguindo a sequência de cores.',
    imageUrl: 'https://images.unsplash.com/photo-1598550473235-909197253556?q=80&w=1770'
  }
];

export function Games() {
  return (
    <div className="games-page-container">
      <h1>Nossos Jogos</h1>
      <p className="games-subtitle">Escolha um jogo abaixo para começar a diversão!</p>

      <div className="games-grid">
        {gamesList.map((game) => (
          <Link to={`/games/${game.id}`} key={game.id} className="game-card">
            <img src={game.imageUrl} alt={`Capa do jogo ${game.name}`} className="game-card-image" />
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