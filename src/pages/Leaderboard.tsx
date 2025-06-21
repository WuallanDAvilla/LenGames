// src/pages/Leaderboard.tsx

import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { GlobalLoader } from "../components/GlobalLoader";
import { fetchTopPlayersForGame } from "../firebase";
// Corrigido o caminho para refletir a estrutura do seu projeto
import { gamesList, type GameInfo } from "../data/gamesData";
import "../styles/Leaderboard.css";
interface PlayerData {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  highScore: number;
}

interface GameLeaderboardProps {
  game: GameInfo;
  players: PlayerData[];
  isLoading: boolean;
}

// O componente interno GameLeaderboard foi ajustado
const GameLeaderboard = ({
  game,
  players,
  isLoading,
}: GameLeaderboardProps) => (
  // Cada ranking agora é um 'card' individual
  <div className="leaderboard-card">
    <h2 className="leaderboard-card-title">{game.name}</h2>
    <div className="leaderboard-table-container">
      {isLoading ? (
        <p className="loading-message">Carregando ranking...</p>
      ) : players.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th className="rank-cell">Rank</th>
              <th>Jogador</th>
              <th className="score-cell">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player: PlayerData, index: number) => (
              <tr
                key={player.id}
                className={index < 3 ? `podium top-${index + 1}` : ""}
              >
                <td className="rank-cell">
                  <span className="rank-icon">{index < 3 ? "🏆" : ""}</span>
                  {index + 1}
                </td>
                <td className="player-cell">
                  <Link to={`/perfil/${player.username}`}>
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className="player-avatar"
                    />
                    <span>{player.name}</span>
                  </Link>
                </td>
                <td className="score-cell">{player.highScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-players-message">
          Ninguém marcou pontos neste jogo ainda. Que tal ser o primeiro?
        </p>
      )}
    </div>
  </div>
);

export function Leaderboard() {
  const [leaderboards, setLeaderboards] = useState<{
    [key: string]: PlayerData[];
  }>({});
  const [loading, setLoading] = useState(true);

  const gamesWithLeaderboard = useMemo(
    () => gamesList.filter((game: GameInfo) => game.hasLeaderboard),
    []
  );

  const fetchAllLeaderboards = useCallback(async () => {
    if (gamesWithLeaderboard.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const leaderboardPromises = gamesWithLeaderboard.map((game: GameInfo) =>
        fetchTopPlayersForGame(game.id, 3)
      );
      const results = await Promise.all(leaderboardPromises);
      const newLeaderboards: { [key: string]: PlayerData[] } = {};
      gamesWithLeaderboard.forEach((game: GameInfo, index: number) => {
        const gameResult = results[index];
        if (gameResult) {
          newLeaderboards[game.id] = gameResult as PlayerData[];
        }
      });
      setLeaderboards(newLeaderboards);
    } catch (error) {
      console.error("Erro ao buscar as leaderboards:", error);
    } finally {
      setLoading(false);
    }
  }, [gamesWithLeaderboard]);

  useEffect(() => {
    fetchAllLeaderboards();
  }, [fetchAllLeaderboards]);

  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <div className="container">
      <div className="leaderboard-header">
        <h1>🏆 Hall da Fama 🏆</h1>
        <p className="section-subtitle">
          Confira os melhores jogadores em cada um dos nossos jogos!
        </p>
      </div>
      <div className="leaderboards-grid">
        {gamesWithLeaderboard.map((game: GameInfo) => (
          <GameLeaderboard
            key={game.id}
            game={game}
            players={leaderboards[game.id] || []}
            isLoading={!leaderboards[game.id]}
          />
        ))}
      </div>
    </div>
  );
}
