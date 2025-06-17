import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { gamesInfoMap } from '../data/gamesData';

import { JogoDaVelha } from '../components/games/JogoDaVelha';
import { JogoDaMemoria } from '../components/games/JogoDaMemoria';
import { JogoDaCobrinha } from '../components/games/JogoDaCobrinha';

import '../styles/GameDetailPage.css';

const gameComponentMap = new Map([
  ['jogo-da-velha', <JogoDaVelha />],
  ['genius', <JogoDaMemoria />],
  ['jogo-da-cobrinha', <JogoDaCobrinha />] 
]);


export function GameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>();

  const gameInfo = gameId ? gamesInfoMap.get(gameId) : undefined;
  const gameComponent = gameId ? gameComponentMap.get(gameId) : undefined;

  useEffect(() => {
    
    let themeClass = 'theme-default'; 
    if (gameInfo && gameInfo.theme) {
      themeClass = gameInfo.theme;
    }
    document.body.classList.add(themeClass);

    return () => {
      document.body.classList.remove(themeClass);
    };
  }, [gameInfo]);

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