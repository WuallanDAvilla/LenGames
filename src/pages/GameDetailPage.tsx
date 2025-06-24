import { useParams, Link } from "react-router-dom";
import { gamesInfoMap } from "../constants/gamesData";
import { JogoDaVelha } from "../features/games/tic-tac-toe/JogoDaVelha";
import { JogoDaMemoria } from "../features/games/memory-game/JogoDaMemoria";
import { JogoDaCobrinha } from "../features/games/snake/JogoDaCobrinha";
import { Xadrez } from "../features/games/chess/Xadrez";
import Tetris from "../features/games/tetris/Tetris";
import { SpaceInvaders } from "../features/games/space-invaders/SpaceInvaders";
import { DinoRun } from "../features/games/dino-run/DinoRun";
import "../styles/GameDetailPage.css";

const gameComponentMap = new Map<string, React.ReactElement>([
  ["jogo-da-velha", <JogoDaVelha />],
  ["genius", <JogoDaMemoria />],
  ["jogo-da-cobrinha", <JogoDaCobrinha />],
  ["xadrez", <Xadrez />],
  ["tetris", <Tetris />],
  ["space-invaders", <SpaceInvaders />],
  ["dino-run", <DinoRun />],
]);

export function GameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>();

  const gameInfo = gameId ? gamesInfoMap.get(gameId) : undefined;
  const gameComponent = gameId ? gameComponentMap.get(gameId) : undefined;

  if (!gameInfo || !gameComponent) {
    return (
      <div className="game-detail-container container">
        <h1 className="game-title">Jogo não encontrado!</h1>
        <p className="game-not-found-text">
          O jogo que você está procurando não existe ou foi movido.
        </p>
        <Link to="/games" className="back-to-games-button">
          Voltar para a lista de jogos
        </Link>
      </div>
    );
  }

  const themeClass = gameInfo.theme || "theme-default";

  return (
    <div className={`game-detail-container ${themeClass}`}>
      <div className="container">
        <h1 className="game-title">{gameInfo.name}</h1>
        <div className="game-board-container">{gameComponent}</div>
      </div>
    </div>
  );
}
