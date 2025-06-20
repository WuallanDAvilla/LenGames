import React, { useState } from "react";
import { createStage, checkCollision } from "./gameHelpers";
import { useInterval } from "./useInterval";

// Hooks
import { usePlayer } from "./usePlayer";
import { useStage } from "./useStage";
import { useGameStatus } from "./useGameStatus";

// Components
import Stage from "./Stage";
import Display from "./Display";

// Styles
import "./Tetris.css";

const Tetris: React.FC = () => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(true);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] =
    useGameStatus(rowsCleared);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = () => {
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(0);
  };

  const drop = () => {
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  // CORREÇÃO 1: Recebe o evento completo para poder chamar preventDefault
  const keyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault(); // Impede o scroll
    if (!gameOver && e.keyCode === 40) {
      setDropTime(1000 / (level + 1) + 200);
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  // CORREÇÃO 2: Recebe o evento completo para poder chamar preventDefault
  const move = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault(); // Impede o scroll
    if (!gameOver) {
      if (e.keyCode === 37) movePlayer(-1);
      else if (e.keyCode === 39) movePlayer(1);
      else if (e.keyCode === 40) dropPlayer();
      else if (e.keyCode === 38) playerRotate(stage, 1);
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <div
      className="tetris-wrapper"
      role="button"
      tabIndex={0}
      onKeyDown={move}
      onKeyUp={keyUp}
      // Adiciona um foco automático ao iniciar o jogo
      ref={(el) => el?.focus()}
    >
      <div className="tetris">
        <div className="tetris-stage">
          <Stage stage={stage} />
        </div>
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Pontos: ${score}`} />
              <Display text={`Linhas: ${rows}`} />
              <Display text={`Nível: ${level}`} />
            </div>
          )}
          <button className="start-button" onClick={startGame}>
            Começar Jogo
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Tetris;
