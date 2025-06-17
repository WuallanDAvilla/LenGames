// src/pages/GameDetailPage.tsx

import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { gamesInfoMap } from '../data/gamesData'; // Importa o mapa de INFORMAÇÕES

// Importa os componentes de JOGO aqui
import { JogoDaVelha } from '../components/games/JogoDaVelha';
import { JogoDaMemoria } from '../components/games/JogoDaMemoria';

import '../styles/GameDetailPage.css';

// Um novo mapa para associar o ID do jogo ao seu componente real
const gameComponentMap = new Map([
  ['jogo-da-velha', <JogoDaVelha />],
  ['genius', <JogoDaMemoria />]
]);


export function GameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>();
  
  // Pega as informações do jogo (nome, tema, etc.)
  const gameInfo = gameId ? gamesInfoMap.get(gameId) : undefined;
  // Pega o componente do jogo
  const gameComponent = gameId ? gameComponentMap.get(gameId) : undefined;

  useEffect(() => {
    if (gameInfo) {
      document.body.classList.add(gameInfo.theme);
    }
    return () => {
      if (gameInfo) {
        document.body.classList.remove(gameInfo.theme);
      }
    };
  }, [gameInfo]);

  // Se não encontrarmos informações OU o componente, mostramos o erro.
  if (!gameInfo || !gameComponent) {
    return (
      <div className="game-detail-page">
        <h1>Jogo não encontrado!</h1>
      </div>
    );
  }

  return (
    <div className="game-detail-page">
      <h1 className="game-title">{gameInfo.name}</h1>
      <div className="game-board-container">
        {gameComponent}
      </div>
    </div>
  );
}