import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import "./Xadrez.css";

type Player = "Brancas" | "Pretas";

export function Xadrez() {
  const [game, setGame] = useState(new Chess());

  // A função para mutação segura continua a mesma, é uma ótima prática.
  function safeGameMutate(modify: (g: Chess) => void) {
    setGame((g) => {
      const newGame = new Chess(g.fen());
      modify(newGame);
      return newGame;
    });
  }

  // A GRANDE MUDANÇA: Usamos useEffect para reagir à vez do computador.
  useEffect(() => {
    // Se o jogo acabou OU não é a vez do computador (Pretas), não fazemos nada.
    if (game.isGameOver() || game.turn() !== "b") {
      return;
    }

    // Se chegou aqui, é a vez do computador.
    const timer = setTimeout(() => {
      const possibleMoves = game.moves();

      // Se por algum motivo não houver movimentos (empate, etc.)
      if (possibleMoves.length === 0) return;

      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      const move = possibleMoves[randomIndex];

      // Executa o movimento do computador.
      safeGameMutate((g) => {
        g.move(move);
      });
    }, 700); // Um delay para simular o "pensamento"

    // Limpa o timer caso o componente seja desmontado.
    return () => clearTimeout(timer);
  }, [game]); // <-- Este hook roda toda vez que o estado 'game' muda.

  // A função onDrop agora é MUITO mais simples.
  function onDrop(sourceSquare: string, targetSquare: string): boolean {
    // O jogador só pode mover na sua vez.
    if (game.turn() !== "w") return false;

    let moveSuccessful = false;
    safeGameMutate((g) => {
      const move = g.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      // Se o movimento for válido, a biblioteca não retorna null.
      if (move !== null) {
        moveSuccessful = true;
      }
    });

    // O useEffect cuidará do resto!
    return moveSuccessful;
  }

  // A função de reset continua a mesma.
  function handleReset() {
    safeGameMutate((g) => {
      g.reset();
    });
  }

  // A lógica de UI continua a mesma.
  const isGameOver = game.isGameOver();
  const isComputerTurn = game.turn() === "b" && !isGameOver;

  let gameStatusMessage: string;
  let winner: Player | null = null;

  if (game.isCheckmate()) {
    gameStatusMessage = "Xeque-mate!";
    winner = game.turn() === "w" ? "Pretas" : "Brancas";
  } else if (game.isDraw()) {
    gameStatusMessage = "Empate!";
  } else {
    gameStatusMessage = "Em andamento";
  }

  return (
    <div
      className={`chess-container ${isComputerTurn ? "computer-thinking" : ""}`}
    >
      <div className="chessboard-wrapper">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={560}
          arePiecesDraggable={!isGameOver && game.turn() === "w"}
        />
      </div>
      <div className="chess-info">
        {isGameOver ? (
          <div className="game-over-status">
            <h2>Fim de Jogo</h2>
            <p className="status-message">{gameStatusMessage}</p>
            {winner && <p>Vencedor: {winner}</p>}
          </div>
        ) : (
          <div className="game-status">
            <h2>
              Vez de: {game.turn() === "w" ? "Brancas (Você)" : "Pretas (PC)"}
            </h2>
            {game.inCheck() && <p className="check-warning">XEQUE!</p>}
          </div>
        )}
        <button className="reset-button-chess" onClick={handleReset}>
          Reiniciar Jogo
        </button>
      </div>
    </div>
  );
}
