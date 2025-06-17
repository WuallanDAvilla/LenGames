// src/pages/GameDetailPage.tsx

import { useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { JogoDaVelha } from '../components/games/JogoDaVelha.tsx';
import { JogoDaMemoria } from '../components/games/JogoDaMemoria.tsx'; // <-- MUDANÇA 1: Importe o novo jogo
import '../styles/GameDetailPage.css';

// MUDANÇA 2: Adicione o JogoDaMemoria ao nosso objeto de jogos
const gamesData: { [key: string]: { name: string; component: ReactNode } } = {
  'jogo-da-velha': {
    name: 'Jogo da Velha',
    component: <JogoDaVelha />
  },
  'genius': {
    name: 'Jogo da Memória (Genius)',
    component: <JogoDaMemoria />
  }
};

export function GameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>();

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
        {game.component}
      </div>
    </div>
  );
}