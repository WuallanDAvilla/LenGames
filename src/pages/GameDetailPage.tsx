// src/pages/GameDetailPage.tsx

import { useParams } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react'; // <-- MUDANÇA 1: Importe o useEffect
import { JogoDaVelha } from '../components/games/JogoDaVelha.tsx';
import { JogoDaMemoria } from '../components/games/JogoDaMemoria.tsx';
import '../styles/GameDetailPage.css';

// MUDANÇA 2: Adicionamos uma propriedade 'theme' para cada jogo
const gamesData: { [key: string]: { name: string; component: ReactNode; theme: string } } = {
  'jogo-da-velha': {
    name: 'Jogo da Velha',
    component: <JogoDaVelha />,
    theme: 'theme-tictactoe' // Tema azul e verde
  },
  'genius': {
    name: 'Jogo da Memória (Genius)',
    component: <JogoDaMemoria />,
    theme: 'theme-genius' // Tema escuro e neon
  }
};

export function GameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>();

  // MUDANÇA 3: Lógica para adicionar e remover a classe do tema no body
  useEffect(() => {
    // Se o jogo existe, adiciona a classe do tema ao body
    if (gameId && gamesData[gameId]) {
      document.body.classList.add(gamesData[gameId].theme);
    }

    // Função de limpeza: será executada quando o componente for "desmontado" (quando o usuário sair da página)
    return () => {
      if (gameId && gamesData[gameId]) {
        document.body.classList.remove(gamesData[gameId].theme);
      }
    };
  }, [gameId]); // O efeito será re-executado se o gameId mudar

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
    // Removemos o container com fundo fixo daqui, pois o tema agora é controlado pelo body
    <div className="game-detail-page">
      <h1 className="game-title">{game.name}</h1>
      <div className="game-board-container">
        {game.component}
      </div>
    </div>
  );
}