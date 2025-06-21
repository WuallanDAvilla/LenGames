// src/components/games/dino-run/DinoRun.tsx

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { updateUserHighScore } from "../../../firebase";
import "./DinoRun.css";

// --- Constantes ---
const GAME_WIDTH = 600;
const GAME_HEIGHT = 200;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 40;
const DINO_INITIAL_Y = 20;
const GROUND_HEIGHT = 20;

const JUMP_FORCE = 12;
const GRAVITY = 0.6;
const INITIAL_GAME_SPEED = 5;
const SPEED_INCREASE_INTERVAL = 500;
const GAME_ID = "dino-run";

// --- Tipos ---
type Obstacle = {
  id: number;
  x: number;
  width: number;
  height: number;
};

// --- Componente Principal ---
export function DinoRun() {
  const [dinoY, setDinoY] = useState(DINO_INITIAL_Y);
  const [dinoVelocityY, setDinoVelocityY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(INITIAL_GAME_SPEED);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const { currentUser } = useAuth();

  const nextObstacleTimeRef = useRef<number>(0);
  const gameLoopRef = useRef<number | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameOver && currentUser && score > 0) {
      const finalScore = Math.floor(score / 10);
      updateUserHighScore(currentUser.uid, GAME_ID, finalScore);

      if (finalScore > highScore) {
        setHighScore(finalScore);
      }
    }
  }, [gameOver, score, currentUser, highScore]);

  const resetGame = useCallback(() => {
    setDinoY(DINO_INITIAL_Y);
    setDinoVelocityY(0);
    setIsJumping(false);
    setObstacles([]);
    setScore(0);
    setGameSpeed(INITIAL_GAME_SPEED);
    setGameOver(false);
    setGameStarted(true);
    nextObstacleTimeRef.current = 0;
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (!gameStarted || gameOver) {
          resetGame();
        } else if (!isJumping) {
          setIsJumping(true);
          setDinoVelocityY(JUMP_FORCE);
        }
      }
    },
    [gameStarted, gameOver, isJumping, resetGame]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // A LÓGICA CORRIGIDA ESTÁ AQUI 👇
  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver) return;

    // --- Atualização da Física ---
    let newVelocityY = dinoVelocityY - GRAVITY;
    let newDinoY = dinoY + newVelocityY;

    if (newDinoY <= GROUND_HEIGHT) {
      newDinoY = GROUND_HEIGHT;
      newVelocityY = 0;
      setIsJumping(false);
    }

    setDinoY(newDinoY);
    setDinoVelocityY(newVelocityY);

    // --- Atualização dos Obstáculos ---
    let newObstacles = [...obstacles];
    const now = performance.now();

    if (now > nextObstacleTimeRef.current) {
      const minInterval = 600;
      const maxInterval = 1800;
      nextObstacleTimeRef.current =
        now + Math.random() * (maxInterval - minInterval) + minInterval;
      newObstacles.push({
        id: now,
        x: GAME_WIDTH,
        width: 20 + Math.random() * 20,
        height: 30 + Math.random() * 30,
      });
    }

    newObstacles = newObstacles
      .map((obs) => ({ ...obs, x: obs.x - gameSpeed }))
      .filter((obs) => obs.x > -obs.width);

    setObstacles(newObstacles);

    // --- Verificação de Colisão ---
    const dinoHitbox = {
      x: 20,
      y: newDinoY,
      width: DINO_WIDTH,
      height: DINO_HEIGHT,
    };
    for (const obs of newObstacles) {
      // Usa a lista de obstáculos atualizada
      if (
        dinoHitbox.x < obs.x + obs.width &&
        dinoHitbox.x + dinoHitbox.width > obs.x &&
        dinoHitbox.y < GROUND_HEIGHT + obs.height &&
        dinoHitbox.y + dinoHitbox.height > GROUND_HEIGHT
      ) {
        setGameOver(true);
        return;
      }
    }

    // --- Atualização de Pontuação e Velocidade ---
    const currentScore = score + 1;
    if (currentScore > 0 && currentScore % SPEED_INCREASE_INTERVAL === 0) {
      setGameSpeed((prevSpeed) => prevSpeed + 0.5);
    }
    setScore(currentScore);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [
    gameStarted,
    gameOver,
    dinoY,
    dinoVelocityY,
    obstacles,
    score,
    gameSpeed,
  ]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameContainerRef.current?.focus();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, gameLoop]);

  const displayScore = Math.floor(score / 10)
    .toString()
    .padStart(5, "0");
  const displayHighScore = Math.floor(highScore).toString().padStart(5, "0");

  return (
    <div
      className="dr-game-container"
      ref={gameContainerRef}
      tabIndex={-1}
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
    >
      <div className="dr-ui">
        <span>HI {displayHighScore}</span>
        <span>{displayScore}</span>
      </div>

      {(!gameStarted || gameOver) && (
        <div className="dr-message-overlay">
          <span>
            {gameOver ? "GAME OVER" : "Pressione Espaço para Começar"}
          </span>
        </div>
      )}

      <div
        className={`dr-ground ${gameStarted && !gameOver ? "scrolling" : ""}`}
        style={{
          animationDuration: `${10 / (gameSpeed / INITIAL_GAME_SPEED)}s`,
        }}
      />
      <div
        className={`dr-dino ${gameOver ? "dead" : ""}`}
        style={{ bottom: `${dinoY}px` }}
      />

      {obstacles.map((obs) => (
        <div
          key={obs.id}
          className="dr-obstacle"
          style={{
            left: `${obs.x}px`,
            width: obs.width,
            height: obs.height,
            bottom: GROUND_HEIGHT,
          }}
        />
      ))}
    </div>
  );
}
