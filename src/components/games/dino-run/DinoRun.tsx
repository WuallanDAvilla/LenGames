import { useState, useEffect, useRef, useCallback } from 'react';
import './DinoRun.css';

// --- Constantes ---
const GAME_WIDTH = 600;
const GAME_HEIGHT = 200;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 40;
const DINO_INITIAL_Y = 20; // É a altura do chão
const GROUND_HEIGHT = 20;

const JUMP_FORCE = 12;
const GRAVITY = 0.6;
const INITIAL_GAME_SPEED = 5;
const SPEED_INCREASE_INTERVAL = 500;

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
  
  const nextObstacleTimeRef = useRef<number>(0);
  const gameLoopRef = useRef<number | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      if (!gameStarted || gameOver) {
        resetGame();
      } else if (!isJumping) {
        setIsJumping(true);
        setDinoVelocityY(JUMP_FORCE);
      }
    }
  }, [gameStarted, gameOver, isJumping, resetGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameLoop = useCallback((timestamp: number) => {
    if (!gameStarted || gameOver) return;

    let newVelocityY = dinoVelocityY - GRAVITY;
    let newDinoY = dinoY + newVelocityY;
    if (newDinoY <= GROUND_HEIGHT) {
      newDinoY = GROUND_HEIGHT; newVelocityY = 0; setIsJumping(false);
    }
    setDinoY(newDinoY);
    setDinoVelocityY(newVelocityY);

    if (timestamp > nextObstacleTimeRef.current) {
      const minInterval = 600; const maxInterval = 1800;
      nextObstacleTimeRef.current = timestamp + Math.random() * (maxInterval - minInterval) + minInterval;
      const newObstacle: Obstacle = {
        id: timestamp, x: GAME_WIDTH, width: 20 + Math.random() * 20, height: 30 + Math.random() * 30,
      };
      setObstacles(prev => [...prev, newObstacle]);
    }
    setObstacles(prev => prev.map(obs => ({ ...obs, x: obs.x - gameSpeed })).filter(obs => obs.x > -obs.width));
    
    // A CORREÇÃO ESTÁ AQUI:
    const dinoHitbox = { x: 20, y: newDinoY, width: DINO_WIDTH, height: DINO_HEIGHT };
    for (const obs of obstacles) {
      // Usamos GROUND_HEIGHT em vez de obs.y, pois todos os cactos estão no chão.
      if (
        dinoHitbox.x < obs.x + obs.width &&
        dinoHitbox.x + dinoHitbox.width > obs.x &&
        dinoHitbox.y < GROUND_HEIGHT + obs.height &&
        dinoHitbox.y + dinoHitbox.height > GROUND_HEIGHT
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }
    }
    
    const currentScore = Math.floor(score + 1);
    setScore(currentScore);
    if(currentScore > 0 && currentScore % SPEED_INCREASE_INTERVAL === 0) {
        setGameSpeed(prevSpeed => prevSpeed + 0.5);
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, gameOver, dinoVelocityY, dinoY, obstacles, score, highScore, gameSpeed]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameContainerRef.current?.focus();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, gameLoop]);

  return (
    <div className="dr-game-container" ref={gameContainerRef} tabIndex={-1} style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
      <div className="dr-ui">
        <span>HI {Math.floor(highScore / 10).toString().padStart(5, '0')}</span>
        <span>{Math.floor(score / 10).toString().padStart(5, '0')}</span>
      </div>

      {(!gameStarted || gameOver) && (
        <div className="dr-message-overlay">
          <span>{gameOver ? 'GAME OVER' : 'Pressione Espaço para Começar'}</span>
        </div>
      )}

      <div className={`dr-ground ${gameStarted && !gameOver ? 'scrolling' : ''}`} style={{ animationDuration: `${10 / (gameSpeed / INITIAL_GAME_SPEED)}s`}} />
      <div className={`dr-dino ${gameOver ? 'dead' : ''}`} style={{ bottom: `${dinoY}px`}} />
      
      {obstacles.map(obs => (
        <div key={obs.id} className="dr-obstacle" style={{ left: `${obs.x}px`, width: obs.width, height: obs.height, bottom: GROUND_HEIGHT }}/>
      ))}
    </div>
  );
}