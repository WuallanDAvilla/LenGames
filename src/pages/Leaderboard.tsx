import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { GlobalLoader } from "../components/GlobalLoader/GlobalLoader";
import { fetchTopPlayersForGame } from "../services/firebase";
import { gamesList, type GameInfo } from "../constants/gamesData";
import styles from "../styles/Leaderboard.module.css";

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

const GameLeaderboard = ({
  game,
  players,
  isLoading,
}: GameLeaderboardProps) => (
  <div className={styles.leaderboardCard}>
    <h2 className={styles.leaderboardCardTitle}>{game.name}</h2>
    <div className={styles.leaderboardTableContainer}>
      {isLoading ? (
        <p className={styles.loadingMessage}>Carregando ranking...</p>
      ) : players.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th className={styles.rankCell}>#</th>
              <th>Jogador</th>
              <th className={styles.scoreCell}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player: PlayerData, index: number) => (
              <tr
                key={player.id}
                className={
                  index < 3
                    ? `${styles.podium} ${styles[`top-${index + 1}`]}`
                    : ""
                }
              >
                <td className={styles.rankCell}>
                  <span className={styles.rankIcon}>
                    {index < 3 ? "🏆" : ""}
                  </span>
                  {index + 1}
                </td>
                <td className={styles.playerCell}>
                  <Link to={`/perfil/${player.username}`}>
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className={styles.playerAvatar}
                    />
                    <span>{player.name}</span>
                  </Link>
                </td>
                <td className={styles.scoreCell}>{player.highScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noPlayersMessage}>
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
      <div className={styles.leaderboardHeader}>
        <h1>🏆 Hall da Fama 🏆</h1>
        <p className={styles.sectionSubtitle}>
          Confira os melhores jogadores em cada um dos nossos jogos!
        </p>
      </div>
      <div className={styles.leaderboardsGrid}>
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
