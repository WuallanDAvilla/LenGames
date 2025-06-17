// src/pages/Leaderboard.tsx

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import '../styles/Leaderboard.css'; // Vamos criar este CSS

// Definimos um tipo para os dados do jogador que vamos buscar
interface PlayerData {
  id: string;
  name: string;
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
        // Consultamos a coleção 'users'
        const usersCollectionQuery = query(
          collection(db, 'users'), 
          // Ordenamos pelo campo 'geniusHighScore' em ordem decrescente.
          // Só usuários que jogaram e têm esse campo aparecerão.
          orderBy('geniusHighScore', 'desc'), 
          // Limitamos aos 10 melhores resultados.
          limit(10)
        );

        const querySnapshot = await getDocs(usersCollectionQuery);
        
        const players: PlayerData[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          players.push({
            id: doc.id,
            name: data.displayName || 'Usuário Anônimo',
            avatarUrl: data.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${doc.id}`,
            highScore: data.geniusHighScore
          });
        });
        
        setTopPlayers(players);
      } catch (error) {
        console.error("Erro ao buscar a leaderboard:", error);
        // Pode ser necessário criar um índice no Firestore. O erro no console do navegador dará o link!
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="leaderboard-loader">Carregando Ranking...</div>;
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard - Genius 🏆</h1>
        <p>Veja quem são os 10 melhores jogadores!</p>
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
              <tr key={player.id} className={index < 3 ? `top-${index + 1}` : ''}>
                <td className="rank-cell">{index + 1}</td>
                <td className="player-cell">
                  <img src={player.avatarUrl} alt={player.name} className="player-avatar" />
                  <span>{player.name}</span>
                </td>
                <td className="score-cell">{player.highScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {topPlayers.length === 0 && !loading && (
          <p className="no-players-message">Ninguém jogou ainda. Seja o primeiro a deixar sua marca!</p>
        )}
      </div>
    </div>
  );
}