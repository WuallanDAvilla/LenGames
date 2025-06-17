// src/pages/Games.tsx

import { Link } from 'react-router-dom';
import '../styles/Games.css'; // Importando o CSS que vamos criar

// --- Dados de Exemplo (Mock Data) ---
// No futuro, esta lista poderia vir do seu banco de dados Firebase.
// Usamos IDs amigáveis para as URLs (ex: /games/jogo-da-velha).
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
  },
  {
    id: 'forca',
    name: 'Jogo da Forca',
    description: 'Adivinhe a palavra secreta antes que seja tarde demais.',
    imageUrl: 'https://images.unsplash.com/photo-1579969427773-45a73a682a20?q=80&w=1770'
  }
];

export function Games() {
  return (
    <div className="games-page-container">
      <h1>Nossos Jogos</h1>
      <p className="games-subtitle">Escolha um jogo abaixo para começar a diversão!</p>

      {/* A grade que vai conter todos os cartões de jogos */}
      <div className="games-grid">
        {/* Usamos a função .map() para transformar cada item do nosso array 'gamesList' em um cartão de jogo (JSX) */}
        {gamesList.map((game) => (
          // O <Link> do react-router-dom faz o cartão inteiro ser um link clicável.
          // A prop 'to' usa a ID do jogo para criar a URL dinâmica.
          // A prop 'key' é essencial para o React otimizar a lista.
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