import React, { useState, useEffect, useCallback } from 'react';
import './JogoDaCobrinha.css';

const GRID_SIZE = 20;
const TILE_SIZE = 20; 

type Position = { x: number; y: number };

const getRandomPosition = (): Position => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
});

export function JogoDaCobrinha() {
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Position>(getRandomPosition());
    const [direction, setDirection] = useState<Position>({ x: 0, y: -1 }); 
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isGameRunning, setIsGameRunning] = useState(false);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction.y === 0) setDirection({ x: 0, y: -1 });
                break;
            case 'ArrowDown':
                if (direction.y === 0) setDirection({ x: 0, y: 1 });
                break;
            case 'ArrowLeft':
                if (direction.x === 0) setDirection({ x: -1, y: 0 });
                break;
            case 'ArrowRight':
                if (direction.x === 0) setDirection({ x: 1, y: 0 });
                break;
        }
    }, [direction]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(getRandomPosition());
        setDirection({ x: 0, y: -1 });
        setIsGameOver(false);
        setScore(0);
        setIsGameRunning(true);
    };

    useEffect(() => {
        if (!isGameRunning || isGameOver) return;

        const gameInterval = setInterval(() => {
            setSnake(prevSnake => {
                const newSnake = [...prevSnake];
                const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                    setIsGameOver(true);
                    return prevSnake;
                }

                for (let i = 1; i < newSnake.length; i++) {
                    if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
                        setIsGameOver(true);
                        return prevSnake;
                    }
                }

                newSnake.unshift(head); 
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 10);
                    setFood(getRandomPosition());
                } else {
                    newSnake.pop(); 
                }

                return newSnake;
            });
        }, 150); 

        return () => clearInterval(gameInterval);
    }, [snake, direction, isGameOver, isGameRunning, food.x, food.y]);

    return (
        <div className="snake-game-container">
            <div className="snake-score-display">Pontuação: {score}</div>
            <div 
                className="snake-grid" 
                style={{ width: GRID_SIZE * TILE_SIZE, height: GRID_SIZE * TILE_SIZE }}
            >
                {snake.map((segment, index) => (
                    <div 
                        key={index} 
                        className="snake-segment" 
                        style={{ left: segment.x * TILE_SIZE, top: segment.y * TILE_SIZE }}
                    />
                ))}
                <div 
                    className="snake-food" 
                    style={{ left: food.x * TILE_SIZE, top: food.y * TILE_SIZE }}
                />
            </div>
            {!isGameRunning && !isGameOver && (
                <button onClick={resetGame} className="snake-start-button">Iniciar Jogo</button>
            )}
            {isGameOver && (
                <div className="game-over-overlay">
                    <div>Fim de Jogo!</div>
                    <button onClick={resetGame} className="snake-start-button">Jogar Novamente</button>
                </div>
            )}
        </div>
    );
}