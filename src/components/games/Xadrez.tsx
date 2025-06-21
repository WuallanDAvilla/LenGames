// src/components/games/Xadrez.tsx

import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useAuth } from "../../contexts/AuthContext";
import { LoginToPlay } from "../LoginToPlay";
import "./Xadrez.css";

type Player = "Brancas" | "Pretas";

export function Xadrez() {
  const { currentUser } = useAuth();
  const [game, setGame] = useState(new Chess());

  function safeGameMutate(modify: (g: Chess) => void) {
    setGame((g) => {
      const newGame = new Chess(g.fen());
      modify(newGame);
      return newGame;
    });
  }

  useEffect(() => {
    // A lógica da IA só roda se o usuário estiver logado
    if (game.isGameOver() || game.turn() !== "b" || !currentUser) {
      return;
    }

    const timer = setTimeout(() => {
      const possibleMoves = game.moves();
      if (possibleMoves.length === 0) return;
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      const move = possibleMoves[randomIndex];
      safeGameMutate((g) => {
        g.move(move);
      });
    }, 700);

    return () => clearTimeout(timer);
  }, [game, currentUser]);

  function onDrop(sourceSquare: string, targetSquare: string): boolean {
    // Ação de mover a peça é protegida
    if (game.turn() !== "w" || !currentUser) return false;

    let moveSuccessful = false;
    safeGameMutate((g) => {
      const move = g.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (move !== null) {
        moveSuccessful = true;
      }
    });
    return moveSuccessful;
  }

  function handleReset() {
    // O reset não precisa de proteção
    safeGameMutate((g) => {
      g.reset();
    });
  }

  // A barreira de login
  if (!currentUser) {
    return <LoginToPlay gameName="Xadrez" />;
  }

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

  // O jogo
  return (
    <div
      className={`chess-container ${isComputerTurn ? "computer-thinking" : ""}`}
    >
      <div className="chessboard-wrapper">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={560}
          // Apenas permite arrastar peças se o usuário estiver logado e não for game over
          arePiecesDraggable={
            !isGameOver && game.turn() === "w" && !!currentUser
          }
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
