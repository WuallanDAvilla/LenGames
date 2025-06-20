import { useState, useEffect, useRef, useCallback } from "react";
import "./SpaceInvaders.css";

// --- Constantes ---
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 25;
const PROJECTILE_WIDTH = 5;
const PROJECTILE_HEIGHT = 15;
const INVADER_SIZE = 30;
const INVADER_GRID_ROWS = 4;
const INVADER_GRID_COLS = 8;
const INVADER_MOVE_INTERVAL = 1000;
const PLAYER_PROJECTILE_SPEED = 7;
const INVADER_PROJECTILE_SPEED = 4;
const PLAYER_SHOOT_COOLDOWN = 400;
const INVADER_SHOOT_INTERVAL = 800;

// --- Tipos ---
type Position = { x: number; y: number };
type Invader = Position & { id: number };

// --- Funções Auxiliares ---
const createInvaderFleet = (): Invader[] => {
  const fleet: Invader[] = [];
  for (let row = 0; row < INVADER_GRID_ROWS; row++) {
    for (let col = 0; col < INVADER_GRID_COLS; col++) {
      fleet.push({
        id: row * INVADER_GRID_COLS + col,
        x: col * (INVADER_SIZE + 10) + 45,
        y: row * (INVADER_SIZE + 10) + 30,
      });
    }
  }
  return fleet;
};

// --- Componente Principal ---
export function SpaceInvaders() {
  const [playerPos, setPlayerPos] = useState<Position>({
    x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: GAME_HEIGHT - 50,
  });
  const [playerProjectiles, setPlayerProjectiles] = useState<Position[]>([]);
  const [invaders, setInvaders] = useState<Invader[]>(createInvaderFleet());
  const [invaderProjectiles, setInvaderProjectiles] = useState<Position[]>([]);
  const [invaderDirection, setInvaderDirection] = useState<"right" | "left">(
    "right"
  );
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const lastInvaderMoveTimeRef = useRef<number>(0);
  const lastPlayerShootTimeRef = useRef<number>(0);
  const lastInvaderShootTimeRef = useRef<number>(0);
  const gameLoopRef = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      setKeys((prev) => ({ ...prev, [e.key]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) =>
      setKeys((prev) => ({ ...prev, [e.key]: false }));
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const startGame = () => {
    setPlayerPos({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - 50 });
    setPlayerProjectiles([]);
    setInvaders(createInvaderFleet());
    setInvaderProjectiles([]);
    setInvaderDirection("right");
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameStarted(true);
    lastPlayerShootTimeRef.current = 0;
  };

  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!gameStarted || gameOver) {
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        return;
      }

      setPlayerPos((prevPos) => {
        let newX = prevPos.x;
        if (keys["ArrowLeft"] && newX > 0) newX -= 5;
        if (keys["ArrowRight"] && newX < GAME_WIDTH - PLAYER_WIDTH) newX += 5;
        return { ...prevPos, x: newX };
      });

      if (
        keys[" "] &&
        timestamp - lastPlayerShootTimeRef.current > PLAYER_SHOOT_COOLDOWN
      ) {
        lastPlayerShootTimeRef.current = timestamp;
        setPlayerProjectiles((prev) => [
          ...prev,
          {
            x: playerPos.x + PLAYER_WIDTH / 2 - PROJECTILE_WIDTH / 2,
            y: playerPos.y,
          },
        ]);
      }

      setPlayerProjectiles((prev) =>
        prev
          .map((p) => ({ ...p, y: p.y - PLAYER_PROJECTILE_SPEED }))
          .filter((p) => p.y > 0)
      );
      setInvaderProjectiles((prev) =>
        prev
          .map((p) => ({ ...p, y: p.y + INVADER_PROJECTILE_SPEED }))
          .filter((p) => p.y < GAME_HEIGHT)
      );

      if (timestamp - lastInvaderMoveTimeRef.current > INVADER_MOVE_INTERVAL) {
        lastInvaderMoveTimeRef.current = timestamp;
        if (invaders.length > 0) {
          let newDirection = invaderDirection;
          let moveDown = false;
          const fleetEdge =
            invaderDirection === "right"
              ? Math.max(...invaders.map((inv) => inv.x))
              : Math.min(...invaders.map((inv) => inv.x));
          if (
            (invaderDirection === "right" &&
              fleetEdge >= GAME_WIDTH - (INVADER_SIZE + 10)) ||
            (invaderDirection === "left" && fleetEdge <= 10)
          ) {
            newDirection = invaderDirection === "right" ? "left" : "right";
            moveDown = true;
          }
          setInvaderDirection(newDirection);
          setInvaders((prev) =>
            prev.map((inv) => ({
              ...inv,
              x: inv.x + (moveDown ? 0 : newDirection === "right" ? 10 : -10),
              y: inv.y + (moveDown ? INVADER_SIZE : 0),
            }))
          );
        }
      }

      if (
        timestamp - lastInvaderShootTimeRef.current >
        INVADER_SHOOT_INTERVAL
      ) {
        lastInvaderShootTimeRef.current = timestamp;
        if (invaders.length > 0) {
          const randomInvaderIndex = Math.floor(
            Math.random() * invaders.length
          );
          const shootingInvader = invaders[randomInvaderIndex];
          setInvaderProjectiles((prev) => [
            ...prev,
            {
              x: shootingInvader.x + INVADER_SIZE / 2,
              y: shootingInvader.y + INVADER_SIZE,
            },
          ]);
        }
      }

      // Colisões
      // CORREÇÃO: Trocamos 'let' por 'const'
      const newInvaders = [...invaders];
      const projectilesToRemove = new Set<number>();

      playerProjectiles.forEach((proj, projIndex) => {
        newInvaders.forEach((inv, invIndex) => {
          if (
            proj.x < inv.x + INVADER_SIZE &&
            proj.x + PROJECTILE_WIDTH > inv.x &&
            proj.y < inv.y + INVADER_SIZE &&
            proj.y + PROJECTILE_HEIGHT > inv.y
          ) {
            newInvaders.splice(invIndex, 1);
            projectilesToRemove.add(projIndex);
            setScore((prevScore) => prevScore + 10);
          }
        });
      });

      if (
        projectilesToRemove.size > 0 ||
        newInvaders.length !== invaders.length
      ) {
        setInvaders(newInvaders);
        setPlayerProjectiles((prev) =>
          prev.filter((_, index) => !projectilesToRemove.has(index))
        );
      }

      const playerHit = invaderProjectiles.some(
        (proj) =>
          proj.x < playerPos.x + PLAYER_WIDTH &&
          proj.x + PROJECTILE_WIDTH > playerPos.x &&
          proj.y < playerPos.y + PLAYER_HEIGHT &&
          proj.y + PROJECTILE_HEIGHT > playerPos.y
      );
      if (playerHit) {
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) setGameOver(true);
          return newLives;
        });
        setInvaderProjectiles([]);
      }

      if (
        invaders.length === 0 ||
        invaders.some((inv) => inv.y + INVADER_SIZE >= playerPos.y)
      ) {
        setGameOver(true);
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [
      keys,
      playerPos,
      gameStarted,
      gameOver,
      invaders,
      invaderDirection,
      playerProjectiles,
      invaderProjectiles,
    ]
  );

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop, gameStarted, gameOver]);

  return (
    <div className="si-game-wrapper">
      <div className="si-game-info">
        <span>Pontos: {score}</span>
        <span>Vidas: {lives}</span>
      </div>
      <div
        className="si-game-container"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {(!gameStarted || gameOver) && (
          <div className="si-overlay">
            <h1>
              {gameOver
                ? invaders.length === 0
                  ? "Você Venceu!"
                  : "Fim de Jogo"
                : "Space Invaders"}
            </h1>
            <button className="si-start-button" onClick={startGame}>
              {gameOver ? "Jogar Novamente" : "Iniciar"}
            </button>
          </div>
        )}

        <div
          className="si-player"
          style={{ left: `${playerPos.x}px`, top: `${playerPos.y}px` }}
        />

        {playerProjectiles.map((proj, i) => (
          <div
            key={`pp-${i}`}
            className="si-projectile player"
            style={{ left: `${proj.x}px`, top: `${proj.y}px` }}
          />
        ))}
        {invaderProjectiles.map((proj, i) => (
          <div
            key={`ip-${i}`}
            className="si-projectile invader"
            style={{ left: `${proj.x}px`, top: `${proj.y}px` }}
          />
        ))}
        {invaders.map((invader) => (
          <div
            key={invader.id}
            className="si-invader"
            style={{ left: `${invader.x}px`, top: `${invader.y}px` }}
          />
        ))}
      </div>
    </div>
  );
}
