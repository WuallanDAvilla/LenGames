import { useState, useEffect } from "react";
import "./JogoDaVelha.css";

// Componente para um único quadrado do tabuleiro
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
  // NOVO: Estado para controlar o modo de jogo (ainda não selecionado)
  const [gameMode, setGameMode] = useState<"pvp" | "pvc" | null>(null);

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Determina se é a vez do computador (apenas no modo PVC e se for a vez de 'O')
  const isComputerTurn = gameMode === "pvc" && !xIsNext;

  // Lógica para o computador fazer sua jogada
  useEffect(() => {
    // Se não for a vez do computador ou se o jogo já acabou, não faz nada
    if (!isComputerTurn || calculateWinner(squares)) {
      return;
    }

    // Adiciona um pequeno "delay" para simular o computador "pensando"
    const timer = setTimeout(() => {
      // Encontra todos os quadrados vazios
      const emptySquaresIndexes: number[] = [];
      squares.forEach((square, index) => {
        if (square === null) {
          emptySquaresIndexes.push(index);
        }
      });

      // Escolhe um quadrado vazio aleatoriamente
      const randomIndex = Math.floor(
        Math.random() * emptySquaresIndexes.length
      );
      const computerMove = emptySquaresIndexes[randomIndex];

      // Aplica a jogada do computador
      const nextSquares = squares.slice();
      nextSquares[computerMove] = "O";
      setSquares(nextSquares);
      setXIsNext(true); // Passa a vez de volta para o jogador
    }, 700); // 700ms de "pensamento"

    // Limpa o timeout se o componente for desmontado
    return () => clearTimeout(timer);
  }, [isComputerTurn, squares, gameMode]);

  function handleClick(i: number) {
    // Não permite clicar se o quadrado já está preenchido, se o jogo acabou, ou se for a vez do computador
    if (squares[i] || calculateWinner(squares) || isComputerTurn) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setGameMode(null); // Volta para a tela de seleção de modo
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // Se nenhum modo de jogo foi selecionado, mostra a tela de seleção
  if (!gameMode) {
    return (
      <div className="tictactoe-container">
        <div className="mode-selection">
          <h2>Escolha o modo de jogo:</h2>
          <button className="mode-button" onClick={() => setGameMode("pvp")}>
            Jogador vs Jogador
          </button>
          <button className="mode-button" onClick={() => setGameMode("pvc")}>
            Jogador vs Computador
          </button>
        </div>
      </div>
    );
  }

  // Lógica para determinar o status do jogo (vencedor, empate, próximo jogador)
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
      {/* Adiciona uma classe 'disabled' quando for a vez do computador */}
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

// Função auxiliar para calcular o vencedor (permanece a mesma)
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
