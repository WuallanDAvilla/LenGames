// src/components/games/tetris/Tetris.tsx

import React, { useState, useEffect } from "react"; // 1. Adicionado useEffect
import { createStage, checkCollision } from "./gameHelpers";

// Hooks
import { useInterval } from "./useInterval";
import { usePlayer } from "./usePlayer";
import { useStage } from "./useStage";
import { useGameStatus } from "./useGameStatus";
import { useAuth } from "../../../contexts/AuthContext"; // 2. Importado o AuthContext
import { updateUserHighScore } from "../../../firebase"; // 3. Importada nossa função de ranking

// Components
import Stage from "./Stage";
import Display from "./Display";

// Styles
import "./Tetris.css";

const GAME_ID = "tetris"; // 4. ID do Jogo para o ranking

const Tetris: React.FC = () => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(true);

  const { currentUser } = useAuth(); // 5. Obtendo o usuário logado
  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] =
    useGameStatus(rowsCleared);

  // 6. Efeito para salvar a pontuação quando o jogo termina
  useEffect(() => {
    // Só executa se o jogo tiver acabado (gameOver === true) e houver um usuário logado
    if (gameOver && currentUser && score > 0) {
      updateUserHighScore(currentUser.uid, GAME_ID, score);
    }
    // Este efeito depende dessas variáveis. Ele será re-executado se alguma delas mudar.
  }, [gameOver, score, currentUser]);

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
        // A condição de "Game Over" é detectada aqui, o que acionará nosso useEffect!
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const keyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!gameOver && (e.key === "ArrowDown" || e.key === "s")) {
      setDropTime(1000 / (level + 1) + 200);
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const move = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!gameOver) {
      if (e.key === "ArrowLeft" || e.key === "a") movePlayer(-1);
      else if (e.key === "ArrowRight" || e.key === "d") movePlayer(1);
      else if (e.key === "ArrowDown" || e.key === "s") dropPlayer();
      else if (e.key === "ArrowUp" || e.key === "w") playerRotate(stage, 1);
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
      ref={(el) => el?.focus()}
    >
      <div className="tetris">
        <div className="tetris-stage">
          <Stage stage={stage} />
        </div>
        <aside>
          {gameOver ? (
            // Adicionamos a pontuação final na tela de Game Over
            <div>
              <Display gameOver={gameOver} text="Game Over" />
              <Display text={`Pontos: ${score}`} />
            </div>
          ) : (
            <div>
              <Display text={`Pontos: ${score}`} />
              <Display text={`Linhas: ${rows}`} />
              <Display text={`Nível: ${level}`} />
            </div>
          )}
          <button className="start-button" onClick={startGame}>
            {gameOver ? "Começar Jogo" : "Reiniciar"}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Tetris;
