import React, { useState, useEffect } from "react";
import { createStage, checkCollision } from "./gameHelpers";

import { useInterval } from "./useInterval";
import { usePlayer } from "./usePlayer";
import { useStage } from "./useStage";
import { useGameStatus } from "./useGameStatus";
import { useAuth } from "../../../contexts/AuthContext";
import { updateUserHighScore } from "../../../services/firebase";

import Stage from "./Stage";
import Display from "./Display";
import { LoginToPlay } from "../../../components/LoginToPlay/LoginToPlay"; 

import "./Tetris.css";

const GAME_ID = "tetris";

const Tetris: React.FC = () => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(true);

  const { currentUser } = useAuth(); 
  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] =
    useGameStatus(rowsCleared);

  useEffect(() => {
    if (gameOver && currentUser && score > 0) {
      updateUserHighScore(currentUser.uid, GAME_ID, score);
    }
  }, [gameOver, score, currentUser]);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = () => {
    if (!currentUser) return; 
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

  const keyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!gameOver && currentUser && (e.key === "ArrowDown" || e.key === "s")) {
      setDropTime(1000 / (level + 1) + 200);
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const move = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!gameOver && currentUser) {
      if (e.key === "ArrowLeft" || e.key === "a") movePlayer(-1);
      else if (e.key === "ArrowRight" || e.key === "d") movePlayer(1);
      else if (e.key === "ArrowDown" || e.key === "s") dropPlayer();
      else if (e.key === "ArrowUp" || e.key === "w") playerRotate(stage, 1);
    }
  };

  useInterval(() => {
    if (currentUser) {
      drop();
    }
  }, dropTime);

  if (!currentUser) {
    return <LoginToPlay gameName="Tetris" />;
  }

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
