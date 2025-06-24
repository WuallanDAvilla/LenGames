import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../services/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { GlobalLoader } from "../components/GlobalLoader/GlobalLoader";
import "../styles/Profile.css"; 

interface UserProfile {
  displayName: string;
  photoURL: string;
  geniusHighScore: number;
  createdAt: { toDate: () => Date }; 
}

export function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!username) {
        setLoading(false);
        setError("Nenhum nome de usuário fornecido.");
        return;
      }

      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("username", "==", username.toLowerCase()),
          limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("Usuário não encontrado.");
        } else {
          const userData = querySnapshot.docs[0].data() as UserProfile;
          setUserProfile(userData);
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        setError("Ocorreu um erro ao buscar este perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  if (loading) {
    return <GlobalLoader />;
  }

  if (error) {
    return (
      <div className="profile-page-container">
        <div className="profile-card">
          <h1>Erro</h1>
          <p>{error}</p>
          <Link to="/" className="profile-button">
            Voltar para a Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        {userProfile && (
          <>
            <div className="profile-header">
              <img
                src={userProfile.photoURL}
                alt={`Avatar de ${userProfile.displayName}`}
                className="profile-avatar"
              />
              <h1 className="profile-name">{userProfile.displayName}</h1>
            </div>
            <div className="profile-details">
              <p>
                <strong>Membro desde:</strong>{" "}
                {userProfile.createdAt.toDate().toLocaleDateString()}
              </p>
              <p>
                <strong>Recorde no Genius:</strong>{" "}
                {userProfile.geniusHighScore}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
