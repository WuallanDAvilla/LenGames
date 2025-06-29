import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { LoginToPlay } from "../../../components/LoginToPlay/LoginToPlay";
import "./JogoDaVelha.css";

function Square({
  value,
  onSquareClick,
}: {
  value: "X" | "O" | null;
  onSquareClick: () => void;
}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export function JogoDaVelha() {
  const { currentUser } = useAuth();
  const [gameMode, setGameMode] = useState<"pvp" | "pvc" | null>(null);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const isComputerTurn = gameMode === "pvc" && !xIsNext;

  useEffect(() => {
    if (!isComputerTurn || calculateWinner(squares) || !currentUser) {
      return;
    }

    const timer = setTimeout(() => {
      const emptySquaresIndexes: number[] = [];
      squares.forEach((square, index) => {
        if (square === null) {
          emptySquaresIndexes.push(index);
        }
      });

      const randomIndex = Math.floor(
        Math.random() * emptySquaresIndexes.length
      );
      const computerMove = emptySquaresIndexes[randomIndex];

      const nextSquares = squares.slice();
      nextSquares[computerMove] = "O";
      setSquares(nextSquares);
      setXIsNext(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [isComputerTurn, squares, gameMode, currentUser]);

  function handleModeSelection(mode: "pvp" | "pvc") {
    if (!currentUser) return;
    setGameMode(mode);
  }

  function handleClick(i: number) {
    if (
      squares[i] ||
      calculateWinner(squares) ||
      isComputerTurn ||
      !currentUser
    ) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setGameMode(null);
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  if (!currentUser) {
    return <LoginToPlay gameName="Jogo da Velha" />;
  }

  if (!gameMode) {
    return (
      <div className="tictactoe-container">
        <div className="mode-selection">
          <h2>Escolha o modo de jogo:</h2>
          <button
            className="mode-button"
            onClick={() => handleModeSelection("pvp")}
          >
            Jogador vs Jogador
          </button>
          <button
            className="mode-button"
            onClick={() => handleModeSelection("pvc")}
          >
            Jogador vs Computador
          </button>
        </div>
      </div>
    );
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Vencedor: " + winner;
  } else if (squares.every(Boolean)) {
    status = "Empate!";
  } else {
    status = "Próximo a jogar: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="tictactoe-container">
      <div className="status">{status}</div>
      <div className={`board ${isComputerTurn ? "disabled" : ""}`}>
        {squares.map((_, i) => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
      <button className="reset-button" onClick={handleReset}>
        Mudar Modo / Reiniciar
      </button>
    </div>
  );
}

function calculateWinner(squares: Array<"X" | "O" | null>) {
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
