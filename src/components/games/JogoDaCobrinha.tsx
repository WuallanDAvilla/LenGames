// src/components/games/JogoDaCobrinha.tsx

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateUserHighScore } from "../../firebase";
import "./JogoDaCobrinha.css";

const GRID_SIZE = 20;
const TILE_SIZE = 20;
const GAME_ID = "jogo-da-cobrinha";

type Position = { x: number; y: number };

const createInitialState = () => ({
  snake: [{ x: 10, y: 10 }],
  food: getRandomPosition(),
  direction: { x: 0, y: -1 },
  isGameOver: false,
  score: 0,
});

function getRandomPosition(): Position {
  let position;
  const initialSnakePos = { x: 10, y: 10 };
  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (position.x === initialSnakePos.x && position.y === initialSnakePos.y);
  return position;
}

export function JogoDaCobrinha() {
  const [gameState, setGameState] = useState(createInitialState());
  const [isRunning, setIsRunning] = useState(false);
  
  const { currentUser } = useAuth();
  // CORREÇÃO APLICADA AQUI: 'direction' foi removido da desestruturação
  const { snake, food, isGameOver, score } = gameState;

  useEffect(() => {
    if (isGameOver && currentUser && score > 0) {
      updateUserHighScore(currentUser.uid, GAME_ID, score);
    }
  }, [isGameOver, score, currentUser]);


  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isRunning) return;

    setGameState((prev) => {
      const currentDirection = prev.direction;
      let newDirection = currentDirection;

      switch (e.key) {
        case "ArrowUp":
          if (currentDirection.y === 0) newDirection = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (currentDirection.y === 0) newDirection = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (currentDirection.x === 0) newDirection = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (currentDirection.x === 0) newDirection = { x: 1, y: 0 };
          break;
      }
      return { ...prev, direction: newDirection };
    });
  }, [isRunning]);

  const startGame = () => {
    setGameState(createInitialState());
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const gameInterval = setInterval(() => {
      setGameState((prev) => {
        const newSnake = [...prev.snake];
        const head = {
          x: newSnake[0].x + prev.direction.x,
          y: newSnake[0].y + prev.direction.y,
        };
        let newScore = prev.score;
        let newFood = prev.food;

        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          newSnake.some((seg) => seg.x === head.x && seg.y === head.y)
        ) {
          setIsRunning(false);
          return { ...prev, isGameOver: true };
        }

        newSnake.unshift(head);

        if (head.x === newFood.x && head.y === newFood.y) {
          newScore += 10;
          let foodPosition: Position;
          do {
            foodPosition = getRandomPosition();
          } while (newSnake.some(seg => seg.x === foodPosition.x && seg.y === foodPosition.y));
          newFood = foodPosition;
        } else {
          newSnake.pop();
        }

        return { ...prev, snake: newSnake, score: newScore, food: newFood, isGameOver: false };
      });
    }, 150);

    return () => clearInterval(gameInterval);
  }, [isRunning, isGameOver]);

  return (
    <div
      className="snake-game-container"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={(el) => el?.focus()}
    >
      <div className="snake-score-display">Pontuação: {score}</div>
      <div
        className="snake-grid"
        style={{ width: GRID_SIZE * TILE_SIZE, height: GRID_SIZE * TILE_SIZE }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`snake-segment ${index === 0 ? "head" : ""}`}
            style={{
              left: `${segment.x * TILE_SIZE}px`,
              top: `${segment.y * TILE_SIZE}px`,
            }}
          />
        ))}
        <div
          className="snake-food"
          style={{
            left: `${food.x * TILE_SIZE}px`,
            top: `${food.y * TILE_SIZE}px`,
          }}
        />
      </div>
      {!isRunning && (
        <div className="game-start-overlay">
          {isGameOver && <div>Fim de Jogo! Pontuação: {score}</div>}
          <button onClick={startGame} className="snake-start-button">
            {isGameOver ? "Jogar Novamente" : "Iniciar Jogo"}
          </button>
        </div>
      )}
    </div>
  );
}