import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

/**
 * Atualiza o high score de um usuário para um jogo específico.
 * Só atualiza se a nova pontuação for maior que a anterior.
 * @param userId - O ID do usuário.
 * @param gameId - O ID do jogo (ex: 'genius', 'tetris').
 * @param newScore - A nova pontuação do jogador.
 */
export const updateUserHighScore = async (
  userId: string,
  gameId: string,
  newScore: number
) => {
  if (!userId || !gameId || newScore === undefined) return;

  const userDocRef = doc(db, "users", userId);

  try {
    const userDocSnap = await getDoc(userDocRef);
    const currentHighScore = userDocSnap.data()?.highScores?.[gameId] || 0;

    if (newScore > currentHighScore) {
      await setDoc(
        userDocRef,
        {
          highScores: {
            [gameId]: newScore,
          },
        },
        { merge: true }
      );
      console.log(`High score para ${gameId} atualizado para ${newScore}!`);
    }
  } catch (error) {
    console.error("Erro ao atualizar high score:", error);
    throw error;
  }
};

/**
 * Busca os melhores jogadores para um jogo específico.
 * @param gameId - O ID do jogo para o qual buscar o ranking.
 * @param count - O número de jogadores a serem retornados.
 * @returns Uma promessa que resolve para um array de dados dos jogadores.
 */
export const fetchTopPlayersForGame = async (gameId: string, count: number) => {
  const usersQuery = query(
    collection(db, "users"),
    orderBy(`highScores.${gameId}`, "desc"),
    limit(count)
  );

  const querySnapshot = await getDocs(usersQuery);

  return querySnapshot.docs
    .map((doc) => {
      const data = doc.data();
      if (data.highScores && data.highScores[gameId] !== undefined) {
        return {
          id: doc.id,
          name: data.displayName || "Usuário Anônimo",
          username: data.username || data.displayName,
          avatarUrl:
            data.photoURL ||
            `https://api.dicebear.com/8.x/bottts/svg?seed=${doc.id}`,
          highScore: data.highScores[gameId],
        };
      }
      return null;
    })
    .filter((player) => player !== null);
};
