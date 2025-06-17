// src/components/games/JogoDaVelha.tsx

import { useState } from 'react';
import './JogoDaVelha.css';

// Componente para um único quadrado do tabuleiro
function Square({ value, onSquareClick }: { value: string | null, onSquareClick: () => void }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

export function JogoDaVelha() {
    const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    function handleClick(i: number) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    function handleReset() {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Vencedor: ' + winner;
    } else if (squares.every(Boolean)) {
        status = 'Empate!';
    } else {
        status = 'Próximo a jogar: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <div className="tictactoe-container">
            <div className="status">{status}</div>
            <div className="board">
                {squares.map((_, i) => (
                    <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
                ))}
            </div>
            <button className="reset-button" onClick={handleReset}>Reiniciar Jogo</button>
        </div>
    );
}

// Função auxiliar para determinar o vencedor
function calculateWinner(squares: (string | null)[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}