import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom"; 
import { GlobalLoader } from "../components/GlobalLoader"; 
import "../styles/Leaderboard.css";

interface PlayerData {
  id: string;
  name: string; 
  username: string; 
  avatarUrl: string;
  highScore: number;
}

export function Leaderboard() {
  const [topPlayers, setTopPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const usersQuery = query(
          collection(db, "users"),
          orderBy("geniusHighScore", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(usersQuery);

        const players: PlayerData[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.displayName || "Usuário Anônimo",
            username: data.username || data.displayName, 
            avatarUrl:
              data.photoURL ||
              `https://api.dicebear.com/8.x/bottts/svg?seed=${doc.id}`,
            highScore: data.geniusHighScore || 0,
          };
        });

        setTopPlayers(players);
      } catch (error) {
        console.error("Erro ao buscar a leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <div className="container">
      <div className="leaderboard-header">
        <h1 className="section-title">🏆 Classificação - Genius 🏆</h1>
        <p className="section-subtitle">
          Veja quem são os 10 melhores jogadores da nossa comunidade!
        </p>
      </div>
      <div className="leaderboard-table-container">
        <table>
          <thead>
            <tr>
              <th className="rank-cell">Rank</th>
              <th>Jogador</th>
              <th className="score-cell">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((player, index) => (
              <tr
                key={player.id}
                className={index < 3 ? `podium top-${index + 1}` : ""}
              >
                <td className="rank-cell">
                  <span className="rank-icon">{index < 3 ? "★" : ""}</span>
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
        {topPlayers.length === 0 && !loading && (
          <p className="no-players-message">
            Ninguém jogou ainda. Seja o primeiro a deixar sua marca!
          </p>
        )}
      </div>
    </div>
  );
}
