// src/pages/GameDetailPage.tsx

import { useParams } from 'react-router-dom';
import type { ReactNode } from 'react'; // <-- MUDANÇA 1: Importa o tipo ReactNode
import { JogoDaVelha } from '../components/games/JogoDaVelha.tsx';
import '../styles/GameDetailPage.css'; // Usando sua pasta de estilos

// Um objeto para mapear o ID do jogo ao seu componente e informações.
// Isso torna fácil adicionar novos jogos no futuro.
const gamesData: { [key: string]: { name: string; component: ReactNode } } = { // <-- MUDANÇA 2: Usa ReactNode aqui
  'jogo-da-velha': {
    name: 'Jogo da Velha',
    component: <JogoDaVelha />
  },
  'genius': {
    name: 'Jogo da Memória (Genius)',
    component: <div>Em desenvolvimento...</div>
  },
  'forca': {
    name: 'Jogo da Forca',
    component: <div>Em desenvolvimento...</div>
  }
};

export function GameDetailPage() {
  // O hook useParams pega os parâmetros da URL. No nosso caso, o ':gameId'.
  const { gameId } = useParams<{ gameId: string }>();

  // Se o gameId não for encontrado ou não existir nos nossos dados, mostramos um erro.
  if (!gameId || !gamesData[gameId]) {
    return (
      <div className="game-detail-container">
        <h1>Jogo não encontrado!</h1>
        <p>O jogo que você está procurando não existe ou foi removido.</p>
      </div>
    );
  }

  const game = gamesData[gameId];

  return (
    <div className="game-detail-container">
      <h1 className="game-title">{game.name}</h1>
      <div className="game-board-container">
        {/* Renderiza o componente do jogo correspondente */}
        {game.component}
      </div>
    </div>
  );
}