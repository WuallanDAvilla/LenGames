import React, { useState, useEffect, useCallback } from 'react';
import './JogoDaCobrinha.css';

const GRID_SIZE = 20;
const TILE_SIZE = 20; 

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
    do {
        position = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
    } while (position.x === 10 && position.y === 10);
    return position;
}


export function JogoDaCobrinha() {
    const [gameState, setGameState] = useState(createInitialState());
    const [isRunning, setIsRunning] = useState(false);

    const { snake, food, direction, isGameOver, score } = gameState;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction.y === 0) setGameState(prev => ({ ...prev, direction: { x: 0, y: -1 } }));
                break;
            case 'ArrowDown':
                if (direction.y === 0) setGameState(prev => ({ ...prev, direction: { x: 0, y: 1 } }));
                break;
            case 'ArrowLeft':
                if (direction.x === 0) setGameState(prev => ({ ...prev, direction: { x: -1, y: 0 } }));
                break;
            case 'ArrowRight':
                if (direction.x === 0) setGameState(prev => ({ ...prev, direction: { x: 1, y: 0 } }));
                break;
        }
    }, [direction]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const startGame = () => {
        setGameState(createInitialState());
        setIsRunning(true);
    };

    useEffect(() => {
        if (!isRunning || isGameOver) return;

        const gameInterval = setInterval(() => {
            setGameState(prev => {
                const newSnake = [...prev.snake];
                const head = { x: newSnake[0].x + prev.direction.x, y: newSnake[0].y + prev.direction.y };
                let newScore = prev.score;
                let newFood = prev.food;

                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || newSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
                    setIsRunning(false);
                    return { ...prev, isGameOver: true };
                }

                newSnake.unshift(head);

                if (head.x === newFood.x && head.y === newFood.y) {
                    newScore += 10;
                    newFood = getRandomPosition();
                } else {
                    newSnake.pop();
                }

                return { ...prev, snake: newSnake, score: newScore, food: newFood };
            });
        }, 150);

        return () => clearInterval(gameInterval);
    }, [isRunning, isGameOver]);

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
                        className={`snake-segment ${index === 0 ? 'head' : ''}`}
                        style={{ left: `${segment.x * TILE_SIZE}px`, top: `${segment.y * TILE_SIZE}px` }}
                    />
                ))}
                <div
                    className="snake-food"
                    style={{ left: `${food.x * TILE_SIZE}px`, top: `${food.y * TILE_SIZE}px` }}
                />
            </div>
            {!isRunning && (
                <div className="game-start-overlay">
                    {isGameOver && <div>Fim de Jogo!</div>}
                    <button onClick={startGame} className="snake-start-button">
                        {isGameOver ? 'Jogar Novamente' : 'Iniciar Jogo'}
                    </button>
                </div>
            )}
        </div>
    );
}